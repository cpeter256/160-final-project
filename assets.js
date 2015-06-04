//Colin Peter cypeter@ucsc.edu
//5/12/15
//Prog 3
//Creates multiple manipulable sharks

//Source for all shaders
var vert_src;
var frag_src;
var pickfrag_src;

var volfrag_src;
var volvert_src;

//Status of our shader sources
var shader_status = [false, false, false, false, false];

//Shark data
var shark_coords;
var shark_polys;

//Status of our shark data
var shark_status = [false, false];

//Builds a Float32Array usable with GL_TRIANGLE_LIST of the loaded shark
//3 components per vertex
function buildShark() {
	var dat = {data: [], norms: [], flat_norms: [], size: 0};
	var v_norms = [];
	
	for (var poly = 0; poly < shark_polys.length; ++poly) {
		var the_poly = shark_polys[poly];
		
		var a = {	x: shark_coords[the_poly[1]][0],
					y: shark_coords[the_poly[1]][1],
					z: shark_coords[the_poly[1]][2]
		};
		var b = {	x: shark_coords[the_poly[2]][0],
					y: shark_coords[the_poly[2]][1],
					z: shark_coords[the_poly[2]][2]
		};
		var c = {	x: shark_coords[the_poly[3]][0],
					y: shark_coords[the_poly[3]][1],
					z: shark_coords[the_poly[3]][2]
		};
		
		//Get normal for this polygon
		var v = vadd(b, vscale(a, -1));
		var u = vadd(b, vscale(c, -1));
		var norm = normalize(cross(u, v));
		/*
		if (isNaN(norm.x) || isNaN(norm.y) || isNaN(norm.z)) {
			console.log(u);
			console.log(v);
		}*/
		
		for (var i = 3; i < shark_polys[poly].length; ++i) {
			dat.data.push(shark_coords[the_poly[1]][0]);
			dat.data.push(shark_coords[the_poly[1]][1]);
			dat.data.push(shark_coords[the_poly[1]][2]);
			
			dat.data.push(shark_coords[the_poly[i-1]][0]);
			dat.data.push(shark_coords[the_poly[i-1]][1]);
			dat.data.push(shark_coords[the_poly[i-1]][2]);
			
			dat.data.push(shark_coords[the_poly[i]][0]);
			dat.data.push(shark_coords[the_poly[i]][1]);
			dat.data.push(shark_coords[the_poly[i]][2]);
			
			dat.flat_norms.push(norm.x);
			dat.flat_norms.push(norm.y);
			dat.flat_norms.push(norm.z);
			dat.flat_norms.push(norm.x);
			dat.flat_norms.push(norm.y);
			dat.flat_norms.push(norm.z);
			dat.flat_norms.push(norm.x);
			dat.flat_norms.push(norm.y);
			dat.flat_norms.push(norm.z);
				
			dat.size += 3;
			
		}
		
		//Accumulate the polygon normal into every vertex in the polygon
		for (i = 0; i < shark_polys[poly].length; ++i) {
			if (v_norms[the_poly[i]] == undefined) {
				v_norms[the_poly[i]] = {x: 0, y: 0, z: 0};
			}
			v_norms[the_poly[i]] = vadd(v_norms[the_poly[i]], norm);
		}
	}
	
	//Normalize all vertex normals and add them to the array
	for (var poly = 0; poly < shark_polys.length; ++poly) {
		var the_poly = shark_polys[poly];
		
		for (var i = 3; i < shark_polys[poly].length; ++i) {
			var n = normalize(v_norms[the_poly[1]]);
			dat.norms.push(n.x);
			dat.norms.push(n.y);
			dat.norms.push(n.z);
			
			n = normalize(v_norms[the_poly[i-1]]);
			dat.norms.push(n.x);
			dat.norms.push(n.y);
			dat.norms.push(n.z);
			
			n = normalize(v_norms[the_poly[i]]);
			dat.norms.push(n.x);
			dat.norms.push(n.y);
			dat.norms.push(n.z);
		}
	}
	
	dat.data = new Float32Array(dat.data);
	dat.norms = new Float32Array(dat.norms);
	dat.flat_norms = new Float32Array(dat.flat_norms);
	
	return dat;
}

