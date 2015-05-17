//Colin Peter cypeter@ucsc.edu
//5/12/15
//Prog 3
//Creates multiple manipulable sharks
precision mediump float;

uniform int pickid;

void main() {
	float kluge = float(pickid)/255.0;
	gl_FragColor = vec4(kluge, kluge, kluge, 1.0);
}