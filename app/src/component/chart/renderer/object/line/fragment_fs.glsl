precision highp float;

varying lowp vec4 vColor;
varying lowp vec3 vNormal;
varying lowp float vLength;
varying lowp float vX;
varying lowp float vDash;

uniform float uk;

void main(void) {

    float dash = mod( vLength*2.0, 1.0 );

    if ( uk < vX || ( vDash > 0.0 && dash < 0.4 ) ){
        discard;
    }

    // gl_FragColor = vec4( vNormal.xyz,  1 );
    // gl_FragColor = vec4( vDash,vDash,vDash,  1 );
    gl_FragColor = vColor;
}