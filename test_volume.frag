//Colin Peter cypeter@ucsc.edu
//Nikita Sokolnikov nsokolni@ucsc.edu
//6/6/15
//Final Project
//Implements shadow volumes and a mirror

precision mediump float;

varying vec3 normal;

void main() {
	vec3 light = normalize(vec3(1.0, 1.0, 1.0));
	float lum = dot(normalize(normal), light);
	
	gl_FragColor = vec4(vec3(1.0, 1.0, 0.0), 1.0);
}