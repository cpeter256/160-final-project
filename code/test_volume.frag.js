var vol_frag_src = "\
//Colin Peter cypeter@ucsc.edu\n\
//Nikita Sokolnikov nsokolni@ucsc.edu\n\
//6/6/15\n\
//Final Project\n\
//Implements shadow volumes and a mirror\n\
\n\
precision mediump float;\n\
\n\
varying vec3 normal;\n\
\n\
void main() {\n\
	vec3 light = normalize(vec3(1.0, 1.0, 1.0));\n\
	float lum = dot(normalize(normal), light);\n\
	\n\
	gl_FragColor = vec4(vec3(1.0, 1.0, 0.0), 1.0);\n\
}\n\
";