#version 300 es
precision mediump float;

struct Light {
    vec3 position;
    vec4 diffuse;
    vec4 specular;
};

uniform bool uDebug;
uniform float uShininess;
uniform vec4 uLightAmbient;
uniform Light uLight;
uniform vec4 uMaterialAmbient;
uniform vec4 uMaterialDiffuse;
uniform vec4 uMaterialSpecular;

in vec3 vNormal;
in vec3 vLightRay;
in vec3 vEyeVector;

layout(location = 0) out vec4 fragColor;
layout(location = 1) out vec4 brightColor;

void main(void) {
    if (uDebug){
        fragColor = vec4(1.0, 0.0, 1.0, 1.0);
    } else {
        // Normalized normal
        vec3 N = normalize(vNormal);
        vec3 L = normalize(vLightRay);
        float lambertTerm = dot(N, -L);
        // Ambient
        vec4 Ia = uLightAmbient * uMaterialAmbient;
        // Diffuse
        vec4 Id = vec4(0.0, 0.0, 0.0, 1.0);
        // Specular
        vec4 Is = vec4(0.0, 0.0, 0.0, 1.0);

        if (lambertTerm > 0.0) {
            Id = uLight.diffuse * uMaterialDiffuse * lambertTerm;
            vec3 E = normalize(vEyeVector);
            vec3 R = reflect(L, N);
            float specular = pow( max(dot(R, E), 0.0), uShininess);
            Is = uLight.specular * uMaterialSpecular * specular;
        }

        // Final fargment color takes into account all light values that
        // were computed within the fragment shader
        fragColor = vec4(vec3(Ia + Id /*+ Is*/), 1.0);
        float brightness = dot(fragColor.rgb, vec3(0.2, 0.7, 0.07));
        if (brightness > 1.0) {
            brightColor = fragColor;
        } else {
            brightColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
    }
}