import fragmentShaderSource     from './fragment_fs.glsl'
import vertexShaderSource       from './vertex_vs.glsl'

import type {Mat4}              from 'gl-matrix'

import {
    createProgram,
    bindAttribute,
    bindElementIndex,
    bindUniformTexture,
    bindUniform
} from '../../../util/shader'


const LABEL_TEXT_HEIGHT = 512 / 8
const LABEL_HEIGHT = 0.35
const LINE_WIDTH = 0.03

const vertices      = []
const faces         = []
const uvs           = []


const updateGeometry = ( values: Array<{v:number, y:number}>, k:number ) => {

    vertices.length = 0
    faces.length = 0
    uvs.length = 0

    const h = LABEL_TEXT_HEIGHT

    const w = 1 << Math.ceil( Math.log((values.length+1)*h) / Math.LN2 )

    const n = w / h

    const x_offset = Math.max( k*0.8 - 2, 0 )

    values.forEach( ({y}, i) => {

        vertices.push(
            x_offset -LABEL_HEIGHT*2 , y-LABEL_HEIGHT/2 , i,
            x_offset                 , y-LABEL_HEIGHT/2 , i,
            x_offset                 , y+LABEL_HEIGHT/2 , i,
            x_offset -LABEL_HEIGHT*2 , y+LABEL_HEIGHT/2 , i,

            x_offset -LABEL_HEIGHT - LINE_WIDTH/2, 0                            , i,
            x_offset -LABEL_HEIGHT + LINE_WIDTH/2, 0                            , i,
            x_offset -LABEL_HEIGHT + LINE_WIDTH/2, Math.max(0,y-LABEL_HEIGHT/2) , i,
            x_offset -LABEL_HEIGHT - LINE_WIDTH/2, Math.max(0,y-LABEL_HEIGHT/2) , i,
        )

        faces.push(
            i*8+1, i*8+2, i*8+3,
            i*8+3, i*8+1, i*8+0,

            i*8+5, i*8+6, i*8+7,
            i*8+7, i*8+5, i*8+4,
        )

        uvs.push(
            0 , (i+2)/n,
            1 , (i+2)/n,
            1 , (i+1)/n,
            0 , (i+1)/n,

            0.25 , (0.5)/n,
            0.25 , (0.5)/n,
            0.25 , (0.5)/n,
            0.25 , (0.5)/n,
        )


    })

    return {vertices, uvs, faces}
}


const label_texture = document.createElement('canvas')
document.body.appendChild(label_texture)
const updateTexture = ( values: Array<{v:number, y:number}> ) => {

    const format = x =>
        Math.floor(x)+'.'+((x%1)+'0'.repeat(10)).slice(2,4)

    const h = LABEL_TEXT_HEIGHT

    const w = 1 << Math.ceil( Math.log((values.length+1)*h) / Math.LN2 )

    const n = w / h

    label_texture.width = h*2
    label_texture.height = h*n
    const ctx: CanvasRenderingContext2D = label_texture.getContext('2d')

    ctx.clearRect(0, 0, h, h*n)
    ctx.fillStyle = 'rgba(255,255,255,1)'
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.font = `${Math.floor(h*0.9)}px helvetica`

    ctx.beginPath()
    ctx.rect(0,0,h,h)
    ctx.fill()

    values.forEach( ({v}, i) => {

        ctx.beginPath()
        ctx.fillText(format(v), h, h*(1+i+0.5-0.05), h*2)

    })

    return label_texture
}

export const create = ( gl: WebGLRenderingContext ) => {

    // Create the shader program
    const program = createProgram( gl, vertexShaderSource, fragmentShaderSource )

    // Declare the vertex attribute
    const attribute_position    = bindAttribute( gl, program, 'aVertexPosition', 3 )
    const attribute_uv          = bindAttribute( gl, program, 'aVertexUV', 2 )
    const elementIndex          = bindElementIndex( gl, program )
    const uniform_worldMatrix   = bindUniform( gl, program, 'uWorldMatrix', 'mat4' )
    const sampler_label    = bindUniformTexture( gl, program, 'uSampler' )

    let n_faces = 0

    return {

        setValues: ( values: Array<{v:number, y:number}>, k: number ) => {
            const {uvs, faces, vertices} = updateGeometry( values, k )
            attribute_uv.update(uvs)
            elementIndex.update(faces)
            attribute_position.update(vertices)
            sampler_label.update( updateTexture( values ) )
            n_faces = faces.length
        },

        draw: ( projectionMatrix: Mat4 ) => {

            gl.useProgram(program)

            uniform_worldMatrix.update( ( projectionMatrix: any ) )

            uniform_worldMatrix.bind()
            elementIndex.bind()
            attribute_uv.bind()
            attribute_position.bind()
            sampler_label.bind()

            gl.drawElements(gl.TRIANGLES, n_faces, gl.UNSIGNED_SHORT, 0)

        },
    }
}