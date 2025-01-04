precision mediump float;

  varying vec3 vNormal;    
  varying vec2 vTexCoord;  
  varying vec3 vViewPos;   // The position of the fragment in view space

  uniform vec3 uLightPosition; // Point light position (view space)
  uniform vec3 uLightColor;    // RGB intensity of the point light
  uniform sampler2D uTexture;  

  void main(void) {
    // Normalize the interpolated normal
    vec3 normal = normalize(vNormal);

    // Compute the direction from the fragment to the light (in view space)
    vec3 lightDir = uLightPosition - vViewPos;
    lightDir = normalize(lightDir);

    // Diffuse term
    float diffuse = max(dot(normal, lightDir), 0.0);

    // Sample the texture color
    vec4 baseColor = texture2D(uTexture, vTexCoord);

    // Combine with the point light color
    vec3 finalColor = baseColor.rgb * diffuse * uLightColor;

    // Set the final fragment color
    gl_FragColor = vec4(finalColor, baseColor.a);
  }