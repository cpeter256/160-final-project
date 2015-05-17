//Colin Peter cypeter@ucsc.edu
//5/12/15
//Prog 3
//Creates multiple manipulable sharks

//vector/matrix utility functions

//Creates a perspective transformation matrix
function createPerspectiveTransform(x, y, z, pitch, yaw, roll, fov, near, far) {
	var view = new Float32Array(4*4);
	view = identity();
	
	//Translate to position
	view = mult(view,[
					1, 0, 0, 0,
					0, 1, 0, 0,
					0, 0, 1, 0,
					-x, -y, -z, 1]);
	
	//Do yaw rotation
	view = mult(view,[
						Math.cos(yaw), 0, Math.sin(yaw), 0,
						0, 				1, 0, 					0,
						-Math.sin(yaw), 0, Math.cos(yaw), 0,
						0, 				0, 					0, 1]);
	
	//Do pitch rotation
	view = mult(view,[
						1, 0, 				 0, 				0,
						0, Math.cos(pitch), -Math.sin(pitch), 0,
						0, Math.sin(pitch), Math.cos(pitch), 	0,
						0, 0, 				 0, 				1]);
	
	//Do roll rotation
	view = mult(view,[
						Math.cos(roll), Math.sin(roll), 0, 0,
						-Math.sin(roll), Math.cos(roll), 0, 0,
						0, 				0, 				1, 0,
						0,				0,				0, 1]);
	
	//Project that shit
	
	var f = Math.tan((Math.PI-fov)/2);
	var range_inv = 1/(near-far);
	
	view = mult(view,[
						f*aspect, 0, 0, 0,
						0, f, 0, 0,
						0, 0, (near + far)*range_inv, -1,
						0, 0, near*far*2*range_inv, 0]);
	
	return view;
}

//Gets a vector for the direction specified by pitch and yaw
function getCameraDirection(pitch, yaw) {
	var view = new Float32Array(4*4);
	view = identity();
	
	//Do pitch rotation
	view = mult(view,[
						1, 0, 				 0, 				0,
						0, Math.cos(pitch), -Math.sin(pitch), 0,
						0, Math.sin(pitch), Math.cos(pitch), 	0,
						0, 0, 				 0, 				1]);
	
	//Do yaw rotation
	view = mult(view,[
						Math.cos(yaw), 0, Math.sin(yaw), 0,
						0, 				1, 0, 					0,
						-Math.sin(yaw), 0, Math.cos(yaw), 0,
						0, 				0, 					0, 1]);
	
	var vec = [
				0, 0, 1, 1,
				0, 0, 0, 0,
				0, 0, 0, 0,
				0, 0, 0, 0];
	vec = mult(vec, view);
	
	return {x: vec[0], y: vec[1], z: -vec[2]};
}

//Creates an object transformation by accumulating a list of elementary transformations
function createObjectTransform(transforms) {
	var trans = new Float32Array(4*4);
	var inv = new Float32Array(4*4);
	trans = identity();
	inv = identity();
	
	for (var i = 0; i < transforms.length; ++i) {
		var t = transforms[i];
		var component;
		var invcomp;
		switch(t.type) {
			case "t":
				component = [
							1, 0, 0, 0,
							0, 1, 0, 0,
							0, 0, 1, 0,
							t.x, t.y, t.z, 1];
				invcomp = [
							1, 0, 0, 0,
							0, 1, 0, 0,
							0, 0, 1, 0,
							-t.x, -t.y, -t.z, 1];
				break;
			case "rx":
				component = [
							1,	0,				0,				0,
							0,	Math.cos(t.r),	-Math.sin(t.r),	0,
							0,	Math.sin(t.r),	Math.cos(t.r),	0,
							0,	0,				0,				1];
				invcomp = [
							1,	0,				0,				0,
							0,	Math.cos(-t.r),	-Math.sin(-t.r),	0,
							0,	Math.sin(-t.r),	Math.cos(-t.r),	0,
							0,	0,				0,				1];
				break;
			case "ry":
				component = [
							Math.cos(t.r),	0,	Math.sin(t.r),	0,
							0,				1,	0,				0,
							-Math.sin(t.r),	0,	Math.cos(t.r),	0,
							0,	0,				0,				1];
				invcomp = [
							Math.cos(-t.r),	0,	Math.sin(-t.r),	0,
							0,				1,	0,				0,
							-Math.sin(-t.r),0,	Math.cos(-t.r),	0,
							0,	0,			0,					1];
				break;
			case "rz":
				component = [
							Math.cos(t.r),	Math.sin(t.r),	0,	0,
							-Math.sin(t.r),	Math.cos(t.r),	0,	0,
							0,				0,				1,	0,
							0,				0,				0,	1];
				invcomp = [
							Math.cos(-t.r),	Math.sin(-t.r),	0,	0,
							-Math.sin(-t.r),Math.cos(-t.r),	0,	0,
							0,				0,				1,	0,
							0,				0,				0,	1];
				break;
			case "rpx":
				component = createRotPointX(t.x, t.y, t.z, t.r);
				invcomp = createRotPointX(t.x, t.y, t.z, -t.r);
				break;
			case "rpy":
				component = createRotPointY(t.x, t.y, t.z, t.r);
				invcomp = createRotPointY(t.x, t.y, t.z, -t.r);
				break;
			case "rpz":
				component = createRotPointZ(t.x, t.y, t.z, t.r);
				invcomp = createRotPointZ(t.x, t.y, t.z, -t.r);
				break;
			case "s":
				component = [
							t.x, 0, 0, 0,
							0, t.y, 0, 0,
							0, 0, t.z, 0,
							0, 0, 0, 1];
				invcomp = [
							1/t.x, 0, 0, 0,
							0, 1/t.y, 0, 0,
							0, 0, 1/t.z, 0,
							0, 0, 0, 1];
				break;
			default:
				console.log("invalid transform: " + t.type);
				return;
		}
		
		trans = mult(trans, component);
		inv = mult(invcomp, inv);
	}
	
	return {forwards: trans, reverse: inv};
}

