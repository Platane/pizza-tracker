import React                    from 'react'
import {Chart}                  from '../chart'
import {TimeSlider}             from '../timeSlider'
import style                    from './style.css'

export const App = () =>
    <div className={style.container}>
        <div className={style.chart}>
            <Chart now={Date.now()}/>
        </div>

        <div className={style.slider}>
            <TimeSlider />
        </div>

    </div>
