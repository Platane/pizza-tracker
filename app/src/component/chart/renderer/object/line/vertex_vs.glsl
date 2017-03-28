precision highp float;

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec4 aVertexColor;
attribute float aVertexLength;
attribute float aVertexDash;

uniform mat4 uWorldMatrix;

varying lowp vec4 vColor;
varying lowp vec3 vNormal;
varying lowp float vLength;
varying lowp float vDash;
varying lowp float vX;

void main(void) {
    gl_Position = uWorldMatrix * vec4(aVertexPosition, 1.0);
    vNormal = aVertexNormal;
    vLength = aVertexLength;
    vColor = aVertexColor;
    vDash = aVertexDash;
    vX = aVertexPosition.x;
}