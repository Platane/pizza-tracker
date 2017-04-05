export const initShader = ( gl: WebGLRenderingContext , sourceCode: string, shaderType: number ): WebGLShader => {

    const shader = gl.createShader(shaderType)

    gl.shaderSource(shader, sourceCode)

    gl.compileShader(shader)

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        throw ('An error occurred compiling the shaders: \n' + ( gl.getShaderInfoLog(shader) || '' )+'\n'+sourceCode )

    return shader
}

export const createProgram = ( gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string ): WebGLProgram  => {

    // Create the shader program
    const vertexShader = initShader( gl, vertexShaderSource, gl.VERTEX_SHADER )
    const fragmentShader = initShader( gl, fragmentShaderSource, gl.FRAGMENT_SHADER )

    const shaderProgram = gl.createProgram()
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)

    gl.linkProgram(shaderProgram)

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
        throw 'Unable to initialize the shader program.'

    return shaderProgram
}

export const bindAttribute = ( gl: WebGLRenderingContext, shaderProgram: WebGLProgram, name: string, size?: number = 1 ) => {

    const buffer        = gl.createBuffer()

    const location      = gl.getAttribLocation(shaderProgram, name)

    if ( location == -1 )
        throw Error(`attribute ${name} not found in the shader program`)

    gl.enableVertexAttribArray(location)

    return {
        update : ( arr: Array<number> ) => {
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
            gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from( arr ), gl.STATIC_DRAW)
            gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0)
        },
        bind : () => {
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
            gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0)
        },
    }
}

export const bindElementIndex = ( gl: WebGLRenderingContext, shaderProgram: WebGLProgram ) => {

    const buffer         = gl.createBuffer()

    return {
        update : ( arr: Array<number> ) => {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer)
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(arr), gl.STATIC_DRAW)
        },
        bind : () => {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer)
        },
    }
}

export const bindUniform = ( gl: WebGLRenderingContext, shaderProgram: WebGLProgram, name: string, type: 'mat4' | 'float' ) => {

    let value
    const location = gl.getUniformLocation(shaderProgram, name)

    if ( location == -1 )
        throw Error(`uniform ${name} not found in the shader program`)

    let bind
    switch( type ){
        case 'mat4'     :
            bind = () => gl.uniformMatrix4fv( location, false, new Float32Array(value) )
            break
        case 'float'    :
            bind = () => gl.uniform1f( location, value )
            break
        default         : throw Error(`unknow type ${type}`)
    }

    return {
        update : ( v: any ) => {
            value = v
        },
        bind,
    }
}

export const bindUniformTexture = ( gl: WebGLRenderingContext, shaderProgram: WebGLProgram, name: string ) => {

    const texture = gl.createTexture()

    const location = gl.getUniformLocation(shaderProgram, name)

    if ( location == -1 )
        throw Error(`uniform ${name} not found in the shader program`)

    return {
        update : ( image: HTMLCanvasElement  ) => {

            gl.bindTexture(gl.TEXTURE_2D, texture)
            gl.texImage2D(
               gl.TEXTURE_2D,
               0,                   // level , for mimapping i guess
               gl.RGBA,             // internalformat ,
               gl.RGBA,             // format
               gl.UNSIGNED_BYTE,    // type
               image
            )

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
            gl.generateMipmap(gl.TEXTURE_2D)
            gl.bindTexture(gl.TEXTURE_2D, null)

        },
        bind : () => {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture)
            gl.uniform1i(location, 0)
        },
    }
}