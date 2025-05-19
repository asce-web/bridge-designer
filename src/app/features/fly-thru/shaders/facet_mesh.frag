#version 300 es

precision mediump float;

struct LightConfig {
  vec3 unitDirection;
  vec3 color;
  float ambientIntensity;
};

uniform LightConfig light;

struct Material {
  vec3 color;
  float shininess;
};

uniform Material materials[10];

in vec3 vertex;
in vec3 normal;
flat in int materialIndex;
out vec4 fragmentColor;

void main() {
  vec3 unitNormal = normalize(normal);
  float normalDotLight = dot(unitNormal, light.unitDirection);
  vec3 unitReflection = normalize(2.0 * normalDotLight * unitNormal - light.unitDirection);
  vec3 unitEye = normalize(-vertex);
  Material materal = materials[materialIndex];
  float specularIntensity = pow(max(dot(unitReflection, unitEye), 0.0), materal.shininess);
  vec3 specularColor = specularIntensity * light.color;
  float diffuseIntensity = clamp(normalDotLight + light.ambientIntensity, 0.0, 1.0);
  vec3 diffuseColor = materal.color * diffuseIntensity * light.color * (1.0 - specularIntensity);
  fragmentColor = vec4(specularColor + diffuseColor, 1.0);
}
