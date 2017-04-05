import React                    from 'react'

import type {Component}         from 'react'
import type {UserInfo}          from '../../type/commonType'

import type {Props as PropsOut} from './component'

export type PropsIn = {
    users   : Array<UserInfo>,
    k       : number,
}

export const statify = ( C: Component<void, PropsOut, {}> ) =>
    ({ users, k }: PropsIn ) => {

        const tweets = [].concat(
            ...users.map( ({counts}, i ) =>
                counts.map( ({date, tweet_id}) => ({date, tweet_id, i}) )
            )
        )
            .sort( (a, b) => a.date > b.date ? 1 : -1 )
            .filter( x => x.tweet_id )

        return <C tweets={tweets} k={k} width={340}/>
    }