# WebGL Textured Pyramid

This project demonstrates how to render a textured 3D pyramid in WebGL. The example includes detailed steps for setting up texture mapping and explains how WebGL handles texturing using texture coordinates, texture samplers, and mipmapping. The pyramid displays the texture mapped onto its faces. As the pyramid rotates, the texture remains consistent, demonstrating proper texture mapping and mipmapping.

<p align="center">
<img src="../../figures/pyramidTextured.gif" alt="animated" width="400">
</p>
---

## **Overview**

The WebGL textured pyramid uses texture mapping to apply an image onto the surfaces of the pyramid. Each vertex is associated with texture coordinates (`u` and `v`) that determine how the image is mapped to the pyramid's geometry.

### **Key Features**
- **Texture Mapping**: Associates vertex texture coordinates (`aTexCoord`) with the fragment shader for sampling the texture.
- **Mipmapping**: Uses multiple levels of detail for textures to enhance rendering performance and visual quality.
- **Dynamic Animation**: The pyramid rotates continuously along the Y-axis for a dynamic 3D visualization.

---

## **Code Explanation**

### **Texture Mapping in WebGL**
Texture mapping in WebGL involves the following steps:
1. Load a texture image using JavaScript.
2. Bind the texture to the WebGL rendering context.
3. Set texture parameters such as filtering and mipmapping.
4. Pass the texture coordinates to the fragment shader to sample the texture.

### **Vertex Attributes**
Each vertex in the pyramid has:
- **Position (x, y, z)**: Defines the vertex location in 3D space.
- **Texture Coordinates (u, v)**: Maps the texture to the vertex.

```javascript
const vertices = new Float32Array([
    // Positions         // Texture Coords
     0.0,  1.0,  0.0,    0.5, 1.0,  // Apex
    -1.0, -1.0,  1.0,    0.0, 0.0,  // Front-left
     1.0, -1.0,  1.0,    1.0, 0.0,  // Front-right
     1.0, -1.0, -1.0,    1.0, 1.0,  // Back-right
    -1.0, -1.0, -1.0,    0.0, 1.0   // Back-left
]);
```

### **Texture Sampler in Fragment Shader**
The texture sampler is declared in the fragment shader and used to sample the texture based on the interpolated texture coordinates.

```glsl
precision mediump float;
varying vec2 vTexCoord;
uniform sampler2D uTexture;

void main(void) {
    gl_FragColor = texture2D(uTexture, vTexCoord);
}
```

### **Texture Setup**
```javascript
const texture = gl.createTexture();
const img = new Image();
img.src = '../textures/metallTexture.jpg'; // Path to texture image

img.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
};
```

### **Mipmapping**
Mipmapping generates multiple levels of the texture, optimizing rendering for objects at various distances.
