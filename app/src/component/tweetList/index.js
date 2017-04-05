import {connect}        from 'react-redux'
import {TweetList as C} from './component'
import {statify}        from './state'

import type {State, Dispatch}       from '../../index'

const mapStateToProps = ( state: State ) =>
    ({
        users : state.users,
        k     : state.timeCursor.k,
    })

const mapDispatchToProps = ( dispatch: Dispatch ) =>
    ({

    })

const connector = connect(mapStateToProps, mapDispatchToProps)

export const TweetList = connector( statify( C ) )