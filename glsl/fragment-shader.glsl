precision mediump float;
#define maxPos 10

varying vec3 v_normal;
varying vec4 v_color;
varying vec2 v_texCoord;
varying vec4 v_position2;

uniform sampler2D sampler;
uniform int textured;

uniform vec4 lightPositions[maxPos];
uniform int lightPosCount;

const float coefficientAmbient = .6;
const float coefficientDiffuse = 1.2;
const float coefficientSpecular = 1.5;
const float shininess = 4.0;

void main(void) {
    vec4 raw_color;
    float LightPosDiffuse;
    float LightPosSpecular;


    if (textured == 1) {
        raw_color = texture2D(sampler, v_texCoord);
    } else {
        raw_color = v_color;
    }

    vec3 base_color = raw_color.xyz;

    //ambient
    vec3 color = coefficientAmbient * base_color;

    vec3 normal = normalize(v_normal);
    vec3 viewDir = normalize(-v_position2.xyz);

    float ljdebug;
    vec3 lightDirdebug;

    for(int i = 0; i < 1; i++) {
        vec3 lightDir = normalize(lightPositions[i].xyz - v_position2.xyz);
        float lj = length(lightPositions[i].xyz - v_position2.xyz) * lightPositions[i].w;
        vec3 reflectDir = reflect(-lightDir,normal);
        float specAngle = max(dot(reflectDir, viewDir),0.0);
        float specPow = pow(specAngle, shininess);
        LightPosDiffuse += lj * max(dot(lightDir, normal), 0.0);
        LightPosSpecular += lj * specPow;
        ljdebug = lj;
        lightDirdebug = lightDir;
    }

   // diffuse
    float lambertian = coefficientDiffuse * LightPosDiffuse;
    vec3 diffuseColor = lambertian * base_color;
    color += diffuseColor;

    //specular
    float specular = coefficientSpecular * LightPosSpecular;
    vec3 specularVector =  specular * base_color;
    color += specularVector;

    gl_FragColor = vec4(color, raw_color.w);
    gl_FragColor = vec4(normal, 1);
}