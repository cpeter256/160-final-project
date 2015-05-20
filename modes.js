//Colin Peter cypeter@ucsc.edu
//5/12/15
//Prog 3
//Creates multiple manipulable sharks

var orig_pos = null;

//mode functions for all the different tools
//lots of irritating math here that I have no desire to comment the details of.
//the gist of these is that you project the place the user clicked onto a plane 
//which is oriented so that the result point can be compared with an original
//result point and a scalar can be computed depending on their relative positions
//this scalar is used to determine how much the given transformation is applied

var transx_begin = function(canvas_x, canvas_y) {
	var pos = [	0, 0, 0, 1,
				0, 0, 0, 0,
				0, 0, 0, 0,
				0, 0, 0, 0];
	pos = mult(pos, objects[current_object].matrix.forwards);
	pos = {x: pos[0], y: pos[1], z: pos[2]};
	
	var norm = {x: 1, y: 0, z: 0};
	norm = vscale(vadd(camdir, vscale(norm, -dot(norm, camdir))), -1);
	
	pos = -dot(pos, norm)/Math.sqrt(dot(norm, norm));
	
	orig_pos = planeproj(canvas_x, canvas_y, perspective, norm, pos).x;
	
	transx_update(canvas_x, canvas_y);
};
var transx_update = function(canvas_x, canvas_y) {
	var pos = [	0, 0, 0, 1,
				0, 0, 0, 0,
				0, 0, 0, 0,
				0, 0, 0, 0];
	pos = mult(pos, objects[current_object].matrix.forwards);
	pos = {x: pos[0], y: pos[1], z: pos[2]};
	
	var norm = {x: 1, y: 0, z: 0};
	norm = vscale(vadd(camdir, vscale(norm, -dot(norm, camdir))), -1);
	
	pos = -dot(pos, norm)/Math.sqrt(dot(norm, norm));
	
	var cur_pos = planeproj(canvas_x, canvas_y, perspective, norm, pos).x;
	var diff = cur_pos-orig_pos;
	
	current_transform = {
						forwards: [
									1, 0, 0, 0,
									0, 1, 0, 0,
									0, 0, 1, 0,
									diff, 0, 0, 1],
						reverse: [
									1, 0, 0, 0,
									0, 1, 0, 0,
									0, 0, 1, 0,
									-diff, 0, 0, 1]
						};
};
var transy_begin = function(canvas_x, canvas_y) {
	var pos = [	0, 0, 0, 1,
				0, 0, 0, 0,
				0, 0, 0, 0,
				0, 0, 0, 0];
	pos = mult(pos, objects[current_object].matrix.forwards);
	pos = {x: pos[0], y: pos[1], z: pos[2]};
	
	var norm = {x: 0, y: 1, z: 0};
	norm = vscale(vadd(camdir, vscale(norm, -dot(norm, camdir))), -1);
	
	pos = -dot(pos, norm)/Math.sqrt(dot(norm, norm));
	
	orig_pos = planeproj(canvas_x, canvas_y, perspective, norm, pos).y;
	
	transy_update(canvas_x, canvas_y);
};
var transy_update = function(canvas_x, canvas_y) {
	var pos = [	0, 0, 0, 1,
				0, 0, 0, 0,
				0, 0, 0, 0,
				0, 0, 0, 0];
	pos = mult(pos, objects[current_object].matrix.forwards);
	pos = {x: pos[0], y: pos[1], z: pos[2]};
	
	var norm = {x: 0, y: 1, z: 0};
	norm = vscale(vadd(camdir, vscale(norm, -dot(norm, camdir))), -1);
	
	pos = -dot(pos, norm)/Math.sqrt(dot(norm, norm));
	
	var cur_pos = planeproj(canvas_x, canvas_y, perspective, norm, pos).y;
	var diff = cur_pos-orig_pos;
	
	current_transform = {
						forwards: [
									1, 0, 0, 0,
									0, 1, 0, 0,
									0, 0, 1, 0,
									0, diff, 0, 1],
						reverse: [
									1, 0, 0, 0,
									0, 1, 0, 0,
									0, 0, 1, 0,
									0, -diff, 0, 1]
						};
};
var transz_begin = function(canvas_x, canvas_y) {
	var pos = [	0, 0, 0, 1,
				0, 0, 0, 0,
				0, 0, 0, 0,
				0, 0, 0, 0];
	pos = mult(pos, objects[current_object].matrix.forwards);
	pos = {x: pos[0], y: pos[1], z: pos[2]};
	
	var norm = {x: 0, y: 0, z: 1};
	norm = vscale(vadd(camdir, vscale(norm, -dot(norm, camdir))), -1);
	
	pos = -dot(pos, norm)/Math.sqrt(dot(norm, norm));
	
	orig_pos = planeproj(canvas_x, canvas_y, perspective, norm, pos).z;
	
	transz_update(canvas_x, canvas_y);
};
var transz_update = function(canvas_x, canvas_y) {
	var pos = [	0, 0, 0, 1,
				0, 0, 0, 0,
				0, 0, 0, 0,
				0, 0, 0, 0];
	pos = mult(pos, objects[current_object].matrix.forwards);
	pos = {x: pos[0], y: pos[1], z: pos[2]};
	
	var norm = {x: 0, y: 0, z: 1};
	norm = vscale(vadd(camdir, vscale(norm, -dot(norm, camdir))), -1);
	
	pos = -dot(pos, norm)/Math.sqrt(dot(norm, norm));
	
	var cur_pos = planeproj(canvas_x, canvas_y, perspective, norm, pos).z;
	var diff = cur_pos-orig_pos;
	
	current_transform = {
						forwards: [
									1, 0, 0, 0,
									0, 1, 0, 0,
									0, 0, 1, 0,
									0, 0, diff, 1],
						reverse: [
									1, 0, 0, 0,
									0, 1, 0, 0,
									0, 0, 1, 0,
									0, 0, -diff, 1]
						};
};

