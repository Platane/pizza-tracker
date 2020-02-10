// precision highp float;

attribute vec3 aVertexPosition;
attribute vec2 aVertexUV;
attribute float aVertexOpacity;

uniform mat4 uWorldMatrix;

varying vec2 vTextureCoord;
varying float vOpacity;

void main(void) {
    gl_Position = uWorldMatrix * vec4(aVertexPosition, 1.0);
    vTextureCoord = aVertexUV;
    vOpacity = aVertexOpacity;
}