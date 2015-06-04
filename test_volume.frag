//Colin Peter cypeter@ucsc.edu
//5/12/15
//Prog 3
//Creates multiple manipulable sharks

precision mediump float;

varying vec3 normal;

void main() {
	vec3 light = normalize(vec3(1.0, 1.0, 1.0));
	float lum = dot(normalize(normal), light);
	
	gl_FragColor = vec4(vec3(1.0, 1.0, 0.0), 1.0);
}