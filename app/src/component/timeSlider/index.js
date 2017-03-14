import {connect}        from 'react-redux'
import {TimeSlider as C}from './component'

import {setTimeCursor}  from '../../action'

import type {State}     from '../../index'

const mapStateToProps = ( state: State ) =>
    ({
        value   : state.timeCursor.k,
    })

const mapDispatchToProps = {
        set     : setTimeCursor,
    }

const connector = connect(mapStateToProps, mapDispatchToProps)

export const TimeSlider = connector( C )