import React                    from 'react'
import {Chart}                  from '../chart'
import {TimeSlider}             from '../timeSlider'
import style                    from './style.css'

export const App = () =>
    <div className={style.container}>
        <div className={style.chart}>
            <Chart />
        </div>

        <div className={style.slider}>
            <TimeSlider />
        </div>

    </div>
