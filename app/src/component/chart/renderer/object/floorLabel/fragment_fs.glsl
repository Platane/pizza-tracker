// precision highp float;

varying highp vec2 vTextureCoord;

uniform sampler2D uSampler;

void main(void) {
    gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));

    if( gl_FragColor.a <= 0.0 )
        discard;
}