//Creates a rotation matrix around a point
function createRotPointX(x, y, z, r) {
	var result = new Float32Array(4*4);
	result = identity();
	result = mult(result, [
							1, 0, 0, 0,
							0, 1, 0, 0,
							0, 0, 1, 0,
							-x, -y, -z, 1]);
	result = mult(result, [
							1,	0,				0,				0,
							0,	Math.cos(r),	-Math.sin(r),	0,
							0,	Math.sin(r),	Math.cos(r),	0,
							0,	0,				0,				1]);
	result = mult(result, [
							1, 0, 0, 0,
							0, 1, 0, 0,
							0, 0, 1, 0,
							x, y, z, 1]);
	return result;
}

function createRotPointY(x, y, z, r) {
	var result = new Float32Array(4*4);
	result = identity();
	result = mult(result, [
							1, 0, 0, 0,
							0, 1, 0, 0,
							0, 0, 1, 0,
							-x, -y, -z, 1]);
	result = mult(result, [
							Math.cos(r),	0,	Math.sin(r),	0,
							0,				1,	0,				0,
							-Math.sin(r),	0,	Math.cos(r),	0,
							0,	0,				0,				1]);
	result = mult(result, [
							1, 0, 0, 0,
							0, 1, 0, 0,
							0, 0, 1, 0,
							x, y, z, 1]);
	return result;
}

function createRotPointZ(x, y, z, r) {
	var result = new Float32Array(4*4);
	result = identity();
	result = mult(result, [
							1, 0, 0, 0,
							0, 1, 0, 0,
							0, 0, 1, 0,
							-x, -y, -z, 1]);
	result = mult(result, [
							Math.cos(r),	Math.sin(r),	0,	0,
							-Math.sin(r),	Math.cos(r),	0,	0,
							0,				0,				1,	0,
							0,				0,				0,	1]);
	result = mult(result, [
							1, 0, 0, 0,
							0, 1, 0, 0,
							0, 0, 1, 0,
							x, y, z, 1]);
	return result;
}

