//Colin Peter cypeter@ucsc.edu
//5/12/15
//Prog 3
//Creates multiple manipulable sharks

"use strict";

//globals
var gl; //the opengl context
var aspect; //the aspect ratio of the viewport
var vBuffer; //the shark vertex buffer
var nBuffer; //the shark normal buffer
var shark_prog; //the shader for the shark
var pick_prog; //the shader for the picking buffer
var pick_framebuffer; //the framebuffer to render the pick stencil to
var pick_texture; //the texture to render the pick stencil to

//Vertex attributes
var vPosition;
var vNormal;

//uniforms
var view_loc;
var pview_loc;
var ntrans_loc;
var pntrans_loc;
var pickid_loc;

//transformation matrices
var perspective;
var camdir;
var objects = [];
var current_transform;

//Current number of of vertices
var num_vertices;

//pick variables
var current_object = -1;
var current_mode;
var mode_begin;
var mode_update;
var doing_op = false;
function setmode(mode) {
	if (!doing_op) {
		current_mode = mode;
		switch (current_mode) {
			case "transx":
				mode_begin = transx_begin;
				mode_update = transx_update;
				break;
			case "transy":
				mode_begin = transy_begin;
				mode_update = transy_update;
				break;
			case "transz":
				mode_begin = transz_begin;
				mode_update = transz_update;
				break;
			case "transxy":
				mode_begin = transxy_begin;
				mode_update = transxy_update;
				break;
			case "transyz":
				mode_begin = transyz_begin;
				mode_update = transyz_update;
				break;
			case "transxz":
				mode_begin = transxz_begin;
				mode_update = transxz_update;
				break;
			case "transscreen":
				mode_begin = screen_begin;
				mode_update = screen_update;
				break;
			case "scale":
				mode_begin = scale_begin;
				mode_update = scale_update;
				break;
			case "rotx":
				mode_begin = rotx_begin;
				mode_update = rotx_update;
				break;
			case "roty":
				mode_begin = roty_begin;
				mode_update = roty_update;
				break;
			case "rotz":
				mode_begin = rotz_begin;
				mode_update = rotz_update;
				break;
			case "rotscreen":
				mode_begin = screenrot_begin;
				mode_update = screenrot_update;
				break;
			case "tumble":
				mode_begin = tumble_begin;
				mode_update = tumble_update;
				break;
			default:
				console.log("unknown mode " + current_mode);
		}
	}
}

//Initializes OpenGL stuff
function init() {
	//Create the framebuffer to render the pick stencil to
	pick_framebuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, pick_framebuffer);
	
	//Create the texture to render the pick stencil to
	pick_texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, pick_texture);
	//Set texture parameters (no filtering, use clamped coordinates)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	//Initialize texture
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, pick_texture, 0);
	
	//Use depth buffer for picking buffer since we have multiple potentially clipping objects
	var renderbuffer = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, canvas.width, canvas.height);
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
	
	gl.bindTexture(gl.TEXTURE_2D, null);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	
	//Set depth test function
	gl.depthFunc(gl.LESS);
	
	//Initialize the shaders to be used
	shark_prog = initShader(gl, vert_src, frag_src);
	pick_prog = initShader(gl, vert_src, pickfrag_src);
	
	//Allocate the vertex position buffer for rendering the shark
	vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	//Initialize the current buffer
	var sharkdat = buildShark();

	gl.bufferData(gl.ARRAY_BUFFER, sharkdat.data, gl.STATIC_DRAW);
	num_vertices = sharkdat.size;
	
	//Get the attribute to use the buffer for
	//get the vPosition attribute from the vertex shader
	vPosition = gl.getAttribLocation(shark_prog, "vPosition");
	
	nBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, sharkdat.norms, gl.STATIC_DRAW);
	vNormal = gl.getAttribLocation(shark_prog, "vNormal");
	
	//Set up the view matrix
	var d = 100/Math.sqrt(3);
	perspective = createPerspectiveTransform(d, d, d, -Math.atan(1/Math.sqrt(2)), Math.PI/4, 0, Math.PI/3, 1, 1000);
	camdir = getCameraDirection(-Math.atan(1/Math.sqrt(2)), Math.PI/4);
	//perspective = createPerspectiveTransform(0, 0, 100, 0, 0, 0, Math.PI/2, 1, 1000);
	
	initObjects();
		
	//Set up object matrices
	
	current_transform = new Float32Array(identity());
	
	//set up our uniforms
	gl.useProgram(shark_prog);
	
	//Projection matrix to use
	view_loc = gl.getUniformLocation(shark_prog, "transform");
	
	//Normal transformation to use
	ntrans_loc = gl.getUniformLocation(shark_prog, "normal_transform");
	
	gl.useProgram(pick_prog);
	pview_loc = gl.getUniformLocation(pick_prog, "transform");
	pntrans_loc = gl.getUniformLocation(pick_prog, "normal_transform");
	pickid_loc = gl.getUniformLocation(pick_prog, "pickid");
}



