import fragmentShaderSource     from './fragment_fs.glsl'
import vertexShaderSource       from './vertex_vs.glsl'
import {mat4, vec3}             from 'gl-matrix'
import {computeLine}            from './geometry'

import type {Mat4, Vec2, Vec3}  from 'gl-matrix'

import {
    createProgram,
    bindAttribute,
    bindElementIndex,
    bindUniform
} from '../../../util/shader'

type Line = Array<Vec2>


export const create = ( gl: WebGLRenderingContext ) => {

    // Create the shader program
    const program = createProgram( gl, vertexShaderSource, fragmentShaderSource )

    // Declare the vertex attribute
    const attribute_normal      = bindAttribute( gl, program, 'aVertexNormal', 3 )
    const attribute_position    = bindAttribute( gl, program, 'aVertexPosition', 3 )
    const attribute_color       = bindAttribute( gl, program, 'aVertexColor', 4 )

    const elementIndex          = bindElementIndex( gl, program )

    const uniform_worldMatrix   = bindUniform( gl, program, 'uWorldMatrix' )

    let n_faces = 0

    return {

        update: ( lines: Array<Line> ) => {

            const color = [ 0.5, 0.3, 0.9 ]

            const vertices  = []
            const normals   = []
            const opacities = []
            const faces     = []

            lines
                .forEach( (line, i) => {

                    const res = computeLine( line )

                    const offset = vertices.length / 3

                    vertices.push( ...res.vertices.map( (x, u) => u%3 == 2 ? x+ (i/(lines.length)-0.5)*2.1 : x ) )
                    normals.push( ...res.normals )
                    opacities.push( ...res.vertices.map( () => 1 ) )
                    faces.push(
                        ...res.faces.map( i => offset + i )
                    )
                })

            elementIndex.update(faces)

            attribute_position.update(vertices)
            attribute_normal.update(normals)
            attribute_color.update(opacities.reduce( (arr,a) => [ ...arr, ...color, a ], [] ))

            n_faces = faces.length
        },

        draw: ( projectionMatrix: Mat4 ) => {

            gl.useProgram(program)

            uniform_worldMatrix.update( ( projectionMatrix: any ) )

            elementIndex.bind()
            attribute_position.bind()
            attribute_normal.bind()
            attribute_color.bind()
            uniform_worldMatrix.bind()

            gl.drawElements(gl.TRIANGLES, n_faces, gl.UNSIGNED_SHORT, 0)
        },
    }
}