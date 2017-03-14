// precision highp float;

varying lowp vec4 vColor;
varying lowp vec3 vNormal;

void main(void) {
    gl_FragColor = vec4( vNormal.xyz, vColor.w );
}