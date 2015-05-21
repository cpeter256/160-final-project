//Colin Peter cypeter@ucsc.edu
//5/12/15
//Prog 3
//Creates multiple manipulable sharks

precision mediump float;

uniform mat4 transform;
uniform mat4 ptransform;
uniform mat4 normal_transform;

//uniform float foobar;

uniform vec3 light_pos;

attribute vec3 vPosition;
attribute vec3 vNormal;

attribute float side;

varying vec3 normal;

void main() {
	gl_Position = transform*vec4(vPosition, 1.0);// + vec4(side*vNormal*foobar, 0.0));
	normal = mat3(normal_transform)*vNormal;
	
	vec3 ldir = normalize(gl_Position.xyz-light_pos);
	if (dot(ldir, normal) < 0.0) {
		gl_Position = vec4(0.0, 0.0, 0.0, 0.0);
	} else {
		gl_Position -= vec4(light_pos, 0.0);
		gl_Position += normalize(gl_Position)*side*100.0; gl_Position.w = 1.0;
		gl_Position += vec4(light_pos, 0.0);
		gl_Position = ptransform*gl_Position;
	}
}