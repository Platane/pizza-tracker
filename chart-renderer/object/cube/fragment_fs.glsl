// precision highp float;

varying lowp vec4 vColor;

void main(void) {
    gl_FragColor = vColor;
    // gl_FragColor = vec4( 0.1, 0.5, 0.2, 1 );
}