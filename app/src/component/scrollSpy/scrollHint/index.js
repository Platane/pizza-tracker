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
                        <svg viewBox="-80 -80 160 160" className={c(style.container, transition && style.transition, next && style.visible, !next && style.notVisible) } title="scroll">
                            <circle className={style.shadow} cx={0} cy={0} r={80}/>
                            <circle className={style.circle} cx={0} cy={0} r={45}/>
                            <path className={style.arrow} d="M-25 -2 L0 18 L25 -2"/>
                        </svg>
                    )
                    : null
        }
    </Transition>