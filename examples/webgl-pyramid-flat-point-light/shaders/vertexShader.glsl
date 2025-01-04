  attribute vec3 aPosition;
  attribute vec3 aNormal;   
  attribute vec2 aTexCoord; 

  varying vec3 vNormal;     
  varying vec2 vTexCoord;   
  varying vec3 vViewPos;    

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;
  uniform mat4 uNormalMatrix; 

  void main(void) {
    // Transform vertex position to clip space
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);

    // Transform the normal into view space
    vNormal = normalize(mat3(uNormalMatrix) * aNormal);

    // Compute the view-space position of this vertex
    vec4 viewPos = uModelViewMatrix * vec4(aPosition, 1.0);
    vViewPos = viewPos.xyz;

    // Pass the texture coordinates
    vTexCoord = aTexCoord;
  }
