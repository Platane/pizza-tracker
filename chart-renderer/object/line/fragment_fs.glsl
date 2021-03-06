precision highp float;

varying lowp vec4 vColor;
varying lowp vec3 vNormal;
varying lowp float vLength;
varying lowp float vX;
varying lowp float vDash;

uniform float uk;

void main(void) {

    float dash = mod( vLength*2.0, 1.0 );

    if (
        // do not display if the point is after k
        uk < vX
        ||

        // do not display if the point is in a empty dash segment
        ( vDash > 0.0 && dash < 0.4 )
        ||

        // dummy use of vNormal, to prevent it from being removed at optimisation ( and therefor crash the app when trying to bind to a removed attribute )
        vNormal.x > 99.9
        ){
        discard;
    }

    // gl_FragColor = vec4( vNormal.xyz,  1 );
    // gl_FragColor = vec4( vDash,vDash,vDash,  1 );
    gl_FragColor = vColor;
}