#define LIGHTING 1

// Assumed present:
// struct light
//  .unitDirection 
//  .brightness
//  .color
//  .ambientIntensity
//  .shadowWeight
// sampler2DShadow depthMap
// vec3 vertex
// vec3 normal
// vec3 depthMapLookup
//
// Args:
// vec3 ARG_materialColor
// float ARG_materialShininess
// float ARG_materialAlpha
//
// Output:
// vec4 fragmentColor

vec3 unitNormal = normalize(normal);
float normalDotLight = dot(unitNormal, light.unitDirection);
vec3 unitReflection = normalize(2.0f * normalDotLight * unitNormal - light.unitDirection);
vec3 unitEye = normalize(-vertex);
// build_include "shadow.h"
float specularIntensity = pow(shadow * max(dot(unitReflection, unitEye), 0.0f), ARG_materialShininess);
float diffuseIntensity = mix(light.ambientIntensity, 1.0f, shadow * max(0.0f, normalDotLight));
vec3 color = light.color * (specularIntensity + diffuseIntensity * ARG_materialColor);
fragmentColor = vec4(light.brightness * color, ARG_materialAlpha);