var transxy_begin = function(canvas_x, canvas_y) {
	var pos = [	0, 0, 0, 1,
				0, 0, 0, 0,
				0, 0, 0, 0,
				0, 0, 0, 0];
	pos = mult(pos, objects[current_object].matrix.forwards);
	pos = {x: pos[0], y: pos[1], z: pos[2]};
	
	var norm = {x: 0, y: 0, z: 1};
	
	pos = -dot(pos, norm)/Math.sqrt(dot(norm, norm));
	
	orig_pos = planeproj(canvas_x, canvas_y, perspective, norm, pos);
	
	transxy_update(canvas_x, canvas_y);
};
var transxy_update = function(canvas_x, canvas_y) {
	var pos = [	0, 0, 0, 1,
				0, 0, 0, 0,
				0, 0, 0, 0,
				0, 0, 0, 0];
	pos = mult(pos, objects[current_object].matrix.forwards);
	pos = {x: pos[0], y: pos[1], z: pos[2]};
	
	var norm = {x: 0, y: 0, z: 1};
	
	pos = -dot(pos, norm)/Math.sqrt(dot(norm, norm));
	
	var cur_pos = planeproj(canvas_x, canvas_y, perspective, norm, pos);
	var diff = {x: cur_pos.x-orig_pos.x, y: cur_pos.y-orig_pos.y};
	
	current_transform = {
						forwards: [
									1, 0, 0, 0,
									0, 1, 0, 0,
									0, 0, 1, 0,
									diff.x, diff.y, 0, 1],
						reverse: [
									1, 0, 0, 0,
									0, 1, 0, 0,
									0, 0, 1, 0,
									-diff.x, -diff.y, 0, 1]
						};
};

var transyz_begin = function(canvas_x, canvas_y) {
	var pos = [	0, 0, 0, 1,
				0, 0, 0, 0,
				0, 0, 0, 0,
				0, 0, 0, 0];
	pos = mult(pos, objects[current_object].matrix.forwards);
	pos = {x: pos[0], y: pos[1], z: pos[2]};
	
	var norm = {x: 1, y: 0, z: 0};
	
	pos = -dot(pos, norm)/Math.sqrt(dot(norm, norm));
	
	orig_pos = planeproj(canvas_x, canvas_y, perspective, norm, pos);
	
	transyz_update(canvas_x, canvas_y);
};
var transyz_update = function(canvas_x, canvas_y) {
	var pos = [	0, 0, 0, 1,
				0, 0, 0, 0,
				0, 0, 0, 0,
				0, 0, 0, 0];
	pos = mult(pos, objects[current_object].matrix.forwards);
	pos = {x: pos[0], y: pos[1], z: pos[2]};
	
	var norm = {x: 1, y: 0, z: 0};
	
	pos = -dot(pos, norm)/Math.sqrt(dot(norm, norm));
	
	var cur_pos = planeproj(canvas_x, canvas_y, perspective, norm, pos);
	var diff = {y: cur_pos.y-orig_pos.y, z: cur_pos.z-orig_pos.z};
	
	current_transform = {
						forwards: [
									1, 0, 0, 0,
									0, 1, 0, 0,
									0, 0, 1, 0,
									0, diff.y, diff.z, 1],
						reverse: [
									1, 0, 0, 0,
									0, 1, 0, 0,
									0, 0, 1, 0,
									0, -diff.y, -diff.z, 1]
						};
};

