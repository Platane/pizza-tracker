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
    const far   = 10

    let fovx    = 90
    let aspect  = 1

    const up                = vec3.fromValues(0, -1, 0)
    const eye               = vec3.create()
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

            const a = 0.19

            vec3.set( center, k, 0, 0 )

            vec3.set( eye, k+Math.cos(Math.PI*2*tx)*3, 1+ty*0.5, Math.sin(Math.PI*2*tx)*3 )


            // build the base u,v,w
            vec3.sub( w, center, eye )
            vec3.normalize( w, w )

            vec3.cross( u, up, w )
            vec3.normalize( u, u )

            vec3.cross( v, u, w )


            // build the matrix
            mat4.set(
                lookAtMatrix,
                u[0]    , u[1]    , u[2]    , 0,
                v[0]    , v[1]    , v[2]    , 0,
                w[0]    , w[1]    , w[2]    , 0,
                // 0      , 0      , 0      , 1,
                // eye[0] , eye[1] , eye[2] , 1,
                // -eye[0] , -eye[1] , -eye[2] , 1,
                center[0]*a , center[1]*a , center[2]*a , 1,
            )


            // mat4.lookAt( lookAtMatrix, eye, center, up )


            mat4.invert( lookAtMatrix, lookAtMatrix )



            const scale = mat4.fromScaling( mat4.create(), vec3.fromValues(a, a, a) )

            const m = mat4.mul(
                mat4.create(),
                lookAtMatrix,
                scale
            )

            // const m = mat4.mul(
            //     mat4.create(),
            //     mat4.mul(
            //         mat4.create(),
            //         mat4.fromTranslation( mat4.create(), vec3.fromValues(-0.8, 0, 0) ),
            //         mat4.fromYRotation( mat4.create(), -Math.PI*0.9*tx )
            //     ),
            //     mat4.mul(
            //         mat4.create(),
            //         scale,
            //         mat4.fromXRotation( mat4.create(), -Math.PI*0.9*ty )
            //     )
            // )

            mat4.copy( worldMatrix, m )

        },

        get: () => worldMatrix
    }
}

export const create = ( canvas: HTMLCanvasElement, size: number = 600  ) => {

    canvas.width = canvas.height = size

    const gl: ?WebGLRenderingContext = canvas.getContext('webgl2', WEBGL_OPTIONS)
        || canvas.getContext('webgl-experimental2', WEBGL_OPTIONS)
        || canvas.getContext('webgl', WEBGL_OPTIONS)
        || canvas.getContext('webgl-experimental', WEBGL_OPTIONS)

    if ( !gl )
        throw 'WebGl not supported'


    gl.clearColor(0.5, 0.5, 0.5, 0.0)
    gl.viewport(0, 0, size, size)

    gl.cullFace(gl.FRONT_AND_BACK)

    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LESS)

    gl.enable( gl.BLEND )
    // gl.blendEquationSeparate( gl.FUNC_ADD, gl.FUNC_ADD )
    // gl.blendFuncSeparate( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA )
    // gl.disable(gl.DEPTH_TEST)

    const renderers = {
        lines           : createLineRenderer( gl ),
        floor           : createFloor( gl ),
        floorLabel      : createFloorLabel( gl ),
        verticalLabel   : createVerticalLabel( gl ),
        cube            : createCube( gl ),
        pizzaEmitter    : createPizzaEmitter( gl ),
    }

    const worldMatrix = createMatrixBuilder()

    const render = () => {


        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        ;[
            renderers.lines,
            renderers.floor,
            renderers.floorLabel,
            renderers.verticalLabel,
            renderers.cube,
            renderers.pizzaEmitter,
        ].forEach( ({ draw }) =>
            draw( worldMatrix.get() )
        )
    }


    let tx=0
    let ty=0
    let k=0
    let running = false
    const loop = () => {

        if ( !running )
            return

        worldMatrix.build( k, tx, ty )
        renderers.pizzaEmitter.update()

        render()

        requestAnimationFrame( loop )
    }

    let lines = []

    return {

        setCamera: ( _: any, x: number, y: number ) => { tx = x; ty = y },

        setK: ( u: number ) => {
            k = u
            renderers.lines.setK( u )
            renderers.cube.setK( u )

            renderers.verticalLabel.setValues(
                lines
                    .map( ({ points, values }) =>
                        ({ y: getYat( points, k ), v: getYat( values, k ) })
                    )
                ,
                k
            )

            renderers.pizzaEmitter.setEmitRate( k / 500 )
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