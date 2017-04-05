import React            from 'react'

import {connect}        from 'react-redux'
import {setTimeCursor}  from '../../action'

import type {State}     from '../../index'

class ScrollSpy_ extends React.Component {

    onResize = () => 0

    onScroll = () => {

        const domApp = document.getElementById('app')

        if (!domApp)
            return

        const {height} = domApp.getBoundingClientRect()

        const top = window.scrollY

        const k = top / ( height - window.innerHeight )

        this.props.setTimeCursor( Math.max(0, Math.min(12, k*12 )) )
    }

    shouldComponentUpdate() {
        return false
    }

    componentDidMount(){

        window.removeEventListener('resize', this.onResize )
        window.removeEventListener('scroll', this.onScroll )

        window.addEventListener('resize', this.onResize )
        window.addEventListener('scroll', this.onScroll )

        this.onScroll()
    }

    componentWillUnmount() {

        window.removeEventListener('resize', this.onResize )
        window.removeEventListener('scroll', this.onScroll )
    }

    render(){
        return null
    }
}





const mapStateToProps = ( state: State ) =>
    ({
        k     : state.timeCursor.k,
    })

const mapDispatchToProps = { setTimeCursor }

const connector = connect(mapStateToProps, mapDispatchToProps)

export const ScrollSpy = connector( ScrollSpy_ )