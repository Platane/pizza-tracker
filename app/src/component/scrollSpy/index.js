import React            from 'react'

import {connect}        from 'react-redux'
import {setTimeCursor}  from '../../action'

import {ScrollHint}     from './scrollHint'

import type {State}     from '../../index'


class ScrollSpy_ extends React.Component {

    state = { firstScroll: false, mountDate:0 }

    onResize = () => 0

    onScroll = () => {

        const domApp = document.getElementById('app')

        if (!domApp)
            return

        const {height} = domApp.getBoundingClientRect()

        const top = window.scrollY

        const k = top / ( height - window.innerHeight )

        this.props.setTimeCursor( Math.max(0, Math.min(12, k*12 )) )

        if ( !this.state.firstScroll && this.state.mountDate && Date.now() > this.state.mountDate + 400  )
            this.setState({ firstScroll: true })
    }

    shouldComponentUpdate(_, nextState) {
        return this.state.firstScroll != nextState.firstScroll
    }

    componentDidMount(){

        window.removeEventListener('resize', this.onResize )
        window.removeEventListener('scroll', this.onScroll )

        window.addEventListener('resize', this.onResize )
        window.addEventListener('scroll', this.onScroll )

        this.setState({ mountDate: Date.now() })

        this.onScroll()
    }

    componentWillUnmount() {

        window.removeEventListener('resize', this.onResize )
        window.removeEventListener('scroll', this.onScroll )
    }

    render(){
        return <ScrollHint displayed={!this.state.firstScroll} />
    }
}





const mapStateToProps = ( state: State ) =>
    ({
    })

const mapDispatchToProps = { setTimeCursor }

const connector = connect(mapStateToProps, mapDispatchToProps)

export const ScrollSpy = connector( ScrollSpy_ )