//Colin Peter cypeter@ucsc.edu
//Nikita Sokolnikov nsokolni@ucsc.edu
//6/6/15
//Final Project
//Implements shadow volumes and a mirror

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