var transxz_begin = function(canvas_x, canvas_y) {
	var pos = [	0, 0, 0, 1,
				0, 0, 0, 0,
				0, 0, 0, 0,
				0, 0, 0, 0];
	pos = mult(pos, objects[current_object].matrix.forwards);
	pos = {x: pos[0], y: pos[1], z: pos[2]};
	
	var norm = {x: 0, y: 1, z: 0};
	
	pos = -dot(pos, norm)/Math.sqrt(dot(norm, norm));
	
	orig_pos = planeproj(canvas_x, canvas_y, perspective, norm, pos);
	
	transxz_update(canvas_x, canvas_y);
};
var transxz_update = function(canvas_x, canvas_y) {
	var pos = [	0, 0, 0, 1,
				0, 0, 0, 0,
				0, 0, 0, 0,
				0, 0, 0, 0];
	pos = mult(pos, objects[current_object].matrix.forwards);
	pos = {x: pos[0], y: pos[1], z: pos[2]};
	
	var norm = {x: 0, y: 1, z: 0};
	
	pos = -dot(pos, norm)/Math.sqrt(dot(norm, norm));
	
	var cur_pos = planeproj(canvas_x, canvas_y, perspective, norm, pos);
	var diff = {x: cur_pos.x-orig_pos.x, z: cur_pos.z-orig_pos.z};
	
	current_transform = {
						forwards: [
									1, 0, 0, 0,
									0, 1, 0, 0,
									0, 0, 1, 0,
									diff.x, 0, diff.z, 1],
						reverse: [
									1, 0, 0, 0,
									0, 1, 0, 0,
									0, 0, 1, 0,
									-diff.x, 0, -diff.z, 1]
						};
};

var screen_begin = function(canvas_x, canvas_y) {
	var pos = [	0, 0, 0, 1,
				0, 0, 0, 0,
				0, 0, 0, 0,
				0, 0, 0, 0];
	pos = mult(pos, objects[current_object].matrix.forwards);
	pos = {x: pos[0], y: pos[1], z: pos[2]};
	
	var norm = camdir;
	
	pos = -dot(pos, norm)/Math.sqrt(dot(norm, norm));
	
	orig_pos = planeproj(canvas_x, canvas_y, perspective, norm, pos);
	
	screen_update(canvas_x, canvas_y);
};
var screen_update = function(canvas_x, canvas_y) {
	var pos = [	0, 0, 0, 1,
				0, 0, 0, 0,
				0, 0, 0, 0,
				0, 0, 0, 0];
	pos = mult(pos, objects[current_object].matrix.forwards);
	pos = {x: pos[0], y: pos[1], z: pos[2]};
	
	var norm = camdir;
	
	pos = -dot(pos, norm)/Math.sqrt(dot(norm, norm));
	
	var cur_pos = planeproj(canvas_x, canvas_y, perspective, norm, pos);
	var diff = vadd(cur_pos, vscale(orig_pos, -1));
	
	current_transform = {
						forwards: [
									1, 0, 0, 0,
									0, 1, 0, 0,
									0, 0, 1, 0,
									diff.x, diff.y, diff.z, 1],
						reverse: [
									1, 0, 0, 0,
									0, 1, 0, 0,
									0, 0, 1, 0,
									-diff.x, -diff.y, -diff.z, 1]
						};
};






