import * as config                  from './config'
import {create as createFetcher}    from './twitter'
import {create as createStorage}    from './storage'
import regeneratorRuntime           from 'regenerator-runtime'



const removeDuplicate = arr =>
    arr.filter( (x,i,arr) => i == arr.findIndex( u => u.tweet_id == x.tweet_id ) )

export const update = async ( all: boolean = false  ) => {

    const fetcher = createFetcher(config.twitter)
    const storage = createStorage(config.gist)

    let users = await storage.read()

    for ( let i=0; i < users.length; i ++ ) {

        const { userName, counts } = users[i]
        const lastDate = counts.reduce( (max,{date}) => Math.max( max, date ), (new Date('01/01/2017')).getTime() )

        const results = await ( all ? fetcher.fetchAll : fetcher.fetch )( userName, lastDate )

        users[i].counts = removeDuplicate([
            ...results.filter( x => !counts.some( u => x.tweet_id == u.tweet_id ) )
            ,
            ...counts,
        ])
    }

    await storage.write( users )
}
