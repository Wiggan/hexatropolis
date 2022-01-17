#version 300 es
precision mediump float;

#define numLights 4

struct PointLight {
    vec3 position;
    
    float constant;
    float linear;
    float quadratic;  

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

uniform vec3 uCameraPos;
uniform bool uDebug;
uniform PointLight uLight[numLights];
uniform vec3 uMaterialAmbient;
uniform vec3 uMaterialDiffuse;
uniform vec3 uMaterialSpecular;
uniform float uMaterialShininess;

in vec3 vFragPos;
in vec3 vNormal;

layout(location = 0) out vec4 fragColor;
layout(location = 1) out vec4 brightColor;

vec3 CalcPointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir)
{
    vec3 lightDir = normalize(light.position - fragPos);
    // diffuse shading
    float diff = max(dot(normal, lightDir), 0.0);
    // specular shading
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), uMaterialShininess);
    // attenuation
    float distance    = length(light.position - fragPos);
    float attenuation = 1.0 / (light.constant + light.linear * distance + 
  			     light.quadratic * (distance * distance));    
    // combine results
    vec3 ambient  = light.ambient  * uMaterialAmbient;
    vec3 diffuse  = light.diffuse  * diff * uMaterialDiffuse;
    vec3 specular = light.specular * spec * uMaterialSpecular;
    ambient  *= attenuation;
    diffuse  *= attenuation;
    specular *= attenuation;
    return (ambient + diffuse + specular);
} 


void main() {
    if (uDebug){
        fragColor = vec4(1.0, 0.0, 1.0, 1.0);
        brightColor = fragColor;
    } else {
        // properties
        vec3 norm = normalize(vNormal);
        vec3 viewDir = normalize(uCameraPos - vFragPos);

        vec3 result = vec3(0); 
        // phase 2: Point lights
        for(int i = 0; i < numLights; i++)
            result += CalcPointLight(uLight[i], norm, vFragPos, viewDir);
        
        fragColor = vec4(result, 1.0);
        brightColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}

//void main(void) {
//    if (uDebug){
//        fragColor = vec4(1.0, 0.0, 1.0, 1.0);
//        brightColor = fragColor;
//    } else {
//        // Ambient
//        vec4 Ia = uLightAmbient * uMaterialAmbient;
//        // Diffuse
//        vec4 Id = vec4(0.0, 0.0, 0.0, 1.0);
//        // Specular
//        vec4 Is = vec4(0.0, 0.0, 0.0, 1.0);
//        // Normalized normal
//        vec3 N = normalize(vNormal);
//        for (int i = 0; i < numLights; i++) {
//            vec3 L = normalize(vLightRay[i]);
//            float lambertTerm = dot(N, -L);
//
//            if (lambertTerm > 0.0) {
//                Id += uLight[i].diffuse * uMaterialDiffuse * lambertTerm;
//                vec3 E = normalize(vEyeVector);
//                vec3 R = reflect(L, N);
//                float specular = pow( max(dot(R, E), 0.0), uShininess);
//                Is += uLight[i].specular * uMaterialSpecular * specular;
//            }
//        }
//
//        // Final fargment color takes into account all light values that
//        // were computed within the fragment shader
//        fragColor = vec4(vec3(Ia + Id + Is), 1.0);
//        float brightness = dot(fragColor.rgb, vec3(0.2, 0.7, 0.07));
//        if (brightness > 0.9) {
//            brightColor = fragColor;
//        } else {
//            brightColor = vec4(0.0, 0.0, 0.0, 1.0);
//        }
//    }
//}