//Creates a rotation matrix around a point and an axis
function createRotPointAxis(x, y, z, r, axis) {
	var result = new Float32Array(4*4);
	result = identity();
	result = mult(result, [
							1, 0, 0, 0,
							0, 1, 0, 0,
							0, 0, 1, 0,
							-x, -y, -z, 1]);
	axis = normalize(axis);
	var ax = axis.x; var ay = axis.y; var az = axis.z;
	var tensor = [	ax*ax, ax*ay, ax*az, 0,
						ax*ay, ay*ay, ay*az, 0,
						ax*az, ay*az, az*az, 0,
						0, 0, 0, 1];
	var crossaxis = [	0, -az, ay, 0,
						az, 0, -ax, 0,
						-ay, ax, 0, 0,
						0, 0, 0, 1];
	var rotmat = add3(add3(	scale3(identity(), Math.cos(r)),
							scale3(crossaxis, Math.sin(r))),
							scale3(tensor, 1-Math.cos(r)));
	
	/*var st = Math.sin(r);
	var ct = Math.cos(r);
	var ict = 1-ct;
	var foo = scale(rotmat, -1);
	
	rotmat = [	ct+ax*ax*ict, ax*ay*ict-az*st, ax*az*ict+ay*st, 0,
				ay*ay*ict+az*st, ct+ay*ay*ict, ay*az*ict-ax*st, 0,
				az*ax*ict-ay*st, az*ay*ict+ax*st, ct+az*az*ict, 0,
				0, 0, 0, 1];*/
	
	//foo = add(foo, rotmat);
	//console.log(foo);
	
	result = mult(result, rotmat);
	result = mult(result, [
							1, 0, 0, 0,
							0, 1, 0, 0,
							0, 0, 1, 0,
							x, y, z, 1]);
	return result;
}

function normalize(v) {
	var mag = Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
	if (mag != 0) {
		v.x /= mag;
		v.y /= mag;
		v.z /= mag;
	}
	return v;
}

function dot(u, v) {
	return u.x*v.x + u.y*v.y + u.z*v.z;
}

function cross(u, v) {
	return {	x: u.y*v.z - u.z*v.y,
				y: u.z*v.x - u.x*v.z,
				z: u.x*v.y - u.y*v.x
	};
}

function vscale(v, c) {
	return {	x: v.x*c,
				y: v.y*c,
				z: v.z*c
	};
}

function vadd(u, v) {
	return {	x: u.x+v.x,
				y: u.y+v.y,
				z: u.z+v.z
	};
}

//Projects a point (in screen space) onto a plane in world space
function planeproj(canvas_x, canvas_y, transform, normal, dist) {
	var near = unproject((canvas_x*2/canvas.width)-1, -1*((canvas_y*2/canvas.height)-1), 0, transform);
	var far = unproject((canvas_x*2/canvas.width)-1, -1*((canvas_y*2/canvas.height)-1), 1, transform);
	var ray = vadd(far, vscale(near, -1));
	//normal = {x: 0, y: 1, z: 0};
	var amount = -(dot(near, normal) + dist) / dot(ray, normal);
	return vadd(near, vscale(ray, amount));
}

//Unprojects a point in clip space to world space
function unproject(x, y, z, transform) {
	var invproj = invert(transform);
	var vecmat = [	x, y, z, 1,
					0, 0, 0, 0,
					0, 0, 0, 0,
					0, 0, 0, 0];
	vecmat = mult(vecmat, invproj);
	var result = {x: vecmat[0], y: vecmat[1], z: vecmat[2], w: vecmat[3]};
	result.w = 1/result.w;
	result.x *= result.w;
	result.y *= result.w;
	result.z *= result.w;
	return result;
}

