#define maxPos 10

attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec4 a_color;
attribute vec2 a_texCoord;

uniform mat4 M; // model
uniform mat4 V; // view
uniform mat4 P; // perspective
uniform mat4 N; // normal matrix

uniform vec4 lightPositions[maxPos];

varying vec3 v_normal;
varying vec4 v_color;
varying vec2 v_texCoord;
varying vec4 v_position2;

varying vec4 lightPositionsT[maxPos];

void main() {
    v_position2 = V * M * vec4(a_position, 1.0);
    gl_Position = P * v_position2;
    v_color = a_color;
    v_texCoord = a_texCoord;
    v_normal = (N * vec4(a_normal, 0)).xyz;
    for (int i = 0; i < maxPos; i++) {
        lightPositionsT[i] = vec4((V * lightPositions[i]).xyz, lightPositions[i]);
        //lightPositionsT[i] = lightPositions[i];
    }
}
