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
  #define ARG_materialColor COLOR
  #define ARG_materialShininess SHININESS
  #define ARG_materialAlpha 1.0f

  // build_include "lighting.h"
}
