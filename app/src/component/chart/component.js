import React                    from 'react'

import style                    from './style.css'

import type {Vec2}              from 'gl-matrix'

import {create as createRenderer}   from './renderer'

export type Props = {
    lines   : Array<Array<Vec2>>,
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

        this.mousemove = this.mousemove.bind(this)
    }

    mousemove( event: MouseEvent ){
        this.setState({
            tx  :   event.pageX / window.innerWidth - 0.5,
            ty  :   event.pageY / window.innerHeight - 0.5,
        })
    }

    componentDidMount() {

        document.addEventListener('mousemove', this.mousemove)

        if ( !this._renderer ){

            this._renderer = createRenderer( this.refs.canvas, 800 )

            this.forceUpdate()
        }
    }

    componentWillUnmount() {

        document.removeEventListener('mousemove', this.mousemove)
    }


    render() {

        if ( this._renderer ){

            this._renderer.setLines(this.props.lines)
            this._renderer.setK(this.props.k)

            this._renderer.setCamera( 0, this.state.tx, this.state.ty )
            this._renderer.setRunning( true )
            // this._renderer.render()
        }

        return <canvas style={style.canvas} ref="canvas" width={600} height={600} style={{border:'solid 1px #333'}} />
    }
}