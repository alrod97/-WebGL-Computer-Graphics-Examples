# WebGL Flat-Shaded Pyramid with Point Light

This project demonstrates a 3D pyramid rendered using flat shading and illuminated by a point light source. The light's interaction with the pyramid is calculated per fragment, enabling realistic shading based on the geometry and light position. The pyramid's faces are shaded based on their orientation relative to the point light source. The texture color is modulated by the light's intensity and direction.

<p align="center">
<img src="../../figures/flatShading_point_light.gif" alt="animated" width="400">
</p>

## **Features**
- Flat shading: A single normal is used for each face of the pyramid.
- Point light: The light direction is dynamically computed in the fragment shader for every fragment.
- Texture mapping: The pyramid is textured using an external image.
- Continuous animation: The pyramid rotates around the Y-axis.

## **Shaders**

### Vertex Shader
The vertex shader transforms each vertex's position and normal to the view space and passes this data to the fragment shader.

Key tasks:
1. Transform the vertex position into clip space.
2. Normalize and transform the face normals into view space.
3. Pass the texture coordinates to the fragment shader.

### Fragment Shader
The fragment shader computes the light interaction using a **point light**.

Key computations:
- The direction to the light is calculated as:
  ```glsl
  vec3 lightDir = uLightPosition - vViewPos;
  lightDir = normalize(lightDir);
  ```
  This considers the light's position (`uLightPosition`) and the fragment's view-space position (`vViewPos`).
  
- The diffuse lighting term is computed as:
  ```glsl
  float diffuse = max(dot(normal, lightDir), 0.0);
  ```
  When the dot product is negative, it indicates that the surface normal is facing away from the light source (angle > 90°), so no light contributes to that fragment.

- The final color is calculated by combining the texture color and the light intensity:
  ```glsl
  vec3 finalColor = baseColor.rgb * diffuse * uLightColor;
  ```

## **Lighting Explanation**
Unlike a directional light, a point light emits light in all directions from a specific position. Hence, the direction to the light (`lightDir`) varies for each fragment. This requires computing the light direction dynamically in the fragment shader using the view-space position of the fragment and the light's position.

## **Shader Code**

### Vertex Shader
```glsl
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
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
    vNormal = normalize(mat3(uNormalMatrix) * aNormal);
    vec4 viewPos = uModelViewMatrix * vec4(aPosition, 1.0);
    vViewPos = viewPos.xyz;
    vTexCoord = aTexCoord;
}
```

### Fragment Shader
```glsl
precision mediump float;

varying vec3 vNormal;
varying vec2 vTexCoord;
varying vec3 vViewPos;

uniform vec3 uLightPosition;
uniform vec3 uLightColor;
uniform sampler2D uTexture;

void main(void) {
    vec3 normal = normalize(vNormal);
    vec3 lightDir = uLightPosition - vViewPos;
    lightDir = normalize(lightDir);
    float diffuse = max(dot(normal, lightDir), 0.0);
    vec4 baseColor = texture2D(uTexture, vTexCoord);
    vec3 finalColor = baseColor.rgb * diffuse * uLightColor;
    gl_FragColor = vec4(finalColor, baseColor.a);
}
```
