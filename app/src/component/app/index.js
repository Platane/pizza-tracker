import React                    from 'react'
import {Chart}                  from '../chart'
import {TimeSlider}             from '../timeSlider'
import {TweetList}              from '../tweetList'
import {ScrollSpy}              from '../scrollSpy'
import style                    from './style.css'

export const App = () =>
    <div className={style.overScrollContainer}>
        <div className={style.container}>
            <div className={style.chart}>
                <Chart now={Date.now()}/>
            </div>

            <div className={style.tweetList}>
                <TweetList />
            </div>

            <ScrollSpy />

        </div>
    </div>
