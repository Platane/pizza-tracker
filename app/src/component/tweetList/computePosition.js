
const START_DATE    = (new Date('2017-01-01T00:00:00.100Z')).getTime()
const END_DATE      = (new Date('2017-12-31T23:59:59.100Z')).getTime()

const SIZE_CHART    = [ 1, 0.3, 0.1, 0.01, 0.005, ...Array.from({ length: 99 }).map( (_,i,arr) => 0.004 * ( 1 - i /arr.length ) ) ]
const POS_CHART     = [ 0, 0.6, 0.8, 0.92, 0.980, ...Array.from({ length: 99 }).map( _ => 1 ) ]

const convert = x =>
    12 * Math.min(1, Math.max(0, ( x - START_DATE )/( END_DATE - START_DATE ) ))

type Tweet = {
    tweet_id : number,
    date: number
}

/**
 * given an array of all tweets ( already sorted by date )
 * and a number k, between [0,1]
 *
 * return the position in [0,1] of each tweet
 *   also return s, which is bigger when the tweet is close to the value k
 *   and d, which is the distance from the value k
 */
export const computePosition = ( tweets:Tweet[] , k:number ) : {s:number, y:number}[] => {

    // find a and b, such as tweets[a].date <   k reported on the time scale  < tweets[b].date
    const a = tweets.reduce( (u, {date}, i) => convert(date) < k ? i : u, -1 )
    const b = a+1

    // compute alpha, such as alpha is the ponderation of the barycenter k
    //  k = alpha * tweets[a].date + (1-alpha) * tweets[b].date
    let alpha

    if ( a < 0 )
        alpha = 1

    else if ( b >= tweets.length )
        alpha = 0

    else {
        const da = convert(tweets[a].date)
        const db = convert(tweets[b].date)

        alpha = ( k - da )/( db - da )
    }

    return tweets
        .map( ({tweet_id}, i) => {

            let s=0
            let y=0

            if ( i == a ) {
                s = SIZE_CHART[0]*(1-alpha) + SIZE_CHART[1]*alpha
                y = -(POS_CHART[0]*(1-alpha) + POS_CHART[1]*alpha)

            } else if ( i == b ) {
                s = SIZE_CHART[0]*alpha + SIZE_CHART[1]*(1-alpha)
                y = POS_CHART[0]*alpha + POS_CHART[1]*(1-alpha)

            } else if ( i < a ) {
                s = SIZE_CHART[a-i]*(1-alpha) + SIZE_CHART[a-i+1]*alpha
                y = -(POS_CHART[a-i]*(1-alpha) + POS_CHART[a-i+1]*alpha)

            } else if ( i > b ) {
                s = SIZE_CHART[i-b]*alpha + SIZE_CHART[i-b+1]*(1-alpha)
                y = POS_CHART[i-b]*alpha + POS_CHART[i-b+1]*(1-alpha)
            }

            s = 1-(1-s)*(1-s)

            return { y, s, tweet_id }
        })
}