var scale_begin = function(canvas_x, canvas_y) {
	var pos = [	0, 0, 0, 1,
				0, 0, 0, 0,
				0, 0, 0, 0,
				0, 0, 0, 0];
	pos = mult(pos, objects[current_object].matrix.forwards);
	pos = {x: pos[0], y: pos[1], z: pos[2]};
	var obj_pos = pos;
	
	var norm = camdir;
	
	pos = -dot(pos, norm)/Math.sqrt(dot(norm, norm));
	
	orig_pos = planeproj(canvas_x, canvas_y, perspective, norm, pos);
	orig_pos = Math.sqrt(	(orig_pos.x-obj_pos.x)*(orig_pos.x-obj_pos.x) +
							(orig_pos.y-obj_pos.y)*(orig_pos.y-obj_pos.y) +
							(orig_pos.z-obj_pos.z)*(orig_pos.z-obj_pos.z));
	//console.log(orig_pos*180/Math.PI);
	
	scale_update(canvas_x, canvas_y);
};
var scale_update = function(canvas_x, canvas_y) {
	var pos = [	0, 0, 0, 1,
				0, 0, 0, 0,
				0, 0, 0, 0,
				0, 0, 0, 0];
	pos = mult(pos, objects[current_object].matrix.forwards);
	pos = {x: pos[0], y: pos[1], z: pos[2]};
	var obj_pos = pos;
	
	var norm = camdir;
	
	pos = -dot(pos, norm)/Math.sqrt(dot(norm, norm));
	
	var cur_pos = planeproj(canvas_x, canvas_y, perspective, norm, pos);
	cur_pos = Math.sqrt(	(cur_pos.x-obj_pos.x)*(cur_pos.x-obj_pos.x) +
							(cur_pos.y-obj_pos.y)*(cur_pos.y-obj_pos.y) +
							(cur_pos.z-obj_pos.z)*(cur_pos.z-obj_pos.z));
	var factor = cur_pos/orig_pos;
	
	current_transform = {
						forwards: mult(mult(
											[	1, 0, 0, 0,
												0, 1, 0, 0,
												0, 0, 1, 0,
												-obj_pos.x, -obj_pos.y, -obj_pos.z, 1],
											[	factor, 0, 0, 0,
												0, factor, 0, 0,
												0, 0, factor, 0,
												0, 0, 0, 1]),
											[	1, 0, 0, 0,
												0, 1, 0, 0,
												0, 0, 1, 0,
												obj_pos.x, obj_pos.y, obj_pos.z, 1]),
						reverse: mult(mult(
											[	1, 0, 0, 0,
												0, 1, 0, 0,
												0, 0, 1, 0,
												-obj_pos.x, -obj_pos.y, -obj_pos.z, 1],
											[	1/factor, 0, 0, 0,
												0, 1/factor, 0, 0,
												0, 0, 1/factor, 0,
												0, 0, 0, 1]),
											[	1, 0, 0, 0,
												0, 1, 0, 0,
												0, 0, 1, 0,
												obj_pos.x, obj_pos.y, obj_pos.z, 1])
	};
};







var rotx_begin = function(canvas_x, canvas_y) {
	var pos = [	0, 0, 0, 1,
				0, 0, 0, 0,
				0, 0, 0, 0,
				0, 0, 0, 0];
	pos = mult(pos, objects[current_object].matrix.forwards);
	pos = {x: pos[0], y: pos[1], z: pos[2]};
	var obj_pos = pos;
	
	var norm = {x: 1, y: 0, z: 0};
	
	pos = -dot(pos, norm)/Math.sqrt(dot(norm, norm));
	
	orig_pos = planeproj(canvas_x, canvas_y, perspective, norm, pos);
	orig_pos = Math.atan2(orig_pos.y-obj_pos.y, orig_pos.z-obj_pos.z);
	//console.log(orig_pos*180/Math.PI);
	
	rotx_update(canvas_x, canvas_y);
};
var rotx_update = function(canvas_x, canvas_y) {
	var pos = [	0, 0, 0, 1,
				0, 0, 0, 0,
				0, 0, 0, 0,
				0, 0, 0, 0];
	pos = mult(pos, objects[current_object].matrix.forwards);
	pos = {x: pos[0], y: pos[1], z: pos[2]};
	var obj_pos = pos;
	
	var norm = {x: 1, y: 0, z: 0};
	
	pos = -dot(pos, norm)/Math.sqrt(dot(norm, norm));
	
	var cur_pos = planeproj(canvas_x, canvas_y, perspective, norm, pos);
	var theta = Math.atan2(cur_pos.y-obj_pos.y, cur_pos.z-obj_pos.z) - orig_pos;
	
	current_transform = {
						forwards: createRotPointX(obj_pos.x, obj_pos.y, obj_pos.z, theta),
						reverse: createRotPointX(obj_pos.x, obj_pos.y, obj_pos.z, -theta)
						};
};

