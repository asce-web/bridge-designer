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

layout(std140) uniform Time {
  // Time that wraps every 32 seconds.
  float clock;
} time;

uniform sampler2D water;
uniform sampler2DShadow depthMap;

in vec3 vertex;
in vec3 normal;
in vec4 depthMapLookup;
in vec2 texCoord;
out vec4 fragmentColor;

// Components must be multiples of 1/32 for smooth time wrapping.
const vec2 WATER_VELOCITY = vec2(1.0f / 32.0f, 3.0f / 32.0f);

void main() {
  // fract() may avoid losing shift to float precision.
  vec3 texColor = texture(water, fract(texCoord) + WATER_VELOCITY * time.clock).rgb;

  #define ARG_materialColor texColor
  #define ARG_materialShininess 40.0f
  #define ARG_materialAlpha 1.0f

  // build_include "lighting.h"
}
