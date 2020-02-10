// precision highp float;

attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;

uniform mat4 uWorldMatrix;

varying lowp vec4 vColor;

void main(void) {
    gl_Position = uWorldMatrix * vec4(aVertexPosition, 1.0);
    vColor = aVertexColor;
}