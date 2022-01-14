#version 300 es
precision mediump float;

struct Light {
    vec3 position;
    vec4 diffuse;
    vec4 specular;
};

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uNormalMatrix;
uniform Light uLight;

in vec3 aVertexPosition;
in vec3 aVertexNormal;

out vec3 vNormal;
out vec3 vLightRay;
out vec3 vEyeVector;

void main(void) {
    vec4 vertex = uModelViewMatrix * vec4(aVertexPosition, 1.0);
    vec4 light = uModelViewMatrix * vec4(uLight.position, 1.0);

    // Set varyings to be used in fragment shader
    vNormal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));
    vLightRay = vertex.xyz - light.xyz;
    vEyeVector = -vec3(vertex.xyz);

    gl_Position = uProjectionMatrix * vertex;
}