precision mediump float;

varying vec3 vNormal;
varying vec2 vTexCoord;

uniform vec3 uLightDirection;
uniform vec3 uLightIntensity;
uniform sampler2D uTexture;

void main(void) {
  vec3 normal = normalize(vNormal); // Normalize interpolated normal
  float diffuse = max(dot(normal, normalize(uLightDirection)), 0.0); // Diffuse light factor

  vec4 baseColor = texture2D(uTexture, vTexCoord); // Sample the texture
  vec3 finalColor = baseColor.rgb * diffuse * uLightIntensity; // Apply lighting

  gl_FragColor = vec4(finalColor, baseColor.a); // Set fragment color
}