var roty_begin = function(canvas_x, canvas_y) {
	var pos = [	0, 0, 0, 1,
				0, 0, 0, 0,
				0, 0, 0, 0,
				0, 0, 0, 0];
	pos = mult(pos, objects[current_object].matrix.forwards);
	pos = {x: pos[0], y: pos[1], z: pos[2]};
	var obj_pos = pos;
	
	var norm = {x: 0, y: 1, z: 0};
	
	pos = -dot(pos, norm)/Math.sqrt(dot(norm, norm));
	
	orig_pos = planeproj(canvas_x, canvas_y, perspective, norm, pos);
	orig_pos = Math.atan2(orig_pos.x-obj_pos.x, -(orig_pos.z-obj_pos.z));
	//console.log(orig_pos*180/Math.PI);
	
	roty_update(canvas_x, canvas_y);
};
var roty_update = function(canvas_x, canvas_y) {
	var pos = [	0, 0, 0, 1,
				0, 0, 0, 0,
				0, 0, 0, 0,
				0, 0, 0, 0];
	pos = mult(pos, objects[current_object].matrix.forwards);
	pos = {x: pos[0], y: pos[1], z: pos[2]};
	var obj_pos = pos;
	
	var norm = {x: 0, y: 1, z: 0};
	
	pos = -dot(pos, norm)/Math.sqrt(dot(norm, norm));
	
	var cur_pos = planeproj(canvas_x, canvas_y, perspective, norm, pos);
	var theta = Math.atan2(cur_pos.x-obj_pos.x, -(cur_pos.z-obj_pos.z)) - orig_pos;
	
	current_transform = {
						forwards: createRotPointY(obj_pos.x, obj_pos.y, obj_pos.z, theta),
						reverse: createRotPointY(obj_pos.x, obj_pos.y, obj_pos.z, -theta)
						};
};

var rotz_begin = function(canvas_x, canvas_y) {
	var pos = [	0, 0, 0, 1,
				0, 0, 0, 0,
				0, 0, 0, 0,
				0, 0, 0, 0];
	pos = mult(pos, objects[current_object].matrix.forwards);
	pos = {x: pos[0], y: pos[1], z: pos[2]};
	var obj_pos = pos;
	
	var norm = {x: 0, y: 0, z: 1};
	
	pos = -dot(pos, norm)/Math.sqrt(dot(norm, norm));
	
	orig_pos = planeproj(canvas_x, canvas_y, perspective, norm, pos);
	orig_pos = Math.atan2(orig_pos.y-obj_pos.y, orig_pos.x-obj_pos.x);
	//console.log(orig_pos*180/Math.PI);
	
	rotz_update(canvas_x, canvas_y);
};
var rotz_update = function(canvas_x, canvas_y) {
	var pos = [	0, 0, 0, 1,
				0, 0, 0, 0,
				0, 0, 0, 0,
				0, 0, 0, 0];
	pos = mult(pos, objects[current_object].matrix.forwards);
	pos = {x: pos[0], y: pos[1], z: pos[2]};
	var obj_pos = pos;
	
	var norm = {x: 0, y: 0, z: 1};
	
	pos = -dot(pos, norm)/Math.sqrt(dot(norm, norm));
	
	var cur_pos = planeproj(canvas_x, canvas_y, perspective, norm, pos);
	var theta = Math.atan2(cur_pos.y-obj_pos.y, cur_pos.x-obj_pos.x) - orig_pos;
	
	current_transform = {
						forwards: createRotPointZ(obj_pos.x, obj_pos.y, obj_pos.z, theta),
						reverse: createRotPointZ(obj_pos.x, obj_pos.y, obj_pos.z, -theta)
						};
};

