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

    const buffer         = gl.createBuffer()

    const attributeIndex = gl.getAttribLocation(shaderProgram, name)

    if (size > 1)
        gl.enableVertexAttribArray(attributeIndex)

    return {
        update : ( arr: Array<number> ) => {
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
            gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from( arr ), gl.STATIC_DRAW)
            gl.vertexAttribPointer(attributeIndex, size, gl.FLOAT, false, 0, 0)
        },
        bind : () => {
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
            gl.vertexAttribPointer(attributeIndex, size, gl.FLOAT, false, 0, 0)
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

export const bindUniform = ( gl: WebGLRenderingContext, shaderProgram: WebGLProgram, name: string ) => {

    let value
    const location = gl.getUniformLocation(shaderProgram, name)

    return {
        update : ( arr: Array<number> ) => {
            value = new Float32Array(arr)
        },
        bind : () => {
            gl.uniformMatrix4fv(location, false, value)
        },
    }
}

export const bindUniformTexture = ( gl: WebGLRenderingContext, shaderProgram: WebGLProgram, name: string ) => {

    const texture = gl.createTexture()

    const location = gl.getUniformLocation(shaderProgram, name)

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