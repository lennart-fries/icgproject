attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec4 a_color;
attribute vec2 a_texCoord;
varying vec2 v_texCoord;

uniform mat4 M; // model
uniform mat4 V; // view
uniform mat4 P; // perspective
uniform mat4 N; // normal matrix

varying vec3 v_normal;
varying vec4 v_color;
varying vec4 v_position2;

void main() {
    gl_Position = P * V * M * vec4(a_position, 1.0);
    v_position2 = V * M * vec4(a_position, 1.0);
    v_color = a_color;
    v_texCoord = a_texCoord;
    v_normal = (N * vec4(a_normal, 0)).xyz;
}

