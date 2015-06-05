//Colin Peter cypeter@ucsc.edu
//5/12/15
//Prog 3
//Creates multiple manipulable sharks

precision mediump float;

attribute vec2 vPosition;

void main() {
	gl_Position = vec4(vPosition, 0.0, 1.0);
}