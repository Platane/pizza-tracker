import Twitter                          from 'twitter'

import type {Count}                     from './commonType'
import type {Twitter as TwitterType}    from 'twitter'
import regeneratorRuntime               from 'regenerator-runtime'

type Config = {
    consumer_key            : string,
    consumer_secret         : string,
    access_token_key        : string,
    access_token_secret     : string,
}


/**
 * use the search api to preciselly search for the tweet
 * /!\ this allows to pull only recent tweet ( 7 days old max )
 */
const fetchLast = async ( client: TwitterType, userName: string ) : Promise<Array<Count>> => {
    const data = await client.get(
        'search/tweets',
        {
            q: `from:${ userName } count`
        }
    )
    return data.statuses
        .map( parse )
        .filter( Boolean )
        .sort( (a,b) => a.date < b.date ? 1 : -1 )
}



/**
 * pull all the timeline and search for the tweet which match the regExp
 * /!\ this is cost effective
 */
const fetchAll = async ( client: TwitterType, userName: string, since: number, cursor: ?string, k: ?number ) : Promise<Array<Count>> => {

    const { counts, nextCursor, oldestDate } = await _fetchTimeLine( client, userName, cursor )

    return removeDuplicate([
        ...counts,
        ...(
            k && k > 20 || oldestDate < since
                ? []
                : await fetchAll( client, userName, since, nextCursor, k ? 1+k : 1 )
        )
    ])
}

const _fetchTimeLine = async ( client: TwitterType, userName: string, cursor: ?string ) : Promise<{counts: Array<Count>, nextCursor:?string, oldestDate:number}> => {

    const data = await client.get(
        'statuses/user_timeline',
        {
            screen_name         : userName,
            exclude_replies     : true,
            contributor_details : false,
            include_rts         : false,
            trim_user           : true,
            count               : 200,
            ...( cursor ? { max_id: cursor } : {} ),
        }
    )

    const oldest = data.length > 0 && data.reduce( (oldest, x) => x.created_at < oldest.created_at ? x : oldest )

    return {
        counts      : data
            .map( parse )
            .filter( Boolean )
            .sort( (a,b) => a.date < b.date ? 1 : -1 )
        ,

        oldestDate  : oldest ?
            (new Date( oldest.created_at )).getTime()
            : Date.now()
        ,

        nextCursor  : oldest ? '' + ( oldest.id ) : null
    }
}

/**
 * use the best fitted fetch method
 */
const fetch = ( client: TwitterType, userName: string, since: number ) =>

    since > Date.now() - 7 * 24 * 60 * 60 * 1000
        ? fetchLast( client, userName, since )
        : fetchAll( client, userName, since )


const extractPizzaCount = ( text: string ): number | null =>  {
    const d = text.match(/🍕 *x *(\d+)/)
    return !d || !d[1] ? null : +d[1]
}

const removeDuplicate = arr =>
    arr.filter( (x,i,arr) => i == arr.findIndex( u => u.tweet_id == x.tweet_id ) )

const parse = ( x: Object ) : ?Count => {

    const count = extractPizzaCount( x.text )

    return count === null
        ? null
        : {
            tweet_id    : x.id_str,
            date        : (new Date( x.created_at )).getTime(),
            count,
        }
}



export const create = (config: Config) => {

    var client = new Twitter(config)

    return {
        fetch       : fetch.bind( null, client ),
        fetchLast   : fetchLast.bind( null, client ),
        fetchAll    : fetchAll.bind( null, client ),
    }
}
