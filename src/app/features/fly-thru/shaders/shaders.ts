
export const FACET_MESH_VERTEX_SHADER = 
`#version 300 es

// This file is generated. Edit constants.ts instead.
#define IN_POSITION_LOCATION 0
#define IN_NORMAL_LOCATION 1
#define IN_MATERIAL_REF_LOCATION 2
#define IN_TEX_COORD_LOCATION 3
#line 4

layout(std140) uniform Transforms {
  mat4 modelView;
  mat4 modelViewProjection;
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
flat out uint materialRef;

void main() {
  vec4 inPositionHomogeneous = vec4(inPosition, 1.0f);
  gl_Position = transforms.modelViewProjection * inPositionHomogeneous;
  vertex = vec3(transforms.modelView * inPositionHomogeneous);
  normal = mat3(transforms.modelView) * inNormal;
  materialRef = inMaterialRef;
}
`;

export const FACET_MESH_FRAGMENT_SHADER = 
`#version 300 es

precision mediump float;

layout(std140) uniform LightConfig {
  vec3 unitDirection;
  vec3 color;
  float ambientIntensity;
} light;

// Pack struct manually into vec4s to work around known hardware bugs.
struct MaterialSpec {
  #define COLOR spec.xyz
  #define SHININESS spec.w
  vec4 spec;
};

layout(std140) uniform MaterialConfig {
  MaterialSpec specs[11];
} material;

in vec3 vertex;
in vec3 normal;
flat in uint materialRef;
out vec4 fragmentColor;

void main() {
  vec3 unitNormal = normalize(normal);
  float normalDotLight = dot(unitNormal, light.unitDirection);
  vec3 unitReflection = normalize(2.0f * normalDotLight * unitNormal - light.unitDirection);
  vec3 unitEye = normalize(-vertex);
  MaterialSpec materal = material.specs[materialRef];
  float specularIntensity = pow(max(dot(unitReflection, unitEye), 0.0f), materal.SHININESS);
  vec3 specularColor = specularIntensity * light.color;
  float diffuseIntensity = (1.0f - light.ambientIntensity) * clamp(normalDotLight, 0.0f, 1.0f) + light.ambientIntensity;
  vec3 diffuseColor = diffuseIntensity * materal.COLOR * light.color * (1.0 - specularIntensity);
  fragmentColor = vec4(specularColor + diffuseColor, 1.0f);
}`;

export const OVERLAY_VERTEX_SHADER = 
`#version 300 es

// This file is generated. Edit constants.ts instead.
#define IN_POSITION_LOCATION 0
#define IN_NORMAL_LOCATION 1
#define IN_MATERIAL_REF_LOCATION 2
#define IN_TEX_COORD_LOCATION 3
#line 4

precision mediump float;

layout(std140) uniform Overlay {
  uniform mat3 projection;
  float alpha;
} overlay;

// Make VScode happy.
#ifndef IN_POSITION_LOCATION
#define IN_POSITION_LOCATION 3
#endif

// Serves as both tex coord and positions of overlay corners.
layout(location = IN_POSITION_LOCATION) in vec2 inPosition;

out vec2 texCoord;

void main() {
  vec2 position2D = (overlay.projection * vec3(inPosition, 1)).xy;
  gl_Position = vec4(position2D, 0, 1);
  texCoord = inPosition;
}
`;

export const OVERLAY_FRAGMENT_SHADER = 
`#version 300 es

precision mediump float;

layout(std140) uniform Overlay {
  uniform mat3 projection;
  float alpha;
} overlay;

uniform sampler2D icon;

in vec2 texCoord;
out vec4 fragmentColor;

void main() {
  fragmentColor = texture(icon, texCoord);
  fragmentColor.a *= overlay.alpha;
}
`;

export const RIVER_VERTEX_SHADER = 
`#version 300 es

precision mediump float;

// This file is generated. Edit constants.ts instead.
#define IN_POSITION_LOCATION 0
#define IN_NORMAL_LOCATION 1
#define IN_MATERIAL_REF_LOCATION 2
#define IN_TEX_COORD_LOCATION 3
#line 6

layout(std140) uniform Transforms {
  mat4 modelView;
  mat4 modelViewProjection;
} transforms;

// Make VScode happy.
#ifndef IN_POSITION_LOCATION
#define IN_POSITION_LOCATION 0
#endif

layout(location = IN_POSITION_LOCATION) in vec2 inPosition;

out vec3 vertex;
out vec3 normal;
out vec2 texCoord;

// Smaller scale makes texture appear larger.
const float TEX_SCALE = 0.2;

void main() {
  vec4 inPositionHomogeneous = vec4(inPosition.x, 0.0f, inPosition.y, 1.0f);
  gl_Position = transforms.modelViewProjection * inPositionHomogeneous;
  vertex = vec3(transforms.modelView * inPositionHomogeneous);
  normal = mat3(transforms.modelView) * vec3(0.0f, 1.0f, 0.0f);
  texCoord = TEX_SCALE * inPosition;
}
`;

