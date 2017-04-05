import React                    from 'react'

import style                    from './style.css'
import {Tweet}                  from './tweet'

export type Props = {
    k       : number,
    tweets  : Array<{
        tweet_id    : string,
        date        : number,
        i           : number,
    }>
}

const START_DATE    = (new Date('2017-01-01T00:00:00.100Z')).getTime()
const END_DATE      = (new Date('2017-12-31T23:59:59.100Z')).getTime()

const SIZE_CHART    = [ 1, 0.3, 0.1, 0.01, 0.005, ...Array.from({ length: 99 }).map( _ => 0 ) ]
const POS_CHART     = [ 0, 0.6, 0.8, 0.92, 0.980, ...Array.from({ length: 99 }).map( _ => 1 ) ]

const convert = x =>
    12 * Math.min(1, Math.max(0, ( x - START_DATE )/( END_DATE - START_DATE ) ))


const computePosition = ({ tweets, k }: Props) => {

    const a = tweets.reduce( (u, {date}, i) => convert(date) < k ? i : u, -1 )
    const b = a+1

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

            return { tweet_id, y, s:Math.round(s*100)/100 }
        })
}

const TweetList_ = ({ tweets, width }) => console.log( tweets.map( x => x.s) ) ||
    <div className={style.container}>
        { tweets
            .map( ({ tweet_id, y, s }) =>
                <div
                    key={tweet_id}
                    className={style.item}
                    style={{
                        zIndex      : Math.floor(10*s),
                        opacity     : s*2,
                        transform   : `translate3d(0,${Math.round((y+1)*200)}px,${s}px) scale(${s}) rotateX(${(-y)*30}deg)`
                    }}>

                    <div className={style.overlay} style={{ opacity: (1-s) }} />

                    <Tweet tweet_id={tweet_id} width={width} />
                </div>
            )
        }
    </div>


export const TweetList = (props: Props) =>
    <TweetList_ { ...{ ...props, tweets: computePosition(props) } } />