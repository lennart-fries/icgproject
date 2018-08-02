precision mediump float;

varying vec4 v_color;
varying vec3 v_normal;
varying vec4 v_position2;

const vec3 lightPos = vec3(0.2,-1.0,-1.0);
const vec3 cameraPos = vec3(0.0,0.0,0.0);

const float coefficientAmbient = .6;
const float coefficientDiffuse = 1.2;
const float coefficientSpecular = 1.5;
const float shininess = 4.0;

void main(void) {
	vec3 normal = normalize(v_normal);
	
	//ambient
    vec3 color = coefficientAmbient* v_color.xyz;
    
    // diffuse
    vec3 lightDir = normalize(lightPos - v_position2.xyz);
    float lambertian = coefficientDiffuse * max(dot(lightDir, normal),0.0);
    vec3 diffuseColor = lambertian * v_color.xyz;
    color +=  diffuseColor;
	
	//specular
	vec3 viewDir = normalize(-v_position2.xyz);
	vec3 reflectDir = reflect(-lightDir,normal);
	float specAngle = max(dot(reflectDir, viewDir),0.0);
    float specular = coefficientSpecular * pow(specAngle, shininess);
    vec3 specularVector =  specular * v_color.xyz;
	color += specularVector;
 
   gl_FragColor = vec4(color, 1.0);
}