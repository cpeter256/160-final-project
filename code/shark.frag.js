var shark_frag_src = "\
//Colin Peter cypeter@ucsc.edu\n\
//Nikita Sokolnikov nsokolni@ucsc.edu\n\
//6/6/15\n\
//Final Project\n\
//Implements shadow volumes and a mirror\n\
\n\
//unsupported and sad\n\
//#extension GL_EXT_draw_buffers : require\n\
\n\
precision mediump float;\n\
\n\
uniform vec4 campos;\n\
uniform vec4 plane;\n\
uniform vec3 shark_color;\n\
\n\
varying vec3 normal;\n\
varying vec4 worldpos;\n\
\n\
void main() {\n\
	if (dot(worldpos.xyz, plane.xyz) < plane.w) discard;\n\
	\n\
	vec3 light = normalize(vec3(1.2, 1.0, .9));\n\
	float lum = dot(normalize(normal), light);\n\
	lum = max(lum, 0.0);\n\
	vec3 reflection = reflect(-light, normalize(normal));\n\
	\n\
	vec3 vdir = normalize(campos - worldpos).xyz;\n\
	\n\
	float specular = max(dot(reflection, vdir), 0.0);\n\
	specular = pow(specular, 8.0);\n\
	specular = max(specular, 0.0);\n\
	\n\
	float ambient = 0.25;\n\
	\n\
//	vec3 shark_color = vec3(0.5, 0.5, .75);\n\
	\n\
	//lum = 0.0;\n\
	\n\
	gl_FragColor = vec4(shark_color*(lum+specular+ambient), 1.0);\n\
}\n\
";