//Colin Peter cypeter@ucsc.edu
//5/12/15
//Prog 3
//Creates multiple manipulable sharks

precision mediump float;

uniform mat4 transform;
uniform mat4 ptransform;
uniform mat4 normal_transform;

attribute vec3 vPosition;
attribute vec3 vNormal;

varying vec3 normal;
varying vec4 worldpos;

void main() {
	worldpos = transform*vec4(vPosition, 1.0);// + vec4(side*vNormal*foobar, 0.0));
	normal = mat3(normal_transform)*vNormal;
	
	gl_Position = ptransform*worldpos;
}