import {mat4, vec3}             from 'gl-matrix'

import {create as createLineRenderer}   from './object/line'
import {create as createFloor}          from './object/floor'
import {create as createFloorLabel}     from './object/floorLabel'
import {create as createVerticalLabel}  from './object/verticalLabel'
import {create as createCube}           from './object/cube'
import {create as createPizzaEmitter}   from './object/pizzaEmitter'

const getYat = ( points: Array<Vec2>, x: number ) => {

    let ia=0
    for(; points[ia] && points[ia][0] < x; ia++ );

    if (!points[ia])
        return points[ia-1][1]

    if(ia==0)
        return points[0][1]

    if (points[ia][0] == points[ia-1][0])
        return points[ia][1]

    const k = ( x - points[ia-1][0] )/( points[ia][0] - points[ia-1][0] )

    return k*points[ia][1] + (1-k)*points[ia-1][1]
}

const WEBGL_OPTIONS = {
    alpha                   : true,
    antialias               : true,
    depth                   : true,
    premultipliedAlpha      : false,
    preserveDrawingBuffer   : false,
    stencil                 : true,
}


const createMatrixBuilder = () => {

    const near  = 0.4
    const far   = 100

    let fovx    = Math.PI/2.2
    let aspect  = 1

    const up                = vec3.fromValues(0, -1, 0)
    const center            = vec3.create()
    const w                 = vec3.create()
    const v                 = vec3.create()
    const u                 = vec3.create()

    const worldMatrix       = mat4.create()
    const frustrumMatrix    = mat4.create()
    const lookAtMatrix      = mat4.create()

    mat4.perspective( frustrumMatrix, fovx, aspect, near, far )
    mat4.identity( lookAtMatrix )
    mat4.identity( worldMatrix )

    return {

        setRatio: ( a: number ) => {

            aspect = a

            mat4.perspective( frustrumMatrix, fovx, aspect, near, far )
        },

        build: ( k:number, tx:number, ty:number ) => {

            vec3.set( center, 1+k/12*10, 2, 2 )

            const rho = -Math.PI/2 + tx*Math.PI*0.3 + Math.PI*(6-k)/12*0.23
            const phy = Math.PI*0.065 -ty*Math.PI*0.2 + Math.PI*k/12*0.12
            const r   = 4+k/12

            vec3.set( w, Math.cos(phy)*Math.cos(rho), Math.sin(phy), Math.cos(phy)*Math.sin(rho) )

            // build the base u,v,w

            vec3.cross( u, up, w )
            vec3.normalize( u, u )

            vec3.cross( v, u, w )


            // build the matrix
            mat4.set(
                lookAtMatrix,
                u[0]    , u[1]    , u[2]    , 0,
                v[0]    , v[1]    , v[2]    , 0,
                -w[0]   , -w[1]   , -w[2]   , 0,
                0       , 0       , 0       , 1,
            )


            mat4.invert( lookAtMatrix, lookAtMatrix )


            const m = mat4.identity(worldMatrix)

            mat4.multiply(m, m, frustrumMatrix )
            mat4.multiply(m, m, mat4.fromTranslation( mat4.create(), [0,-k/12*1.5,-r] ))
            mat4.multiply(m, m, lookAtMatrix)
            mat4.multiply(m, m, mat4.fromTranslation( mat4.create(), [-center[0], -center[1], -center[2]] ))

        },

        get: () => worldMatrix
    }
}

export const create = ( canvas: HTMLCanvasElement  ) => {

    const gl: ?WebGLRenderingContext = canvas.getContext('webgl2', WEBGL_OPTIONS)
        || canvas.getContext('webgl-experimental2', WEBGL_OPTIONS)
        || canvas.getContext('webgl', WEBGL_OPTIONS)
        || canvas.getContext('webgl-experimental', WEBGL_OPTIONS)

    if ( !gl )
        throw 'WebGl not supported'


    gl.clearColor(0.5, 0.5, 0.5, 0.0)
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)

    gl.cullFace(gl.FRONT_AND_BACK)

    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LESS)

    gl.enable( gl.BLEND )
    gl.blendEquationSeparate( gl.FUNC_ADD, gl.FUNC_ADD )
    gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA )
    // gl.blendFuncSeparate( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA )
    // gl.disable(gl.DEPTH_TEST)

    const renderers = {
        lines           : createLineRenderer( gl ),
        floor           : createFloor( gl ),
        floorLabel      : createFloorLabel( gl ),
        verticalLabel   : createVerticalLabel( gl ),
        pizzaEmitter    : createPizzaEmitter( gl ),
        cube            : createCube( gl ),
    }

    const worldMatrix = createMatrixBuilder()

    const render = () => {


        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        ;[
            renderers.lines,
            renderers.floor,
            renderers.floorLabel,
            renderers.verticalLabel,
            renderers.pizzaEmitter,
            // renderers.cube,
        ].forEach( ({ draw }) =>
            draw( worldMatrix.get() )
        )
    }


    let tx=0
    let ty=0
    let k=0
    let vk=0
    const v0 = vec3.create()
    const v0Noise = vec3.create()
    let running = false
    const loop = () => {

        if ( !running )
            return

        worldMatrix.build( k, tx, ty )

        vk = Math.floor(vk*0.98  *100)/100

        const u = Math.min(vk, 1)

        renderers.pizzaEmitter.setEmitRate( ( 2+u*40 ) / 1000 )
        renderers.pizzaEmitter.setV0( vec3.set(v0, u*1.7, u*1, 0), vec3.set(v0Noise, 0.8+u*5, 0.5+u*3.7, 1.2+u*3) )

        renderers.pizzaEmitter.update()

        render()

        requestAnimationFrame( loop )
    }

    let lines = []

    return {

        resize: () => {

            canvas.width = canvas.clientWidth
            canvas.height = canvas.clientHeight

            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)

            worldMatrix.setRatio(canvas.clientWidth / canvas.clientHeight)
        },

        setCamera: ( _: any, x: number, y: number ) => { tx = x; ty = y },

        setK: ( u: number ) => {

            const deltaK = Math.abs(u-k)

            vk = vk + deltaK*0.8

            k = u
            renderers.lines.setK( u )

            renderers.verticalLabel.setValues(
                lines
                    .map( ({ points, values }) =>
                        ({ y: getYat( points, k ), v: getYat( values, k ) })
                    )
                ,
                k
            )

            renderers.pizzaEmitter.setSources(
                lines
                    .map( ({ points }, i) =>
                        [
                            k,
                            getYat( points, k ),
                            i,
                        ]
                    )
            )
        },

        setLines: ( lines_ ) => {
            lines = lines_
            renderers.lines.setLines( lines_ )
        },

        setRunning: ( value: boolean ) => {
            if ( value == running )
                return
            running = value
            loop()
        },

    }
}