// precision highp float;

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec4 aVertexColor;

uniform mat4 uWorldMatrix;

varying lowp vec4 vColor;
varying lowp vec3 vNormal;

void main(void) {
    gl_Position = uWorldMatrix * vec4(aVertexPosition, 1.0);
    vNormal = aVertexNormal;
    vColor = aVertexColor;
}