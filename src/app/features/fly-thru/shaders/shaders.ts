
export const CUBE_VERTEX_SHADER = 
`attribute vec4 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uNormalMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;

void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vTextureCoord = aTextureCoord;

    // Apply lighting effect

    highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
    highp vec3 directionalLightColor = vec3(1, 1, 1);
    highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

    highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

    highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
    vLighting = ambientLight + (directionalLightColor * directional);
}`;

export const FACET_MESH_FRAGMENT_SHADER = 
`#version 300 es

precision mediump float;

struct LightConfig {
  vec3 unitDirection;
  vec3 color;
  float ambientIntensity;
};

uniform LightConfig light;

struct Material {
  vec3 color;
  float shininess;
};

#define MATERIAL_COUNT 10
uniform Material materials[MATERIAL_COUNT];

in vec3 vertex;
in vec3 normal;
flat in int materialIndex;
out vec4 fragmentColor;

void main() {
  vec3 unitNormal = normalize(normal);
  float normalDotLight = dot(unitNormal, light.unitDirection);
  vec3 unitReflection = normalize(2.0 * normalDotLight * unitNormal - light.unitDirection);
  vec3 unitEye = normalize(-vertex);
  Material materal = materials[materialIndex];
  float specularIntensity = pow(max(dot(unitReflection, unitEye), 0.0), materal.shininess);
  vec3 specularColor = specularIntensity * light.color;
  float diffuseIntensity = clamp(normalDotLight + light.ambientIntensity, 0.0, 1.0);
  vec3 diffuseColor = materal.color * diffuseIntensity * light.color * (1.0 - specularIntensity);
  fragmentColor = vec4(specularColor + diffuseColor, 1.0);
}
`;

export const FACET_MESH_VERTEX_SHADER = 
`#version 300 es

uniform mat4 modelViewProjection;
uniform mat4 modelView;

layout (location = 0) in vec3 inPosition;
layout (location = 1) in vec3 inNormal;
layout (location = 2) in int inMaterialIndex;

out vec3 vertex;
out vec3 normal;
flat out int materialIndex;

void main() {
  vec4 inPositionHomogenious = vec4(inPosition, 1.0);
  gl_Position = modelViewProjection * inPositionHomogenious;
  vertex = vec3(modelView * inPositionHomogenious);
  normal = vec3(modelView * vec4(inNormal, 0.0));
  materialIndex = inMaterialIndex;
}
`;

export const CUBE_FRAGMENT_SHADER = 
`varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;

uniform sampler2D uSampler;

void main(void) {
    highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

    gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
}
`;
