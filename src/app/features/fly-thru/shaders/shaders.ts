
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
  MaterialSpec specs[10];
} material;

in vec3 vertex;
in vec3 normal;
flat in uint materialRef;
out vec4 fragmentColor;

void main() {
  vec3 unitNormal = normalize(normal); // TODO: Verify not needed since not interpolating.
  float normalDotLight = dot(unitNormal, light.unitDirection);
  vec3 unitReflection = normalize(2.0 * normalDotLight * unitNormal - light.unitDirection);
  vec3 unitEye = normalize(-vertex);
  MaterialSpec materal = material.specs[materialRef];
  float specularIntensity = pow(max(dot(unitReflection, unitEye), 0.0), materal.SHININESS);
  vec3 specularColor = specularIntensity * light.color;
  float diffuseIntensity = clamp(normalDotLight + light.ambientIntensity, 0.0, 1.0);
  vec3 diffuseColor = materal.COLOR * diffuseIntensity * light.color * (1.0 - specularIntensity);
  fragmentColor = vec4(specularColor + diffuseColor, 1.0);
}`;

export const FACET_MESH_VERTEX_SHADER = 
`#version 300 es

#define IN_POSITION_LOCATION 0
#define IN_NORMAL_LOCATION 1
#define IN_MATERIAL_REF_LOCATION 2

#define TRANSFORMS_UBO_BINDING_INDEX 0
#define LIGHT_CONFIG_UBO_BINDING_INDEX 1
#define MATERIAL_CONFIG_UBO_BINDING_INDEX 2

#line 4
layout(std140) uniform Transforms {
  mat4 modelView;
  mat4 modelViewProjection;
} transforms;

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
