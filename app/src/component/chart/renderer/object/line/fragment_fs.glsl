precision highp float;

varying lowp vec4 vColor;
varying lowp vec3 vNormal;
varying lowp float vLength;
varying lowp float vX;

uniform float uk;

void main(void) {

    float dash = mod( vLength*3.0, 1.0 );

    if ( uk < vX || dash < 0.4 ){
        discard;
    }

    gl_FragColor = vec4( vNormal.xyz,  1 );
}