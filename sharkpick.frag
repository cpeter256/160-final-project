//Colin Peter cypeter@ucsc.edu
//Nikita Sokolnikov nsokolni@ucsc.edu
//6/6/15
//Final Project
//Implements shadow volumes and a mirror
precision mediump float;

uniform int pickid;

void main() {
	float kluge = float(pickid)/255.0;
	gl_FragColor = vec4(kluge, kluge, kluge, 1.0);
}