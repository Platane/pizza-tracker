import * as config                  from './config'
import {create as createFetcher}    from './twitter'
import {create as createStorage}    from './storage'
import regeneratorRuntime           from 'regenerator-runtime'

const START_OF_TIME = (new Date('01/01/2017')).getTime()

const removeDuplicate = arr =>
    arr.filter( (x,i,arr) => i == arr.findIndex( u => u.tweet_id == x.tweet_id ) )

const shouldUpdateUser = ( old_user, new_user ) =>
    new_user.counts.some( x => !old_user.counts.some( u => u.tweet_id == x.tweet_id) )
    ||
    ( old_user.lastCheckDate || 0 ) + 1000*60*60*24*7 < ( new_user.lastCheckDate || 0 )

/**
 * read the users to update from the storage,
 * update the user ( = read the new counts )
 * if the user have changed, repercute the change in the storage
 *
 */
export const update = async ( all: boolean = false  ) : Promise<void> => {

    const fetcher = createFetcher(config.twitter)
    const storage = createStorage(config.gist)

    // get the users from the storage
    const stored_users = await storage.read()

    // get the new users, read the new counts
    const new_users = await Promise.all(
        stored_users
            .map( async ({ userName, counts, lastCheckDate }) => {

                // the date of the most recent count
                const lastCount         = counts.reduce( (max,{date}) => Math.max( max, date ), 0 )

                // the new counts should be searched in a period from <searchSince> to now
                const searchSince       = Math.max( lastCount, lastCheckDate || 0, START_OF_TIME )

                // search new counts for the user,
                // if the flag 'all' is set to true, search since the start of time
                // use the fetchAll function, as the fetchLast does not includes RT
                const new_counts        = await fetcher.fetchAll( userName, all ? START_OF_TIME : searchSince )

                return {
                    userName,
                    counts          : removeDuplicate([ ...counts, ...new_counts ]),
                    lastCheckDate   : Date.now(),
                }
            })
    )

    const toUpdate = new_users
        .filter( (_, i) => shouldUpdateUser( stored_users[i], new_users[i] ) )

    await toUpdate.length > 0 && storage.write( toUpdate )
}
