#version 300 es

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
