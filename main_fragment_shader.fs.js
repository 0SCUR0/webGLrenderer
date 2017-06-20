var main_fragment_shader = {text : `
    precision mediump float;

    varying vec4 varyingColor;
    
    void main(void) {
        gl_FragColor = varyingColor;
        // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
`};