  // Common shadow depth map lookup.
  #define SHADOW 1
  float shadow = light.shadowWeight < 1.0f 
    ? light.shadowWeight + (1.0 - light.shadowWeight) * textureProj(depthMap, depthMapLookup)
    : 1.0f;
