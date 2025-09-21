#version 300 es

precision mediump float;

// build_include "constants.h"

layout(std140) uniform Transforms {
  mat4 modelView;
  mat4 modelViewProjection;
  mat4 depthMapLookup;
} transforms;

// Make VScode happy.
#ifndef IN_POSITION_LOCATION
#define IN_POSITION_LOCATION 0
#define IN_NORMAL_LOCATION 1
#define IN_MATERIAL_REF_LOCATION 2
#endif

layout(location = IN_POSITION_LOCATION) in vec3 inPosition;
layout(location = IN_NORMAL_LOCATION) in vec3 inNormal;
layout(location = IN_MATERIAL_REF_LOCATION) in uint inMaterialRef;

out vec3 vertex;
out vec3 normal;
out vec4 depthMapLookup;
flat out uint materialRef;

void main() {
  vec4 inPositionHomogeneous = vec4(inPosition, 1.0f);
  gl_Position = transforms.modelViewProjection * inPositionHomogeneous;
  vertex = vec3(transforms.modelView * inPositionHomogeneous);
  depthMapLookup = transforms.depthMapLookup * inPositionHomogeneous;
  normal = mat3(transforms.modelView) * inNormal;
  materialRef = inMaterialRef;
}
