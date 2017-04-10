import React                    from 'react'

import {Transition}           from 'react-propstransition'

import style                    from './style.css'

const c = ( ...classes ) =>
    classes.filter( Boolean ).join(' ')

export const ScrollHint = ({ displayed }) =>
    <Transition toTransition={ displayed } delay={400}>
        {
            ({ next, transition }) =>
                next || transition
                    ? (
                        <svg viewBox="-120 -120 240 240" className={c(style.container, transition && style.transition, next && style.visible, !next && style.notVisible) } title="scroll">
                            <path className={style.shadow} d="M-100 -20 Q-100 -120 0 -120 Q100 -120 100 -20 L100 20 Q100 120 0 120 Q-100 120 -100 20z"/>
                            <g className={style.mouse} transform="translate(0,-24)">
                                <path className={style.tic} d="M0 -2 L0 2"/>
                                <path className={style.potato} d="M-25 -20 Q-25 -45 0 -45 Q25 -45 25 -20 L25 20 Q25 45 0 45 Q-25 45 -25 20z"/>
                                <text className={style.text} x={0} y={90} >scroll</text>
                            </g>
                        </svg>
                    )
                    : null
        }
    </Transition>
