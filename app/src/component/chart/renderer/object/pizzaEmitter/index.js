import fragmentShaderSource     from './fragment_fs.glsl'
import vertexShaderSource       from './vertex_vs.glsl'
import {mat4, vec3}             from 'gl-matrix'
import {createPool}             from './sprite'
import {createWorld}            from './phy'

import type {Mat4, Vec2, Vec3}  from 'gl-matrix'

import {
    createProgram,
    bindAttribute,
    bindElementIndex,
    bindUniformTexture,
    bindUniform
} from '../../../util/shader'

// pizza spawned / ms
const MAX_EMIT_RATE = 20 / 1000

export const create = ( gl: WebGLRenderingContext ) => {

    const n = 4

    // init phy world
    const world = createWorld()

    // init sprite
    const texture = createPool( 256/n, n )

    // Create the shader program
    const program = createProgram( gl, vertexShaderSource, fragmentShaderSource )

    // Declare the vertex attribute
    const attribute_position    = bindAttribute( gl, program, 'aVertexPosition', 3 )
    const attribute_uv          = bindAttribute( gl, program, 'aVertexUV', 2 )

    const elementIndex          = bindElementIndex( gl, program )

    const uniform_worldMatrix   = bindUniform( gl, program, 'uWorldMatrix', 'mat4' )

    const sampler_pizza         = bindUniformTexture( gl, program, 'uSampler' )

    sampler_pizza.update( texture )

    let n_faces = 0
    let t = 0
    let p = 0
    const sources = []
    let emitRate = 0

    let lastStepDate = Date.now()

    return {

        setEmitRate: ( r:number ) => {
            r = Math.min(r, MAX_EMIT_RATE)

            if ( emitRate < 0.0001 )
                p = t * r

            else
                p = p * ( r / emitRate )

            emitRate = r
        },

        setSources: ( sources_: Array<Vec3> ) => {
            sources.length = 0
            sources.push( ...sources_ )
        },

        update: (  ) => {

            const delta = Math.min( 200, Date.now() - lastStepDate )

            lastStepDate = Date.now()


            world.step(delta)

            t+= delta

            const spawned = t * emitRate > p

            while ( t * emitRate > p ) {

                const source = sources[ Math.floor(Math.random()*sources.length) ]

                if ( source )
                    world.spawn( source )

                p++
            }

            const {uv, vertices, faces} = world.getGeometry()

            attribute_position.update(vertices)

            if ( spawned || true ){
                elementIndex.update(faces)
                attribute_uv.update(uv)
                n_faces = faces.length
            }

        },

        draw: ( projectionMatrix: Mat4 ) => {

            gl.useProgram(program)

            uniform_worldMatrix.update( ( projectionMatrix: any ) )

            elementIndex.bind()
            attribute_position.bind()
            sampler_pizza.bind()
            attribute_uv.bind()
            uniform_worldMatrix.bind()

            gl.drawElements(gl.TRIANGLES, n_faces, gl.UNSIGNED_SHORT, 0)
        },
    }
}