#version 300 es

precision mediump float;
precision mediump sampler2DShadow;

layout(std140) uniform LightConfig {
  vec3 unitDirection;
  float brightness;
  vec3 color;
  float ambientIntensity;
  float shadowWeight;
} light;

uniform sampler2DShadow depthMap;

in vec3 vertex;
in vec3 normal;
in vec4 depthMapLookup;
out vec4 fragmentColor;

const vec3 COLOR = vec3(1.0, 0.0, 0.0);
const float SHININESS = 20.0;

void main() {
  vec3 unitNormal = normalize(normal);
  float normalDotLight = dot(unitNormal, light.unitDirection);
  vec3 unitReflection = normalize(2.0f * normalDotLight * unitNormal - light.unitDirection);
  vec3 unitEye = normalize(-vertex);
  float specularIntensity = pow(max(dot(unitReflection, unitEye), 0.0f), SHININESS);
  vec3 specularColor = specularIntensity * light.color;
  float diffuseIntensity = (1.0f - light.ambientIntensity) * clamp(normalDotLight, 0.0f, 1.0f) + light.ambientIntensity;
  vec3 diffuseColor = diffuseIntensity * COLOR * light.color * (1.0f - specularIntensity);
  // build_include "shadow_lookup.h"
  // Make VScode happy.
  #ifndef SHADOW
    float shadow = 1.0f;
  #endif
  fragmentColor = light.brightness * vec4(specularColor + diffuseColor,1) * shadow;
}
