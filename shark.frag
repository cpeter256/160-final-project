//Colin Peter cypeter@ucsc.edu
//5/12/15
//Prog 3
//Creates multiple manipulable sharks

//unsupported and sad
//#extension GL_EXT_draw_buffers : require

precision mediump float;

varying vec3 normal;

//Note: since this is a headlight, the view vector is the same as the light vector
//This means the half-angle is also the same as the light angle

void main() {
	vec3 light = normalize(vec3(1.0, 1.0, 1.0));
	float lum = dot(normalize(normal), light);
	vec3 reflection = reflect(-light, normalize(normal));
	float specular = max(dot(reflection, light), 0.0);
	specular = pow(specular, 8.0);
	
	vec3 shark_color = vec3(0.5, 0.5, .75);
	
	gl_FragColor = vec4(shark_color*(lum+specular), 1.0);
}