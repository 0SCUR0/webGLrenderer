var main_vertex_shader = {text : `
	attribute vec3 attributeVertexPosition;
	attribute vec4 attributeVertexColor;

    uniform mat4 uniformModelViewMatrix;
    uniform mat4 uniformProjectionMatrix;

    varying vec4 varyingColor;

    void main(void) {

        gl_Position = uniformProjectionMatrix * uniformModelViewMatrix * vec4(attributeVertexPosition, 1.0);
        varyingColor = attributeVertexColor;
        // varyingColor = vec4(0.0, 1.0, 0.0, 1.0);

    }
`};