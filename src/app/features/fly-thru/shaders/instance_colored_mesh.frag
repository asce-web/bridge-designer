#version 300 es

precision mediump float;
precision mediump sampler2DShadow;

layout(std140) uniform LightConfig {
  vec3 unitDirection;
  float brightness;
  vec3 color;
  float ambientIntensity;
  float shadowWeight;
  float globalAlpha;
} light;

uniform sampler2DShadow depthMap;

in vec3 vertex;
in vec3 normal;
in vec4 depthMapLookup;
in vec3 materialColor;
out vec4 fragmentColor;

const float MEMBER_SHININESS = 20.0;

void main() {
  #define ARG_materialColor materialColor
  #define ARG_materialShininess MEMBER_SHININESS
  #define ARG_materialAlpha 1.0f

  // build_include "lighting.h"
}