var orig_axis;
var screenrot_begin = function(canvas_x, canvas_y) {
	var pos = [	0, 0, 0, 1,
				0, 0, 0, 0,
				0, 0, 0, 0,
				0, 0, 0, 0];
	pos = mult(pos, mult(objects[current_object].matrix.forwards, perspective));
	pos = {x: pos[0]/pos[3], y: pos[1]/pos[3]};
	pos.x /= aspect;
	
	var obj_pos = pos;
	
	orig_pos = {x: ((canvas_x*2/canvas.width)-1)/aspect, y: -((canvas_y*2/canvas.height)-1)};
	orig_pos = Math.atan2(orig_pos.y-obj_pos.y, -(orig_pos.x-obj_pos.x));
	
	var ocx = (obj_pos.x*aspect + 1)*canvas.width/2;
	var ocy = (-obj_pos.y + 1)*canvas.height/2;
	//console.log(ocx, ocy);
	orig_axis = vadd(planeproj(ocx, ocy, perspective, camdir, 0), vscale(planeproj(ocx, ocy, perspective, camdir, 1), -1));
	
	screenrot_update(canvas_x, canvas_y);
};
var screenrot_update = function(canvas_x, canvas_y) {
	var pos = [	0, 0, 0, 1,
				0, 0, 0, 0,
				0, 0, 0, 0,
				0, 0, 0, 0];
	pos = mult(pos, mult(objects[current_object].matrix.forwards, perspective));
	pos = {x: pos[0]/pos[3], y: pos[1]/pos[3]};
	pos.x /= aspect;
	
	var obj_pos = pos;
	
	var cur_pos = {x: ((canvas_x*2/canvas.width)-1)/aspect, y: -((canvas_y*2/canvas.height)-1)};
	cur_pos = Math.atan2(cur_pos.y-obj_pos.y, -(cur_pos.x-obj_pos.x));
	var theta = orig_pos-cur_pos;
	
	pos = mult([	0, 0, 0, 1,
					0, 0, 0, 0,
					0, 0, 0, 0,
					0, 0, 0, 0
				], objects[current_object].matrix.forwards);
	pos = {x: pos[0], y: pos[1], z: pos[2]};
	obj_pos = pos;
	
	//current_transform = {forwards:identity(), reverse:identity()};
	current_transform = {
						forwards: createRotPointAxis(obj_pos.x, obj_pos.y, obj_pos.z, theta, orig_axis),
						reverse: createRotPointAxis(obj_pos.x, obj_pos.y, obj_pos.z, -theta, orig_axis)
						};
};

var tumble_begin = function(canvas_x, canvas_y) {
	var pos = [	0, 0, 0, 1,
				0, 0, 0, 0,
				0, 0, 0, 0,
				0, 0, 0, 0];
	pos = mult(pos, mult(objects[current_object].matrix.forwards, perspective));
	pos = {x: pos[0]/pos[3], y: pos[1]/pos[3]};
	pos.x /= aspect;
	
	var obj_pos = pos;
	
	orig_pos = {x: ((canvas_x*2/canvas.width)-1)/aspect, y: -((canvas_y*2/canvas.height)-1)};
	current_transform = {forwards: identity(), reverse: identity()};
	tumble_update(canvas_x, canvas_y);
};
var tumble_update = function(canvas_x, canvas_y) {
	var pos = [	0, 0, 0, 1,
				0, 0, 0, 0,
				0, 0, 0, 0,
				0, 0, 0, 0];
	pos = mult(pos, mult(objects[current_object].matrix.forwards, perspective));
	pos = {x: pos[0]/pos[3], y: pos[1]/pos[3]};
	pos.x /= aspect;
	
	var obj_pos = pos;
	
	var cur_pos = {x: ((canvas_x*2/canvas.width)-1)/aspect, y: -((canvas_y*2/canvas.height)-1)};
	var dist = Math.sqrt(	(cur_pos.x-orig_pos.x)*(cur_pos.x-orig_pos.x) +
							(cur_pos.y-orig_pos.y)*(cur_pos.y-orig_pos.y));
	var fudge = Math.PI;
	
	pos = mult([	0, 0, 0, 1,
					0, 0, 0, 0,
					0, 0, 0, 0,
					0, 0, 0, 0
				], objects[current_object].matrix.forwards);
	pos = {x: pos[0], y: pos[1], z: pos[2]};
	obj_pos = pos;
	
	var norm = camdir;
	pos = -dot(pos, norm)/Math.sqrt(dot(norm, norm));
	var cur_pos3 = planeproj(canvas_x, canvas_y, perspective, norm, pos);
	var orig_pos3 = planeproj(((orig_pos.x*aspect)+1)*canvas.width/2, (-orig_pos.y+1)*canvas.height/2, perspective, norm, pos);
	
	axis = vadd(cur_pos3, vscale(orig_pos3, -1));
	axis = cross(norm, axis);
	
	//current_transform = {forwards:identity(), reverse:identity()};
	current_transform = {
						forwards: mult(current_transform.forwards, createRotPointAxis(obj_pos.x, obj_pos.y, obj_pos.z, dist*fudge, axis)),
						reverse: mult(createRotPointAxis(obj_pos.x, obj_pos.y, obj_pos.z, -dist*fudge, axis), current_transform.reverse)
						};
	//console.log(current_transform);
	orig_pos = {x: ((canvas_x*2/canvas.width)-1)/aspect, y: -((canvas_y*2/canvas.height)-1)};
};



setmode("transscreen");

var assetsjs = document.createElement('script');
assetsjs.type = 'text/javascript';
assetsjs.src = "assets.js";

document.getElementsByTagName('head')[0].appendChild(assetsjs);