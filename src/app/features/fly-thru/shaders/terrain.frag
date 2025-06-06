#version 300 es

precision mediump float;

layout(std140) uniform LightConfig {
  vec3 unitDirection;
  vec3 color;
  float ambientIntensity;
} light;

in vec3 normal;
in float yModelNormal;
out vec4 fragmentColor;

const vec3 NORMAL_TERRAIN_COLOR = vec3(.08627f, 0.72156f, 0.35294f);
const vec3 ERODED_TERRAIN_COLOR = vec3(0.87451f, 0.78431f, 0.52157f);
const vec3 EROSION_DIFF = NORMAL_TERRAIN_COLOR - ERODED_TERRAIN_COLOR;

void main() {
  vec3 unitNormal = normalize(normal);
  float normalDotLight = dot(unitNormal, light.unitDirection);
  // Ignoring ambient intensity makes terrain more dramatic.
  float diffuseIntensity = clamp(normalDotLight, 0.0f, 1.0f);
  // Powering up makes the erosion effect more visible.
  float normalTerrainColorWeight = pow(yModelNormal,16.0);
  vec3 color = ERODED_TERRAIN_COLOR + EROSION_DIFF * normalTerrainColorWeight;
  fragmentColor = vec4(diffuseIntensity * color * light.color, 1.0f);
}