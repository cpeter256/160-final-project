//Colin Peter cypeter@ucsc.edu
//Nikita Sokolnikov nsokolni@ucsc.edu
//6/6/15
//Final Project
//Implements shadow volumes and a mirror

//unsupported and sad
//#extension GL_EXT_draw_buffers : require

precision mediump float;

uniform vec4 campos;
uniform vec4 plane;

varying vec3 normal;
varying vec4 worldpos;

void main() {
	if (dot(worldpos.xyz, plane.xyz) < plane.w) discard;
	
	vec3 light = normalize(vec3(1.2, 1.0, .9));
	float lum = dot(normalize(normal), light);
	lum = max(lum, 0.0);
	vec3 reflection = reflect(-light, normalize(normal));
	
	vec3 vdir = normalize(campos - worldpos).xyz;
	
	float specular = max(dot(reflection, vdir), 0.0);
	specular = pow(specular, 8.0);
	specular = max(specular, 0.0);
	
	float ambient = 0.25;
	
	vec3 shark_color = vec3(0.5, 0.5, .75);
	
	//lum = 0.0;
	
	gl_FragColor = vec4(shark_color*(lum+specular+ambient), 1.0);
}