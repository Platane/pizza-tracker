import fragmentShaderSource     from './fragment_fs.glsl'
import vertexShaderSource       from './vertex_vs.glsl'
import {mat4, vec3, vec2}       from 'gl-matrix'
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
    const attribute_length      = bindAttribute( gl, program, 'aVertexLength', 1 )

    const elementIndex          = bindElementIndex( gl, program )

    const uniform_worldMatrix   = bindUniform( gl, program, 'uWorldMatrix', 'mat4' )
    const uniform_k             = bindUniform( gl, program, 'uk', 'float' )

    let n_faces = 0
    let line_x  = []

    return {

        setK: ( k: number ) => {
            uniform_k.update( k )
        },

        setLines: ( lines: Array<Line> ) => {

            const color = [ 0.5, 0.3, 0.9, 1 ]

            const vertices  = []
            const normals   = []
            const faces     = []
            const length    = []

            line_x.length = 0

            lines
                .forEach( (line, i) => {

                    const res = computeLine( line )

                    const offset = vertices.length / 3

                    line_x.push( line.map( p => p[0] ) )

                    // push length info
                    // ( useful to display dashed line )
                    {
                        let l=0
                        line.forEach( (_,k) => {

                            if ( k > 0 )
                                l=l+vec2.distance(line[k], line[k-1])

                            for(let u=6;u--;)
                                length.push(l)

                        })
                    }

                    vertices.push( ...res.vertices.map( (x, u) => u%3 == 2 ? x+ (i/(lines.length)-0.5)*2.1 : x ) )
                    normals.push( ...res.normals )
                    faces.push(
                        ...res.faces.map( i => offset + i )
                    )
                })

            elementIndex.update(faces)

            attribute_position.update(vertices)
            attribute_normal.update(normals)
            attribute_length.update(length)
            attribute_color.update( [].concat( ...Array.from({length: vertices.length/3 }).map( () => color ) ) )

            n_faces = faces.length
        },

        draw: ( projectionMatrix: Mat4 ) => {

            gl.useProgram(program)

            uniform_worldMatrix.update( ( projectionMatrix: any ) )

            elementIndex.bind()
            attribute_position.bind()
            attribute_normal.bind()
            attribute_color.bind()
            attribute_length.bind()
            uniform_worldMatrix.bind()
            uniform_k.bind()

            gl.drawElements(gl.TRIANGLES, n_faces, gl.UNSIGNED_SHORT, 0)
        },
    }
}