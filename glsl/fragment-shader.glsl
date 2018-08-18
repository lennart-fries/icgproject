precision mediump float;

varying vec3 v_normal;
varying vec4 v_color;
varying vec2 v_texCoord;
varying vec4 v_position2;

uniform sampler2D sampler;
uniform int textured;

const vec3 lightPos = vec3(0.2,-1.0,-1.0);
const vec3 cameraPos = vec3(0.0,0.0,0.0);

const float coefficientAmbient = .6;
const float coefficientDiffuse = 1.2;
const float coefficientSpecular = 1.5;
const float shininess = 4.0;

void main(void) {
    vec4 raw_color;
    
    if (textured == 1) {
        raw_color = texture2D(sampler, v_texCoord);
    } else {
        raw_color = v_color;
    }

    vec3 base_color = raw_color.xyz;

    //ambient
    vec3 color = coefficientAmbient * base_color;

    vec3 normal = normalize(v_normal);
    vec3 lightDir = normalize(lightPos - v_position2.xyz);

    // diffuse
    float lambertian = coefficientDiffuse * max(dot(lightDir, normal), 0.0);
    vec3 diffuseColor = lambertian * base_color;
    color += diffuseColor;

    //specular
    vec3 viewDir = normalize(-v_position2.xyz);
    vec3 reflectDir = reflect(-lightDir,normal);
    float specAngle = max(dot(reflectDir, viewDir),0.0);
    float specular = coefficientSpecular * pow(specAngle, shininess);
    vec3 specularVector =  specular * base_color;
    color += specularVector;

    gl_FragColor = vec4(color, raw_color.w);
}