function makeSilhouette(coords, polys, lightpos) {
	//HOW TO MAKE SILHOUETTE:
	/*
	 *     Loop through all the model's triangles
	    If triangle faces the light source (dot product > 0)
	    Insert the three edges (pair of vertices), into an edge stack
	    Check for previous occurrence of each edges or it's reverse in the stack
	    If an edge or its reverse is found in the stack, remove both edges
	    Start with new triangle
	 */
	
	var dat = {data: [], side: [], size: 0};
	
	var edgeset = {};
	
	for (var poly = 0; poly < polys.length; ++poly) {
		var the_poly = polys[poly];
		
		var a = {	x: coords[the_poly[1]][0],
					y: coords[the_poly[1]][1],
					z: coords[the_poly[1]][2]
		};
		var b = {	x: coords[the_poly[2]][0],
					y: coords[the_poly[2]][1],
					z: coords[the_poly[2]][2]
		};
		var c = {	x: coords[the_poly[3]][0],
					y: coords[the_poly[3]][1],
					z: coords[the_poly[3]][2]
		};
		
		//Get normal for this polygon
		var v = vadd(b, vscale(a, -1));
		var u = vadd(b, vscale(c, -1));
		var norm = normalize(cross(u, v));
		var view = vadd(lightpos, vscale(a, -1/3));
		
		if (dot(norm, view) < 0) {
			for (var i = 2; i < shark_polys[poly].length; ++i) {
				var edge = {i1: the_poly[i-1], i2: the_poly[i]};
				if (coords[edge.i1][4]) {
					//edge.i1 = coords[edge.i1][4];
				}
				if (coords[edge.i2][4]) {
					//edge.i2 = coords[edge.i2][4];
				}
				var iedge = {i1: edge.i2, i2: edge.i1};
				
				var notfound = true;
				if (edgeset[hashEdge(edge)]) {
					//delete edgeset[hashEdge(edge)];
					notfound = false;
					//edgeset[hashEdge(edge)] = null;
					//edgeset[hashEdge(iedge)] = null;
				}
				if (edgeset[hashEdge(iedge)]) {
					//delete edgeset[hashEdge(iedge)];
					notfound = false;
					//edgeset[hashEdge(edge)] = null;
					//edgeset[hashEdge(iedge)] = null;
				}
				
				//if (notfound) {
					edgeset[hashEdge(edge)] = edge;
				//}
			}
		}
	}
	
	for (var i in edgeset) {
		if (edgeset[i] == null) continue;
		
		var x1 = coords[edgeset[i].i1][0];
		var y1 = coords[edgeset[i].i1][1];
		var z1 = coords[edgeset[i].i1][2];
		var x2 = coords[edgeset[i].i2][0];
		var y2 = coords[edgeset[i].i2][1];
		var z2 = coords[edgeset[i].i2][2];
		
		dat.data.push(x1);
		dat.data.push(y1);
		dat.data.push(z1);
		dat.side.push(0);
		dat.data.push(x2);
		dat.data.push(y2);
		dat.data.push(z2);
		dat.side.push(0);
		dat.data.push(x1);
		dat.data.push(y1);
		dat.data.push(z1);
		dat.side.push(1);
		
		dat.data.push(x1);
		dat.data.push(y1);
		dat.data.push(z1);
		dat.side.push(1);
		dat.data.push(x2);
		dat.data.push(y2);
		dat.data.push(z2);
		dat.side.push(0);
		dat.data.push(x2);
		dat.data.push(y2);
		dat.data.push(z2);
		dat.side.push(1);
		
		dat.size += 6;
	}
	
	dat.data = new Float32Array(dat.data);
	dat.side = new Float32Array(dat.side);
	return dat;
}
function hashEdge(edge) {
	return edge.i1*shark_coords.length + edge.i2;
}

//Loads shark resources
function loadShark() {
	var coordjs = document.createElement('script');
	coordjs.type = 'text/javascript';
	coordjs.src = "shark.coor.js";
	coordjs.onload = function() {
		shark_status[0] = true;
		var all_done = true;
		for (var i = 0; i < shark_status.length; ++i) {
			if (!shark_status[i]) {
				all_done = false;
				break;
			}
		}
		if (all_done) loadShaders();
	};
	document.getElementsByTagName('head')[0].appendChild(coordjs);
	
	var polyjs = document.createElement('script');
	polyjs.type = 'text/javascript';
	polyjs.src = "shark.poly.js";
	polyjs.onload = function() {
		shark_status[1] = true;
		var all_done = true;
		for (var i = 0; i < shark_status.length; ++i) {
			if (!shark_status[i]) {
				all_done = false;
				break;
			}
		}
		if (all_done) loadShaders();
	};
	document.getElementsByTagName('head')[0].appendChild(polyjs);
}

//Status checker for our shaders, starts the program once everything's loaded

function check_status(id, req, set) {
	if (req.readyState >= 4) {
		if (req.status != 200) {
			console.log("Something bad happened! Request returned " + req.status);
		}
		set(req.responseText);
		shader_status[id] = true;
		req.onreadystatechange = null;
		var done = true;
		for (var i = 0; i < shader_status.length; ++i) {
			if (!shader_status[i]) done = false;
		}
		if (done) {
			//console.log(shader_status);
			setup();
		}
	}
}

