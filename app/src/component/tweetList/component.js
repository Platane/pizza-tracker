import React                    from 'react'

import style                    from './style.css'
import {Tweet}                  from './tweet'


export const TweetList = ({ tweets, width }) =>
    <div className={style.container}>
        { tweets
            .map( ({ tweet_id, y, s }) =>
                <div
                    key={tweet_id}
                    className={style.item}
                    style={{
                        opacity     : s*2,
                        transform   : `translate3d(0,${Math.round((y+1)*200)}px,${s*10}px) scale(${s})`
                    }}>

                    { s < 0.9 && <div className={style.overlay} style={{ opacity: (1-s) }} /> }

                    <Tweet tweet_id={ tweet_id } width={width} />
                </div>
            )
        }
    </div>
