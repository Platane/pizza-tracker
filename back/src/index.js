import * as config                  from './config'
import {create as createFetcher}    from './twitter'
import {create as createStorage}    from './storage'
import regeneratorRuntime           from 'regenerator-runtime'



const removeDuplicate = arr =>
    arr.filter( (x,i,arr) => i == arr.findIndex( u => u.tweet_id == x.tweet_id ) )

const shouldUpdateUser = ( old_user, new_user ) =>
    new_user.counts.some( x => !old_user.counts.some( u => u.tweet_id == x.tweet_id) )

export const update = async ( all: boolean = false  ) => {

    const fetcher = createFetcher(config.twitter)
    const storage = createStorage(config.gist)

    const stored_users = await storage.read()

    const new_users = await Promise.all(
        stored_users
            .map( async ({ userName, counts }) => {

                const lastCount         = counts.reduce( (max,{date}) => Math.max( max, date ), 0 )
                const lastCheckDate     = (new Date('01/01/2017')).getTime()

                const searchSince       = Math.max( lastCount, lastCheckDate )

                const new_counts        = await ( all ? fetcher.fetchAll : fetcher.fetch )( userName, searchSince )

                return {
                    userName,
                    counts : removeDuplicate([ ...counts, ...new_counts ])
                }
            })
    )

    const toUpdate = stored_users
        .filter( (_, i) => shouldUpdateUser( stored_users[i], new_users[i] ) )

    await toUpdate.length > 0 && storage.write( toUpdate )
}
