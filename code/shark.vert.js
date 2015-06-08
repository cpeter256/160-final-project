var shark_vert_src = "\
//Colin Peter cypeter@ucsc.edu\n\
//Nikita Sokolnikov nsokolni@ucsc.edu\n\
//6/6/15\n\
//Final Project\n\
//Implements shadow volumes and a mirror\n\
\n\
precision mediump float;\n\
\n\
uniform mat4 transform;\n\
uniform mat4 ptransform;\n\
uniform mat4 normal_transform;\n\
\n\
attribute vec3 vPosition;\n\
attribute vec3 vNormal;\n\
\n\
varying vec3 normal;\n\
varying vec4 worldpos;\n\
\n\
void main() {\n\
	worldpos = transform*vec4(vPosition, 1.0);// + vec4(side*vNormal*foobar, 0.0));\n\
	normal = mat3(normal_transform)*vNormal;\n\
	\n\
	gl_Position = ptransform*worldpos;\n\
}\n\
";