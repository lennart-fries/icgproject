precision mediump float;
#define maxPos 10

varying vec3 v_normal;
varying vec4 v_color;
varying vec2 v_texCoord;
varying vec4 v_position2;

varying vec3 lightPositionsT[maxPos];
varying float intensity[maxPos];

uniform sampler2D sampler;
uniform int textured;

uniform int lightPosCount;

const float coefficientAmbient = 0.3;
const float coefficientDiffuse = 0.6;
const float coefficientSpecular = 1.5;
const float shininess = 4.0;

void main(void) {
    vec4 raw_color;
    float diffuseSum;
    float specularSum;


    if (textured == 1) {
        raw_color = texture2D(sampler, v_texCoord);
    } else {
        raw_color = v_color;
    }

    vec3 base_color = raw_color.xyz;

    //ambient
    vec3 color = coefficientAmbient * base_color;

    vec3 normal = normalize(v_normal);
    vec3 viewDirection = normalize(-v_position2.xyz);

    //vec3 lightDirection;

    for(int i = 0; i < maxPos; i++) {
        vec3 lightDirection = normalize(lightPositionsT[i] - v_position2.xyz);
        float lj = length(lightPositionsT[i].xyz - v_position2.xyz) * intensity[i];
        vec3 reflectDirection = reflect(-lightDirection,normal);
        float specAngle = max(dot(reflectDirection, viewDirection),0.0);
        float specPow = pow(specAngle, shininess);
        diffuseSum += lj * max(dot(lightDirection, normal), 0.0);
        specularSum += lj * specPow;
    }

   // diffuse
    float diffuseLambertian = coefficientDiffuse * diffuseSum;
    vec3 diffuseColor = diffuseLambertian * base_color;
    color += diffuseColor;

    // specular
    float specularLambertian = coefficientSpecular * specularSum;
    vec3 specularColor =  specularLambertian * base_color;
    color += specularColor;

    //gl_FragColor = vec4(lightDirection, raw_color.w);
    gl_FragColor = vec4(color, raw_color.w);
}
