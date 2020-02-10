// precision highp float;

varying highp vec2 vTextureCoord;

uniform sampler2D uSampler;

void main(void) {
    gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    // gl_FragColor = vec4(0.3,1.0,0.3,1.0);
    if( gl_FragColor.a <= 0.0 )
        discard;
}