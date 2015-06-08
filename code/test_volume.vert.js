var vol_vert_src = "\
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
//uniform float foobar;\n\
\n\
uniform vec3 light_pos;\n\
\n\
attribute vec3 vPosition;\n\
attribute vec3 vNormal;\n\
\n\
attribute float side;\n\
\n\
varying vec3 normal;\n\
\n\
void main() {\n\
	gl_Position = transform*vec4(vPosition, 1.0);// + vec4(side*vNormal*foobar, 0.0));\n\
	normal = mat3(normal_transform)*vNormal;\n\
	\n\
	vec3 ldir = normalize(gl_Position.xyz-light_pos);\n\
	/*if (dot(ldir, normal) < 0.0) {\n\
		gl_Position = vec4(0.0, 0.0, 0.0, 0.0);\n\
	} else {*/\n\
		gl_Position -= vec4(light_pos, 0.0);\n\
		gl_Position += normalize(gl_Position)*side*500.0; gl_Position.w = 1.0;\n\
		gl_Position += vec4(light_pos, 0.0);\n\
		gl_Position = ptransform*gl_Position;\n\
	//}\n\
}\n\
";