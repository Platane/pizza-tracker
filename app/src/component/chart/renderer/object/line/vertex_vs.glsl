precision highp float;

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec4 aVertexColor;
attribute float aVertexLength;

uniform mat4 uWorldMatrix;

varying lowp vec4 vColor;
varying lowp vec3 vNormal;
varying lowp float vLength;
varying lowp float vX;

void main(void) {
    gl_Position = uWorldMatrix * vec4(aVertexPosition, 1.0);
    vNormal = aVertexNormal;
    vColor = aVertexColor;
    vLength = aVertexPosition.x;
    vX = aVertexPosition.x;

    if( aVertexLength == 0.0 ){

    }
}