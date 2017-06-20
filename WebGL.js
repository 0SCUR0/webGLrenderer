CANVAS_LAYERS = 1;//16 is the limit
FILL_SCREEN = true;//All canvases

WebGL = {
   canvas : new Array(Math.min(Math.max(CANVAS_LAYERS, 0), 16)),
   context : new Array(),
   initialize : function(){
      for (var i = WebGL.canvas.length - 1; i >= 0; i--) {
         WebGL.canvas[i] = document.createElement('canvas');
         WebGL.context[i] = WebGL.canvas[i].getContext('webgl');
         
         if (!WebGL.context[i]){ 
            console.warn('GL-Context for '+
               (i === 0 ? 'main ' : '') +
               'canvas layer' +
               (i === 0 ? '' : ' '+ i) +
               ' could not be initialized');
         }
         else{
            body.appendChild(WebGL.canvas[i]);
         }
         
         WebGL.canvas[i].id = i;
         if(FILL_SCREEN === true){
            //BOTTLENECK WAITING FOR OPTIMIZATION & retina
            WebGL.context[i].viewport(0, 0, window.innerWidth, window.innerHeight);
            WebGL.canvas[i].className = 'fill-screen';
            WebGL.canvas[i].width = window.innerWidth;
            WebGL.canvas[i].height = window.innerHeight;
         };

         renderCanvas(i, WebGL.canvas[i], WebGL.context[i]);//SOMETIMES WEIRD ERROR try/catch -> reload (download?)
      }         
   },
   shaderProgram : [],
   initializeShaderProgram :function(gl, vertexShader, fragmentShader){},
   getShaderProgram : function(gl, vertexShader, fragmentShader){

   	var program = gl.createProgram();
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);

		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			alert("Could not initialise shaders");
		}
      
      WebGL.shaderProgram[WebGL.shaderProgram.length] = program;
		return program;
      //needs dictionary magic
      // console.log(vertexShader + fragmentShader +' programs linked!');
   },
   getShader : function(gl, scriptName){
      fs = /fs$/.test(scriptName);
      shader = gl.createShader(fs ? gl.FRAGMENT_SHADER : gl.VERTEX_SHADER );
      gl.shaderSource(shader, eval(scriptName.slice(0,-3)).text);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
         console.error(gl.getShaderInfoLog(shader));
         return null;
      }

      return shader;
   },
   OBJtoOBJECT : function(objString){   
      var getVertices = function(string){
         var vertexArray = [];
         for (var i = 0; i < string.match(/v (.*)\n/g).length; i++) {
            var tempVertex = string.match(/v (.*)\n/g)[i].substring(2).split(" ");
            vertexArray.push(parseFloat(tempVertex[0]));
            vertexArray.push(parseFloat(tempVertex[1]));
            vertexArray.push(parseFloat(tempVertex[2]));
            // tempVertex[3] != "undefined" ? : vertexArray.parseFloat(tempVertex[3]));   
         };    
         return vertexArray;
      };
      var getVertexes = function(string){
         var vertexArray = [];
         for (var i = 0; i < string.match(/v (.*)\n/g).length; i++) {
            var tempVertex = string.match(/v (.*)\n/g)[i].substring(2).split(" ");
            vertexArray.push({
               x:parseFloat(tempVertex[0]), 
               y:parseFloat(tempVertex[1]), 
               z:parseFloat(tempVertex[2]), 
               w:tempVertex[3] != "undefined" ? 1.0 :
               parseFloat(tempVertex[3]) 
            });
         };    
         return vertexArray;
      };
      var getFaceIndexes = function(string){
         var indexArray = [];
         for (var i = 0; i < string.match(/f (.*)\n/g).length; i++) {
            var tempFaceIndex = string.match(/f (.*)\n/g)[i].substring(2).split(" ");
            for (var j = 0; j <= tempFaceIndex.length -1; j++) {
               if(tempFaceIndex[j] != ""){
                  indexArray.push(parseFloat(tempFaceIndex[j]));
               };
            };
         };
         return indexArray;
      };
      //OBJtoOBJECT returns:
      return {
         text : objString.text,
         line : objString.text.match(/[^\r\n]+/g),
         objectName : objString.text.match(/o (.*)\n/g)[0].substring(2).slice(0,-1),
         vertex : new getVertexes(objString.text),
         vertices : new getVertices(objString.text),
         vertexIndices : new getFaceIndexes(objString.text)
      };
   }
};


function renderCanvas(canvasId, canvas, gl){

   webGL = [function(){mainWebGL(canvas, gl);}];
   webGL[canvasId]();
   //TO DO: layer management.
   // webGL[16]();//16 is too much of a magic number!!!
};


function resizeViewport(canvas, gl){
	gl.viewportWidth = canvas.clientWidth;
	gl.viewportHeight = canvas.clientHeight;
};
