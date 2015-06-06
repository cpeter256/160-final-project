//Colin Peter cypeter@ucsc.edu
//Nikita Sokolnikov nsokolni@ucsc.edu
//6/6/15
//Final Project
//Implements shadow volumes and a mirror

precision mediump float;

attribute vec2 vPosition;

void main() {
	gl_Position = vec4(vPosition, 0.0, 1.0);
}