//Loads all shaders
function loadShaders() {
	/*
	var vertjs = document.createElement('script');
	vertjs.type = 'text/javascript';
	vertjs.src = "shark.vert.js";
	vertjs.onload = function() {
		shader_status[0] = true;
		vert_src = shark_vert_src;
		var all_done = true;
		for (var i = 0; i < shader_status.length; ++i) {
			if (!shader_status[i]) {
				all_done = false;
				break;
			}
		}
		if (all_done) setup();
	}
	document.getElementsByTagName('head')[0].appendChild(vertjs);
	
	var fragjs = document.createElement('script');
	fragjs.type = 'text/javascript';
	fragjs.src = "shark.frag.js";
	fragjs.onload = function() {
		shader_status[1] = true;
		frag_src = shark_frag_src;
		var all_done = true;
		for (var i = 0; i < shader_status.length; ++i) {
			if (!shader_status[i]) {
				all_done = false;
				break;
			}
		}
		if (all_done) setup();
	}
	document.getElementsByTagName('head')[0].appendChild(fragjs);
	
	var pfragjs = document.createElement('script');
	pfragjs.type = 'text/javascript';
	pfragjs.src = "sharkpick.frag.js";
	pfragjs.onload = function() {
		shader_status[2] = true;
		pickfrag_src = sharkpick_frag_src;
		var all_done = true;
		for (var i = 0; i < shader_status.length; ++i) {
			if (!shader_status[i]) {
				all_done = false;
				break;
			}
		}
		if (all_done) setup();
	}
	document.getElementsByTagName('head')[0].appendChild(pfragjs);*/
	
	console.log("Don't forget to convert to JS at the end so we don't have Chrome fuckery!");
	
	var new_request;
	if (window.XMLHttpRequest) {
		new_request = function() {
			return new XMLHttpRequest();
		};
	} else {
		alert("Stop using internet exploder!");
		new_request = function() {
			return new ActiveXObject("Microsoft.XMLHTTP");
		};
	}
	try {
		var hfv = new_request();
		hfv.onreadystatechange = function() {check_status(0, hfv, function(text) {vert_src = text;});};
		hfv.overrideMimeType('text/plain');
		hfv.open("GET", "shark.vert");
		hfv.send();
		
		var hff = new_request();
		hff.onreadystatechange = function() {check_status(1, hff, function(text) {frag_src = text;});};
		hff.overrideMimeType('text/plain');
		hff.open("GET", "shark.frag");
		hff.send();
		
		var spf = new_request();
		spf.onreadystatechange = function() {check_status(2, spf, function(text) {pickfrag_src = text;});};
		spf.overrideMimeType('text/plain');
		spf.open("GET", "sharkpick.frag");
		spf.send();
		
		var tvv = new_request();
		tvv.onreadystatechange = function() {check_status(3, tvv, function(text) {volvert_src = text;});};
		tvv.overrideMimeType('text/plain');
		tvv.open("GET", "test_volume.vert");
		tvv.send();
		
		var tvf = new_request();
		tvf.onreadystatechange = function() {check_status(4, tvf, function(text) {volfrag_src = text;});};
		tvf.overrideMimeType('text/plain');
		tvf.open("GET", "test_volume.frag");
		tvf.send();
	} catch (e) {
		alert("It looks like you might be using Chrome. For various reasons, Chrome is broke as shit at certain AJAX-related things. In order to run this, restart Chrome with the\n --disable-web-security flag and try again, or load it from a (possible local) web server. Or even better, run it in Firefox.");
	}
}

//Creates a program given the shader source
function initShader(gl, vertexShaderSrc, fragmentShaderSrc) {
	var vertShdr;
	var fragShdr;

	//Allocate a vertex shader on the GPU
	vertShdr = gl.createShader( gl.VERTEX_SHADER );
	//Set the GLSL source of the vertex shader
	gl.shaderSource( vertShdr, vertexShaderSrc );
	//Compile the shader so we can run it
	gl.compileShader( vertShdr );
	//if shader is not compiled
	if ( !gl.getShaderParameter(vertShdr, gl.COMPILE_STATUS) ) {
		//get logged info from the shader (presumably an error)
		var msg = "Vertex shader failed to compile.  The error log is:\n"
		+ gl.getShaderInfoLog( vertShdr );
		console.log( msg );
		return -1;
	}

	//Exactly the same stuff as in the vertex shader
	fragShdr = gl.createShader( gl.FRAGMENT_SHADER );
	gl.shaderSource( fragShdr, fragmentShaderSrc );
	gl.compileShader( fragShdr );
	if ( !gl.getShaderParameter(fragShdr, gl.COMPILE_STATUS) ) {
		var msg = "Fragment shader failed to compile.  The error log is:\n"
		+ gl.getShaderInfoLog( fragShdr );
		console.log( msg );
		return -1;
	}
	
	//allocate a program on the GPU
	var program = gl.createProgram();
	//set the program's vertex shader
	gl.attachShader( program, vertShdr );
	//set the program's fragment shader
	gl.attachShader( program, fragShdr );
	//link the program so we can execute it
	gl.linkProgram( program );
	
	//if shader failed to link
	if ( !gl.getProgramParameter(program, gl.LINK_STATUS) ) {
		//get logged info from program (presumably an error)
		var msg = "Shader program failed to link.  The error log is:\n"
			+ gl.getProgramInfoLog( program );
		console.log( msg );
		return -1;
	}

	return program;
}

loadShark();