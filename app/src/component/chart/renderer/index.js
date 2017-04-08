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

let gi = vec3.create()

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

            vec3.set( center, k, 2, 2 )

            const rho = -Math.PI/2 + tx*Math.PI*0.4
            const phy = -ty*Math.PI*0.4
            const r   = 4

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
                // eye[0] , eye[1] , eye[2] , 1,
                // -eye[0] , -eye[1] , -eye[2] , 1,
                // center[0]*a , center[1]*a , center[2]*a , 1,
            )

            vec3.copy(gi, eye)

            // mat4.lookAt( lookAtMatrix, eye, center, up )


            mat4.invert( lookAtMatrix, lookAtMatrix )

            // const m = mat4.multiply(mat4.create(), mat4.fromTranslation( mat4.create(), vec3.fromValues(-6, 0, 10) ), frustrumMatrix)
            // const m = mat4.multiply(mat4.create(), frustrumMatrix, mat4.fromTranslation( mat4.create(), vec3.fromValues(-6, -2, -5) ))
            //
            //
            const m = mat4.identity(mat4.create())

            mat4.multiply(m, m, frustrumMatrix )
            // mat4.multiply(m, m, mat4.fromTranslation( mat4.create(), eye ))
            mat4.multiply(m, m, mat4.fromTranslation( mat4.create(), [0,0,-r] ))
            mat4.multiply(m, m, lookAtMatrix)
            mat4.multiply(m, m, mat4.fromTranslation( mat4.create(), [-center[0], -center[1], -center[2]] ))


            // const scale = mat4.fromScaling( mat4.create(), vec3.fromValues(a, a, a) )

            // const m = mat4.mul(
            //     mat4.create(),
            //     lookAtMatrix,
            //     scale
            // )

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
    // gl.blendEquationSeparate( gl.FUNC_ADD, gl.FUNC_ADD )
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
            renderers.cube,
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

        renderers.cube.setPosition( gi )

        worldMatrix.build( k, tx, ty )
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
            k = u
            renderers.lines.setK( u )
            renderers.cube.setPosition( gi )

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