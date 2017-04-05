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

export const TweetList = ({ tweets, k }: Props) =>
    <div className={style.container}>
        { tweets
            .map( ({ tweet_id, date }) =>
                <div key={tweet_id} className={style.item}>
                    <Tweet tweet_id={tweet_id} />
                </div>
            )
        }
    </div>