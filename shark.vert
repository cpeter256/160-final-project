//Colin Peter cypeter@ucsc.edu
//5/12/15
//Prog 3
//Creates multiple manipulable sharks

precision mediump float;

uniform mat4 transform;
uniform mat4 normal_transform;

attribute vec3 vPosition;
attribute vec3 vNormal;

varying vec3 normal;

void main() {
	gl_Position = transform*vec4(vPosition.xyz, 1.0);
	normal = mat3(normal_transform)*vNormal;
}