//This function was taken and adapted from http://blog.acipo.com/matrix-inversion-in-javascript/
//NOT ORIGINAL WORK
// Returns the inverse of matrix `M`.
function invert(M_orig){
	var M = [];
	M.push([M_orig[0], M_orig[1], M_orig[2], M_orig[3]]);
	M.push([M_orig[4], M_orig[5], M_orig[6], M_orig[7]]);
	M.push([M_orig[8], M_orig[9], M_orig[10], M_orig[11]]);
	M.push([M_orig[12], M_orig[13], M_orig[14], M_orig[15]]);
	
    // I use Guassian Elimination to calculate the inverse:
    // (1) 'augment' the matrix (left) by the identity (on the right)
    // (2) Turn the matrix on the left into the identity by elemetry row ops
    // (3) The matrix on the right is the inverse (was the identity matrix)
    // There are 3 elemtary row ops: (I combine b and c in my code)
    // (a) Swap 2 rows
    // (b) Multiply a row by a scalar
    // (c) Add 2 rows
    
    //if the matrix isn't square: exit (error)
    if(M.length !== M[0].length){return;}
	
    //create the identity matrix (I), and a copy (C) of the original
    var i=0, ii=0, j=0, dim=M.length, e=0, t=0;
    var I = [], C = [];
    for(i=0; i<dim; i+=1){
        // Create the row
        I[I.length]=[];
        C[C.length]=[];
        for(j=0; j<dim; j+=1){
            
            //if we're on the diagonal, put a 1 (for identity)
            if(i==j){ I[i][j] = 1; }
            else{ I[i][j] = 0; }
            
            // Also, make the copy of the original
            C[i][j] = M[i][j];
        }
    }
    
    // Perform elementary row operations
    for(i=0; i<dim; i+=1){
        // get the element e on the diagonal
        e = C[i][i];
        
        // if we have a 0 on the diagonal (we'll need to swap with a lower row)
        if(e==0){
            //look through every row below the i'th row
            for(ii=i+1; ii<dim; ii+=1){
                //if the ii'th row has a non-0 in the i'th col
                if(C[ii][i] != 0){
                    //it would make the diagonal have a non-0 so swap it
                    for(j=0; j<dim; j++){
                        e = C[i][j];       //temp store i'th row
                        C[i][j] = C[ii][j];//replace i'th row by ii'th
                        C[ii][j] = e;      //repace ii'th by temp
                        e = I[i][j];       //temp store i'th row
                        I[i][j] = I[ii][j];//replace i'th row by ii'th
                        I[ii][j] = e;      //repace ii'th by temp
                    }
                    //don't bother checking other rows since we've swapped
                    break;
                }
            }
            //get the new diagonal
            e = C[i][i];
            //if it's still 0, not invertable (error)
            if(e==0){return}
        }
        
        // Scale this row down by e (so we have a 1 on the diagonal)
        for(j=0; j<dim; j++){
            C[i][j] = C[i][j]/e; //apply to original matrix
            I[i][j] = I[i][j]/e; //apply to identity
        }
        
        // Subtract this row (scaled appropriately for each row) from ALL of
        // the other rows so that there will be 0's in this column in the
        // rows above and below this one
        for(ii=0; ii<dim; ii++){
            // Only apply to other rows (we want a 1 on the diagonal)
            if(ii==i){continue;}
            
            // We want to change this element to 0
            e = C[ii][i];
            
            // Subtract (the row above(or below) scaled by e) from (the
            // current row) but start at the i'th column and assume all the
            // stuff left of diagonal is 0 (which it should be if we made this
            // algorithm correctly)
            for(j=0; j<dim; j++){
                C[ii][j] -= e*C[i][j]; //apply to original matrix
                I[ii][j] -= e*I[i][j]; //apply to identity
            }
        }
    }
    
    //we've done all operations, C should be the identity
    //matrix I should be the inverse:
	var I_flat = [];
	for (var y = 0; y < 4; y++) {
		for (var x = 0; x < 4; x++) {
			I_flat.push(I[y][x]);
		}
	}
    return I_flat;
}

//generates a 4x4 identity matrix
function identity() {
	return [1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1];
}

//Scales a 4x4 matrix
function scale(A, C) {
	var R = new Float32Array(16);
	for (var i = 0; i < 16; ++i) {
		R[i] = A[i] * C;
	}
	return R;
}

//Scales the top-left 3x3 portion of a 4x4 matrix
function scale3(A, C) {
	var R = new Float32Array(16);
	for (var i = 0; i < 16; ++i) {
		if (i < 12 && i%4 != 3) {
			R[i] = A[i] * C;
		} else {
			R[i] = A[i];
		}
	}
	return R;
}

//Adds 2 4x4 matrices
function add(A, B) {
	var result = new Float32Array(16);
	for (var i = 0; i < 16; ++i) {
		result[i] = A[i] + B[i];
	}
	return result;
}

//Adds the top-left 3x3 portion of 4x4 matrices
function add3(A, B) {
	var R = new Float32Array(16);
	for (var i = 0; i < 16; ++i) {
		if (i < 12 && i%4 != 3) {
			R[i] = A[i] +B[i];
		} else {
			R[i] = A[i];
		}
	}
	return R;
}

//Multiplies 2 4x4 matrices
function mult(A, B) {
	var result = [];
	for (var r = 0; r < 4; r++) {
		for (var c = 0; c < 4; c++) {
			var e = 0;
			for (var i = 0; i < 4; i++) {
				e += A[r*4 + i] * B[i*4 + c];
			}
			result.push(e);
		}
	}
	return result;
}

//Computes the transpose of a matrix
function transpose(A) {
	var R = new Float32Array(16);
	for (var x = 0; x < 4; ++x) {
		for (var y = 0; y < 4; ++y) {
			R[x*4 + y] = A[y*4 + x];
		}
	}
	return R;
}


var modesjs = document.createElement('script');
modesjs.type = 'text/javascript';
modesjs.src = "modes.js";

document.getElementsByTagName('head')[0].appendChild(modesjs);