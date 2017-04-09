import React                    from 'react'

import {vec2}                   from 'gl-matrix'

import type {Component}         from 'react'
import type {UserInfo}          from '../../type/commonType'
import type {Vec2}              from 'gl-matrix'

import type {Props as PropsOut} from './component'

export type PropsIn = {
    users   : Array<UserInfo>,

    max?    : number,
    k       : number,
    now     : number,
}

const colors = [
    [0.1, 0.7, 0.5, 1],
    [0.8, 0.3, 0.4, 1],
    [0.3, 0.4, 0.9, 1],
]

export const statify = ( C: Component<void, PropsOut, {}> ) =>
    ({ users, max, k, now }: PropsIn ) => {

        const start = (new Date('2017-01-01T00:00:00.100Z')).getTime()
        const end   = (new Date('2017-12-31T23:59:59.100Z')).getTime()


        const _max  = users.reduce( (max,{estimated_counts}) => estimated_counts.reduce( (max,x) => Math.max( max, x.count ), max ), max || 0 )

        const lines = users.map( ({ estimated_counts }, i) => {

            let values = estimated_counts.map( ({ date, count }) =>
                vec2.set(
                    vec2.create(),
                    (date - start)/( end - start )*12, count
                )
            )

            if ( values.length == 1 )
                values = [ ...values, vec2.set( vec2.create(), values[0][0]+0.1, values[0][1] ) ]


            const color         = colors[i%colors.length]
            const dash_start    = ( now-start )/( end-start )*12

            const points = values
                .map( p =>
                    vec2.set(
                        vec2.create(),
                        p[0], p[1]/_max*12
                    )
                )

            return {
                values,
                points,
                color,
                dash_start,
            }
        })

        return <C lines={lines} k={k} />
    }