import React                    from 'react'
import style                    from './style.css'

export type Props = {
    set     : ( value: number ) => any,
    value   : number,
}

export const TimeSlider = ({ value, set }: Props) =>
    <div className={style.container}>
        <input className={style.input} type="range" min={0} max={3} step={0.001} value={value} onChange={ e => set(+e.target.value) } />
    </div>
