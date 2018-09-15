precision mediump float;
#define maxPos 10

uniform sampler2D sampler;
uniform int textured;
uniform sampler2D mapSampler;
uniform int mapped;

varying vec4 v_position2;
varying vec3 v_normal;

varying vec4 v_color;
varying vec2 v_texCoord;
varying float v_ambient;
varying float v_diffuse;
varying float v_specular;
varying float v_shininess;
varying mat3 v_tbnMatrix;

varying vec3 lightPositionsT[maxPos];
varying float intensity[maxPos];

void main(void) {
    vec4 raw_color;
    vec3 normal;
    float diffuseSum;
    float specularSum;
    vec3 tangentLightDir;
    vec3 tangentEyeDir;

    if (textured == 1) {
        raw_color = texture2D(sampler, v_texCoord);
    } else {
        raw_color = v_color;
    }

    vec3 base_color = raw_color.xyz;

    //ambient
    vec3 color = v_ambient * base_color;


    if(mapped == 1) {
        normal = normalize(2.0 * (texture2D(mapSampler, v_texCoord).rgb - 0.5));
    } else {
        normal = normalize(v_normal);
    }

    vec3 viewDirection = normalize(-v_position2.xyz);

    for(int i = 0; i < maxPos; i++) {
        // diffuse
        vec3 lightDirection = normalize(lightPositionsT[i] - v_position2.xyz);
        if (mapped == 1) {}
        tangentLightDir = lightDirection * v_tbnMatrix;
        tangentEyeDir = viewDirection * v_tbnMatrix;
        vec3 lightDir = normalize(tangentLightDir);
        vec3 eyeDir = normalize(tangentEyeDir);
        float lj = intensity[i] / length(lightPositionsT[i] - v_position2.xyz);
        diffuseSum += lj * max(dot(lightDir, normal), 0.0);
        // specular
        vec3 reflectDirection = reflect(-lightDir,normal);
        float specAngle = max(dot(reflectDirection, eyeDir),0.0);
        float specPow = pow(specAngle, v_shininess);
        specularSum += lj * specPow;
    }

   // diffuse
    float diffuseLambertian = v_diffuse * diffuseSum;
    vec3 diffuseColor = diffuseLambertian * base_color;
    color += diffuseColor;

    // specular
    float specularLambertian = v_specular * specularSum;
    vec3 specularColor =  specularLambertian * base_color;
    color += specularColor;

    gl_FragColor = vec4(color, raw_color.w);
}
