import React                    from 'react'

import style                    from './style.css'

import type {Vec2}              from 'gl-matrix'

import {create as createRenderer}   from './renderer'

export type Props = {
    lines   : Array<{
        color       : [number, number, number, number],
        dash_start  : number,
        points      : Array<Vec2>
    }>,
    k       : number,
}

export class Chart extends React.Component {

    _renderer   : Object;

    state       : {
        tx : number,
        ty : number,
    };


    constructor() {
        super()

        this.state = { tx:0, ty:0 }
    }

    onmousemove = ( event: MouseEvent ) => {
        this.setState({
            tx  :   event.clientX / window.innerWidth - 0.5,
            ty  :   event.clientY / window.innerHeight - 0.5,
        })
    }

    onresize = () => {

        this._renderer && this._renderer.resize()
    }

    componentDidMount() {

        window.removeEventListener('resize', this.onresize)
        document.removeEventListener('mousemove', this.onmousemove)

        document.addEventListener('mousemove', this.onmousemove)
        window.addEventListener('resize', this.onresize)

        if ( !this._renderer ){

            this._renderer = createRenderer( this.refs.canvas )

            this.onresize()

            this.forceUpdate()
        }
    }

    componentWillUnmount() {

        window.removeEventListener('resize', this.onresize)
        document.removeEventListener('mousemove', this.onmousemove)
    }


    render() {

        if ( this._renderer ){

            this._renderer.setLines(this.props.lines)
            this._renderer.setK(this.props.k)

            this._renderer.setCamera( 0, this.state.tx, this.state.ty )
            this._renderer.setRunning( true )
            // this._renderer.render()
        }

        return <canvas className={style.canvas} ref="canvas" />
    }
}