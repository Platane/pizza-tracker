import React                    from 'react'

import {vec2}                   from 'gl-matrix'

import type {Component}         from 'react'
import type {UserInfo}          from '../../type/commonType'
import type {Vec2}              from 'gl-matrix'

export type Props = {
    users   : Array<UserInfo>,

    max?    : number,
}

export const statify = ( C: Component<*,*,*> ) =>
    ({ users, max }: Props ) => {

        const start = (new Date('2017-01-01T00:00:00.100Z')).getTime()
        const end   = (new Date('2017-12-31T23:59:59.100Z')).getTime()

        const _max  = users.reduce( (max,{counts}) => counts.reduce( (max,x) => Math.max( max, x.count ), 0 ), max || 0 )

        const lines = users.map( ({ counts }) => {

            const line = counts.map( ({ date, count }) =>
                vec2.set(
                    vec2.create(),
                    (date - start)/( end - start )*12, count/_max*3
                )
            )

            return line.length == 1
                ? [ ...line, vec2.set( vec2.create(), line[0][0]+0.1, line[0][1] ) ]
                : line
        })

        return <C lines={[ ...lines, [ [0,0], [12,3] ], [ [0,0], [4,2], [12,3] ] ]} />
    }