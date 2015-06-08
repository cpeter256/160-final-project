var dark_vert_src = "\
//Colin Peter cypeter@ucsc.edu\n\
//Nikita Sokolnikov nsokolni@ucsc.edu\n\
//6/6/15\n\
//Final Project\n\
//Implements shadow volumes and a mirror\n\
\n\
precision mediump float;\n\
\n\
attribute vec2 vPosition;\n\
\n\
void main() {\n\
	gl_Position = vec4(vPosition, 0.0, 1.0);\n\
}\n\
";