export const RIVER_FRAGMENT_SHADER = 
`#version 300 es

precision mediump float;

layout(std140) uniform LightConfig {
  vec3 unitDirection;
  vec3 color;
  float ambientIntensity;
} light;

layout(std140) uniform Time {
  // Time that wraps every 32 seconds.
  float clock;
} time;

uniform sampler2D water;

in vec3 vertex;
in vec3 normal;
in vec2 texCoord;
out vec4 fragmentColor;

// Components must be multiples of 1/32 for smooth time wrapping.
const vec2 WATER_VELOCITY = vec2(1.0/32.0f, 3.0/32.0);

// TODO: Simplify or finish ripples with fine triangulation of river surface.
void main() {
  vec3 unitNormal = normalize(normal);
  float normalDotLight = dot(unitNormal, light.unitDirection);
  vec3 unitReflection = normalize(2.0f * normalDotLight * unitNormal - light.unitDirection);
  vec3 unitEye = normalize(-vertex);
  float specularIntensity = pow(max(dot(unitReflection, unitEye), 0.0f), 120.0f);
  vec3 specularColor = specularIntensity * light.color;
  float diffuseIntensity = (1.0f - light.ambientIntensity) * clamp(normalDotLight, 0.0f, 1.0f) + light.ambientIntensity;
  // Use fractional parts of terms to avoid float overflow.
  vec3 texColor = texture(water, fract(texCoord) + WATER_VELOCITY * time.clock).rgb;
  vec3 diffuseColor = diffuseIntensity * texColor * light.color * (1.0f - specularIntensity);
  fragmentColor = vec4(specularColor + diffuseColor, 1.0f);
}
`;

export const SKY_VERTEX_SHADER = 
`#version 300 es

precision mediump float;

// This file is generated. Edit constants.ts instead.
#define IN_POSITION_LOCATION 0
#define IN_NORMAL_LOCATION 1
#define IN_MATERIAL_REF_LOCATION 2
#define IN_TEX_COORD_LOCATION 3
#line 6

layout(std140) uniform SkyboxTransforms {
  mat4 viewRotationProjection;
} transforms;

// Make VScode happy.
#ifndef IN_POSITION_LOCATION
#define IN_POSITION_LOCATION 0
#endif

layout(location = IN_POSITION_LOCATION) in vec3 inPosition;

out vec3 texCoord;

void main() {
  vec4 homogenousPosition = transforms.viewRotationProjection * vec4(inPosition, 1);
  gl_Position = homogenousPosition.xyww; // Clamp z to 1 after perspective division.
  texCoord = inPosition;
}`;

export const SKY_FRAGMENT_SHADER = 
`#version 300 es

precision mediump float;

// TODO: Maybe add ambient light for brightness control.
uniform samplerCube skybox;

in vec3 texCoord;
out vec4 fragmentColor;

void main() {
  fragmentColor = texture(skybox, texCoord);
}
`;

export const TERRAIN_VERTEX_SHADER = 
`#version 300 es

// This file is generated. Edit constants.ts instead.
#define IN_POSITION_LOCATION 0
#define IN_NORMAL_LOCATION 1
#define IN_MATERIAL_REF_LOCATION 2
#define IN_TEX_COORD_LOCATION 3
#line 4

layout(std140) uniform Transforms {
  mat4 modelView;
  mat4 modelViewProjection;
} transforms;

// Make VScode happy.
#ifndef IN_POSITION_LOCATION
#define IN_POSITION_LOCATION 0
#define IN_NORMAL_LOCATION 1
#endif

layout(location = IN_POSITION_LOCATION) in vec3 inPosition;
layout(location = IN_NORMAL_LOCATION) in vec3 inNormal;

out vec3 normal;
out float yModelNormal;

void main() {
  gl_Position = transforms.modelViewProjection * vec4(inPosition, 1.0f);
  normal = mat3(transforms.modelView) * inNormal;
  yModelNormal = inNormal.y;
}
`;

export const TERRAIN_FRAGMENT_SHADER = 
`#version 300 es

precision mediump float;

layout(std140) uniform LightConfig {
  vec3 unitDirection;
  vec3 color;
  float ambientIntensity;
} light;

in vec3 normal;
in float yModelNormal;
out vec4 fragmentColor;

const vec3 NORMAL_TERRAIN_COLOR = vec3(0.13f, 0.59f, 0.33f);
const vec3 ERODED_TERRAIN_COLOR = vec3(0.87f, 0.78f, 0.52f);
const vec3 EROSION_DIFF = NORMAL_TERRAIN_COLOR - ERODED_TERRAIN_COLOR;

void main() {
  vec3 unitNormal = normalize(normal);
  float normalDotLight = dot(unitNormal, light.unitDirection);
  // Ignoring ambient intensity makes terrain more dramatic.
  float diffuseIntensity = clamp(normalDotLight, 0.0f, 1.0f);
  // Powering up makes the erosion effect more visible.
  float normalTerrainColorWeight = pow(yModelNormal,4.0);
  vec3 color = ERODED_TERRAIN_COLOR + EROSION_DIFF * normalTerrainColorWeight;
  fragmentColor = vec4(diffuseIntensity * color * light.color, 1.0f);
}`;
