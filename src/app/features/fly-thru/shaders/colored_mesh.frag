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

// Pack struct manually into vec4s to work around known hardware bugs.
struct MaterialSpec {
  #define COLOR spec.xyz
  #define SHININESS spec.w
  vec4 spec;
};

layout(std140) uniform MaterialConfig {
  MaterialSpec specs[12];
} materialConfig;

uniform sampler2DShadow depthMap;

in vec3 vertex;
in vec3 normal;
in vec4 depthMapLookup;
flat in uint materialRef;
out vec4 fragmentColor;

void main() {
  MaterialSpec materialSpec = materialConfig.specs[materialRef];

  #define ARG_materialColor materialSpec.COLOR
  #define ARG_materialShininess materialSpec.SHININESS
  #define ARG_materialAlpha light.globalAlpha

  // build_include "lighting.h"
}
