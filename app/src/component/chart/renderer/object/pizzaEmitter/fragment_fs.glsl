precision highp float;

varying highp vec2 vTextureCoord;
varying float vOpacity;

uniform sampler2D uSampler;

void main(void) {
    gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));

    gl_FragColor.a = gl_FragColor.a * vOpacity;

    if( gl_FragColor.a <= 0.0 )
        discard;
}