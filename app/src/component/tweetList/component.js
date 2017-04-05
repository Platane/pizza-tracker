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

const FADE_LIMIT    = 0.2


const convert = x =>
    12 * Math.min(1, Math.max(0, ( x - START_DATE )/( END_DATE - START_DATE ) ))

const computePosition = ({ tweets, k }: Props) => {

    const n = 2

    const s = tweets
        .slice()
        .sort( (a, b) => Math.abs(convert(a.date)-k) > Math.abs(convert(b.date)-k) ? 1 : -1 )
        .slice(0, n)

    const dist = s
        .map( ({date}) => convert(date)-k )

    const ponderation = s
        .map( (_, i) => 1/Math.abs(dist[i]+0.001) )

    const total = ponderation.reduce( (sum,p) => sum+p, 0 )

    let top = 0
    let bot = 0

    return s
        .map( ({tweet_id}, i) => {

            const s = ponderation[i] / total

            let y = 0

            if (dist[i] > 0) {

            } else {

            }

            return { s, y, tweet_id }
        })
}

const TweetList_ = ({ tweets }) =>
    <div className={style.container}>
        { tweets
            .map( ({ tweet_id, y, s }) => console.log( `translate3d(${s*40}px,${Math.round((y+1)*200)}px,${Math.abs(s)}px)` ) ||
                <div
                    key={tweet_id}
                    className={style.item}
                    style={{
                        opacity     : s,
                        transform   : `translate3d(${s*40}px,${Math.round((y+1)*200)}px,${Math.abs(s)}px)`
                    }}>

                    <Tweet tweet_id={tweet_id} width={250} />
                </div>
            )
        }
    </div>


export const TweetList = (props: Props) =>
    <TweetList_ { ...{ ...props, tweets: computePosition(props) } } />