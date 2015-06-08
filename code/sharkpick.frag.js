var sharkpick_frag_src = "\
//Colin Peter cypeter@ucsc.edu\n\
//Nikita Sokolnikov nsokolni@ucsc.edu\n\
//6/6/15\n\
//Final Project\n\
//Implements shadow volumes and a mirror\n\
precision mediump float;\n\
\n\
uniform int pickid;\n\
\n\
void main() {\n\
	float kluge = float(pickid)/255.0;\n\
	gl_FragColor = vec4(kluge, kluge, kluge, 1.0);\n\
}\n\
";