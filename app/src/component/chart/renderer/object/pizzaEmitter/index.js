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


export const create = ( gl: WebGLRenderingContext ) => {

    const n = 4

    // init phy world
    const world = createWorld()

    // init sprite
    const texture = createPool( 512/n, n )

    // Create the shader program
    const program = createProgram( gl, vertexShaderSource, fragmentShaderSource )

    // Declare the vertex attribute
    const attribute_position    = bindAttribute( gl, program, 'aVertexPosition', 3 )
    const attribute_uv          = bindAttribute( gl, program, 'aVertexUV', 2 )

    const elementIndex          = bindElementIndex( gl, program )

    const uniform_worldMatrix   = bindUniform( gl, program, 'uWorldMatrix' )

    const sampler_pizza         = bindUniformTexture( gl, program, 'uSampler' )

    sampler_pizza.update( texture )

    let n_faces = 6

    for(let k=10; k--;)
        world.spawn( [Math.random()*2 + 5,Math.random()*2,Math.random()*2] )

    let u = 0

    return {

        update: (  ) => {

            world.step(20)

            if ( u -- < 0 ) {
                world.spawn( [Math.random()*0.2 + 5,Math.random()*1.2,Math.random()*0.2] )
                u = 0
            }

            const {uv, vertices, faces} = world.getGeometry()

            attribute_position.update(vertices)
            elementIndex.update(faces)
            attribute_uv.update(uv)

            n_faces = faces.length
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