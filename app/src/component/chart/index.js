import {connect}        from 'react-redux'
import {Chart as C}     from './component'
import {statify}        from './state'

import type {State, Dispatch}       from '../../index'

const mapStateToProps = ( state: State ) =>
    ({
        users : state.users
    })

const mapDispatchToProps = ( dispatch: Dispatch ) =>
    ({

    })

const connector = connect(mapStateToProps, mapDispatchToProps)

export const Chart = connector( statify( C ) )