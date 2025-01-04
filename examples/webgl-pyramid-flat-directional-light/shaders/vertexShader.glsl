attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;

varying vec3 vNormal;
varying vec2 vTexCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;

void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
  vNormal = normalize(mat3(uNormalMatrix) * aNormal); // Transform normal to view space
  vTexCoord = aTexCoord; // Pass texture coordinates
}
