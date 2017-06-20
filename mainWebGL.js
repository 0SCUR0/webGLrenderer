FIELD_OF_VIEW = 45;
NEAR_DRAWING_DISTANCE = 0.1;
FAR_DRAWING_DISTANCE = 10000.0;

function mainWebGL(canvas, gl){

	gl.clearColor(0.14, 0.15, 0.12, 1);

	var fragmentShader = WebGL.getShader(gl, 'main_fragment_shader.fs');
	var vertexShader   = WebGL.getShader(gl, 'main_vertex_shader.vs');
	var shaderProgram  = WebGL.getShaderProgram(gl, fragmentShader, vertexShader);

	gl.useProgram(shaderProgram);

	// ATTRIBUTE INITIALIZATION ( how to deal w/ data) (ideally interpret data)
	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "attributeVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

	shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "attributeVertexColor");
	gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

	shaderProgram.projectionMatrixUniform = gl.getUniformLocation(shaderProgram, "uniformProjectionMatrix");//unifromProjectionMatrix
	shaderProgram.modelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "uniformModelViewMatrix");//uniformModelViewMatrix

	//BUFFER INITALIZATION (the data to be dealt with)
	// var icosahedron = new WebGL.OBJtoOBJECT(chest_open);

	var icosahedron = new WebGL.OBJtoOBJECT(chest_closed);
	triangleVertexPositionBuffer = gl.createBuffer();//WAT
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(icosahedron.vertices), gl.STATIC_DRAW);
	triangleVertexPositionBuffer.itemSize = 3;//if 4 then W
	triangleVertexPositionBuffer.numItems = icosahedron.vertex.length;
	console.log(icosahedron.vertex.length);

	cubeVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(icosahedron.vertexIndices), gl.STATIC_DRAW);
    cubeVertexIndexBuffer.itemSize = 3;
    // cubeVertexIndexBuffer.numItems = icosahedron.vertexIndices.length;//20 faces
    cubeVertexIndexBuffer.numItems = 20;//20 faces


	triangleVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
	var colors = [
		1.0, 0.0, 0.0, 1.0,
		0.0, 1.0, 0.0, 1.0,
		0.0, 0.0, 1.0, 1.0,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	triangleVertexColorBuffer.itemSize = 1;
	triangleVertexColorBuffer.numItems = 3;

	var modelViewMatrix = mat4.create();
	var modelViewMatrixStack = [];
	var projectionMatrix = mat4.create();

	var rotationTri = 0;	

	function drawScene(deltaTime) {
	
		resizeViewport(canvas, gl);
		
		//BACKGROUND COLOR
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.FRONT);

		//SET PROJECTION MATRIX
		mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 500.0, projectionMatrix);

		
		//Move model to draw in view
		mat4.identity(modelViewMatrix);
		mat4.translate(modelViewMatrix, [0.0, 0.0, -4.0]);//camera position

		mat4.rotate(modelViewMatrix, degreeToRadians(rotationTri), [0.9, 0.4945, 0]);
		
		rotationTri+= (126 * deltaTime ) / 1000;

		gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

		//draw fragments (use fragment shader)
		gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, triangleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.uniformMatrix4fv(shaderProgram.projectionMatrixUniform, false, projectionMatrix);
		gl.uniformMatrix4fv(shaderProgram.modelViewMatrixUniform, false, modelViewMatrix);
		// gl.drawArrays(gl.TRIANGLE_STRIP, 0, triangleVertexPositionBuffer.numItems);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
		
		// gl.drawElements(gl.LINE_LOOP, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		// gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		gl.drawElements(gl.TRIANGLE_FAN, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	};

	var previousFrameTime = 0;
	window.requestAnimationFrame(drawFrame);
	function drawFrame(){
		var deltaTime = Date.now() - previousFrameTime;
		drawScene(deltaTime);
		window.requestAnimationFrame(drawFrame);
		previousFrameTime = Date.now();
	};
};