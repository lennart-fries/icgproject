#define maxPos 10

attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec4 a_color;
attribute vec2 a_texCoord;
attribute float a_ambient;
attribute float a_diffuse;
attribute float a_specular;
attribute float a_shininess;

uniform mat4 M; // model
uniform mat4 V; // view
uniform mat4 P; // perspective
uniform mat4 N; // normal matrix

uniform vec4 lightPositions[maxPos];

varying vec3 v_normal;
varying vec4 v_color;
varying vec2 v_texCoord;
varying vec4 v_position2;
varying float v_ambient;
varying float v_diffuse;
varying float v_specular;
varying float v_shininess;

varying vec3 lightPositionsT[maxPos];
varying float intensity[maxPos];

void main() {
    v_position2 = V * M * vec4(a_position, 1.0);
    gl_Position = P * v_position2;
    v_color = a_color;
    v_texCoord = a_texCoord;
    v_ambient = a_ambient;
    v_diffuse = a_diffuse;
    v_specular = a_specular;
    v_shininess = a_shininess;
    v_normal = (N * vec4(a_normal, 0)).xyz;
    for (int i = 0; i < maxPos; i++) {
        lightPositionsT[i] = (V * vec4(lightPositions[i].xyz, 1.0)).xyz;
        intensity[i] = lightPositions[i].w;
    }
}
