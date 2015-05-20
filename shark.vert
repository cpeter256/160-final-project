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
	vec3 light = normalize(vec3(-1.0, 1.0, 1.0));
	vec3 tNormal = mat3(normal_transform)*vNormal;
	vec4 tPosition = normal_transform*vec4(vPosition.xyz, 1.0);
	vec3 line_dir = normalize(
						vec3(normal_transform*vec4(vPosition, 0.0)) - vec3(-1.0,10.0,10.0));
	
	mat4 scale = mat4(vec4(1.0, 0.0, 0.0, 0.0), 
					vec4(0.0, 1.0, 0.0, 0.0), 
					vec4(0.0, 0.0, 1.0, 0.0),
					vec4(1.5, 1.5, 1.5, 1.0));
	if(normalize(normalize(dot(tNormal, light)) +
	 normalize(dot(tPosition, vec4(vNormal, 0.0)))) < 0.0){
		gl_Position = transform*(vec4(vPosition.xyz, 1.0));
		normal = vec3(-1.0, 1.0, 1.0);

	} else {
		gl_Position = transform*vec4(vPosition.xyz, 1.0);
		normal = mat3(normal_transform)*vNormal;
	}

}