function initObjects(){
	for(var i = 0; i < 3; i++){
		objects[i] = {};
		objects[i].matrix = createObjectTransform([{type: "t", x: 0, y: 0, z:-20*i}]);
		objects[i].model;
		objects[i].shadow = false;
		objects[i].light = false;
	}

		
}

//Draws the scene
function display() {
	/*objects[1] = createObjectTransform([	{type: "ry", r: Math.PI/6},
												{type: "t", x: 40, y:0, z:0},
												{type: "rpz", x: 0, y: 50, z: 0, r: testval()*Math.PI*2}]);*/
	/*var d = 100/Math.sqrt(3);
	perspective = createPerspectiveTransform(d, d, d, -Math.atan(1/Math.sqrt(2)), Math.PI/4, 0, Math.PI/3, 1, 1000);
	gl.useProgram(shark_prog);
	gl.uniformMatrix4fv(view_loc, false, perspective);
	gl.useProgram(pick_prog);
	gl.uniformMatrix4fv(pview_loc, false, perspective);*/
	
	
	//set up vertex attributes
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);
	gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
	gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vNormal);
	
	//clear the entire framebuffer
	gl.clearColor(0.1, 0.1, 0.4, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.bindFramebuffer(gl.FRAMEBUFFER, pick_framebuffer);
	gl.clearColor(1.0, 1.0, 1.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	
	for (var i in objects) {
		//Set up transformation for the active object
		//The object has a unique transform, and if the object is the one being manipulated, it is also affected by the current transform
		var objtrans = objects[i].matrix.forwards;
		var invobjtrans = invert(objtrans);
		if (current_object == i) {
			objtrans = mult(objtrans, current_transform.forwards);
			invobjtrans = mult(current_transform.reverse, invobjtrans);
		}
		
		gl.enable(gl.DEPTH_TEST);
		//Use the stencil shader
		gl.useProgram(pick_prog);
		gl.uniformMatrix4fv(pview_loc, false, mult(objtrans, perspective));
		//gl.uniformMatrix4fv(pntrans_loc, false,  mult(transpose(objects[i].reverse), perspective));
		gl.uniform1i(pickid_loc, i);
		//Use the stencil framebuffer
		gl.bindFramebuffer(gl.FRAMEBUFFER, pick_framebuffer);
		
		//Set the viewport
		gl.viewport(0, 0, canvas.width, canvas.height);
		
		//Draw the picking stencil
		gl.drawArrays(gl.TRIANGLES, 0, num_vertices);
		
		//Unbind the framebuffer so we draw to the device now
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		
		//Enable depth test
		gl.enable(gl.DEPTH_TEST);
		
		//set the display viewport
		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
		
		//Set the shader to be used
		gl.useProgram(shark_prog);
		gl.uniformMatrix4fv(view_loc, false, mult(objtrans, perspective));
		gl.uniformMatrix4fv(ntrans_loc, false, transpose(invobjtrans));
		
		//draw with the specified attributes and program
		gl.drawArrays(gl.TRIANGLES, 0, num_vertices);
	}
	
	//We're drawing again soon!
	window.requestAnimationFrame(display);
}

//Load assets before we set up
function load() {
	var utiljs = document.createElement('script');
	utiljs.type = 'text/javascript';
	utiljs.src = "util.js";

	document.getElementsByTagName('head')[0].appendChild(utiljs);
}

//Sets up the canvas and OpenGL context, then starts the render loop
function setup() {
	//Set the canvas size, and get the aspect ratio while we're at it
	canvas.width = 640;
	canvas.height = 480;
	aspect = canvas.height/canvas.width;

	if (typeof testcanvas !== "undefined") {
		testcanvas.width = canvas.width;
		testcanvas.height = canvas.height;
	}
	
	try { //setup gl context
		gl = canvas.getContext("webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
	} catch (e) {
		gl = null;
	}

	if (!gl) {
		console.log("Unable to initialize WebGL.");
	} else {
		//Initialize rendering and stuff
		init();
		
		canvas.onmousedown = function(e) {
			if (e.layerX == undefined) {
				e.layerX = e.offsetX;
				e.layerY = e.offsetY;
			}
			
			var canvas_x = e.layerX;
			var canvas_y = e.layerY;
			
			var rect = canvas.getBoundingClientRect();
			if (rect.x != undefined) {
				canvas_x -= canvas.getBoundingClientRect().x;
				canvas_y -= canvas.getBoundingClientRect().y;
			}
			
			if (!doing_op) {
				var sample = new Uint8Array(4);
				
				//bind the pick framebuffer and read data at the point the mouse is at
				gl.bindFramebuffer(gl.FRAMEBUFFER, pick_framebuffer);
				gl.readPixels(Math.floor(canvas_x), canvas.height-Math.floor(canvas_y), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, sample);
				gl.bindFramebuffer(gl.FRAMEBUFFER, null);
				
				if (sample[0] != 255 && e.button == 0) {
					//console.log(e.button);
					//console.log(sample);
					doing_op = true;
					current_object = sample[0];
					
					//Begin the operation
					mode_begin(canvas_x, canvas_y);
				}
				/*
				if (typeof testcanvas !== "undefined") {
					var c = testcanvas.getContext("2d");
					c.fillStyle = "#DDDDDD";
					c.fillRect(0, 0, testcanvas.width, testcanvas.height);
					c.fillStyle = "#000000";
					var testx = 0;
					var testy = 0;
					
					var foo = function() {
						var size = 16;
						gl.bindFramebuffer(gl.FRAMEBUFFER, pick_framebuffer);
						gl.readPixels(testx, canvas.height-testy, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, sample);
						c.fillStyle = "rgb(" + sample[0] + "," + sample[0] + "," + sample[0] + ")";
						//console.log(sample[0]);
						c.fillRect(testx, testy, size, size);
						gl.bindFramebuffer(gl.FRAMEBUFFER, null);
						
						testx += size;
						if (testx >= 640) {
							testx = 0;
							testy += size;
						}
						if (testy < 480) {
							setTimeout(foo, 1);
						}
					}
					foo();
				}*/
			}
		};
		canvas.onmousemove = function(e) {
			if (e.layerX == undefined) {
				e.layerX = e.offsetX;
				e.layerY = e.offsetY;
			}
			
			var canvas_x = e.layerX;
			var canvas_y = e.layerY;
			
			var rect = canvas.getBoundingClientRect();
			if (rect.x != undefined) {
				canvas_x -= canvas.getBoundingClientRect().x;
				canvas_y -= canvas.getBoundingClientRect().y;
			}
			
			if (doing_op) {
				//continue the operation
				mode_update(canvas_x, canvas_y);
			}
		};
		canvas.onmouseup = function(e) {
			if (e.layerX == undefined) {
				e.layerX = e.offsetX;
				e.layerY = e.offsetY;
			}
			
			var canvas_x = e.layerX;
			var canvas_y = e.layerY;
			
			var rect = canvas.getBoundingClientRect();
			if (rect.x != undefined) {
				canvas_x -= canvas.getBoundingClientRect().x;
				canvas_y -= canvas.getBoundingClientRect().y;
			}
			
			if (doing_op && e.button == 0) {
				//end the operation and accumulate the current transform into the object transform
				mode_update(canvas_x, canvas_y);
				objects[current_object].matrix = {
													forwards: mult(objects[current_object].matrix.forwards, current_transform.forwards),
													reverse: mult(current_transform.reverse, objects[current_object].matrix.reverse)
				};
				
				doing_op = false;
				current_object = -1;
			}
		};
		
		//Render for the first time
		window.requestAnimationFrame(display);
	}
}

//debug input shit
/*
testmin.value = "0";
testmax.value = "1";
testtime.value = "1";
var test_min;
var test_max;
var test_timescale;
var test_init = performance.now();
function testval() {
	var now = performance.now();
	var mod = (Math.sin((now-test_init)*.002*test_timescale)+1)/2;
	return test_min + mod*(test_max-test_min);
}
function setTestMin() {
	test_min = Number(testmin.value);
}
function setTestMax() {
	test_max = Number(testmax.value);
}
function setTestTime() {
	test_timescale = Number(testtime.value);
}
setTestMin();
setTestMax();
setTestTime();*/