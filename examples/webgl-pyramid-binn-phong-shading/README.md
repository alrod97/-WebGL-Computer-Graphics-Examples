# WebGL 3D Pyramid with Blinn-Phong Lighting Model

This WebGL example demonstrates a 3D pyramid with a metallic texture, rendered using the **Blinn-Phong lighting model**. The lighting model includes **diffuse**, **specular**, and **ambient** components, emphasizing realistic shading effects with a focus on **specular highlights**. The texture is applied alongside the lighting model to enhance visual fidelity.

The pyramid is rendered with:
1. A metallic texture mapped onto its surfaces.
2. **Blinn-Phong lighting** for realistic specular highlights.
3. Smooth transitions between lighting effects as the pyramid rotates.

<p align="center">
<img src="../../figures/binnPhongShading.gif" alt="animated" width="400">
</p>

## **Blinn-Phong Model Overview**

The **Blinn-Phong lighting model** is an improvement over the standard Phong shading model. It modifies the computation of specular highlights, making it more efficient by using the **halfway vector** between the light direction and the view direction. This modification reduces computational complexity, especially for real-time applications like WebGL.

The **lighting equation** in Blinn-Phong is:

\[
I = k_a \cdot I_a + k_d \cdot I_d \cdot \max(0, \mathbf{N} \cdot \mathbf{L}) + k_s \cdot I_s \cdot \max(0, \mathbf{N} \cdot \mathbf{H})^\alpha
\]

Where:

- \( I \): Final pixel intensity.
- \( k_a, k_d, k_s \): Ambient, diffuse, and specular coefficients (set indirectly in this shader).
- \( I_a, I_d, I_s \): Ambient, diffuse, and specular light intensities.
- \( \mathbf{N} \): Surface normal.
- \( \mathbf{L} \): Light direction (in view space).
- \( \mathbf{H} \): **Halfway vector**, calculated as \( \mathbf{H} = \frac{\mathbf{L} + \mathbf{V}}{\|\mathbf{L} + \mathbf{V}\|} \), where \( \mathbf{V} \) is the view direction.
- \( \alpha \): Shininess coefficient (controls specular highlight size).

### **Key Differences from Phong Shading**
- **Phong:** Computes specular light using the reflection vector and view direction.
- **Blinn-Phong:** Uses the halfway vector for efficiency and smooth highlights.

---

## **Values Set in the Code**

### **Vertex Shader**
- **`vPositions`**: Transforms vertex positions into view space.
- **`vNormal`**: Converts normals into view space for accurate lighting computation.
- **`vTexCoord`**: Passes texture coordinates to the fragment shader.
- **Uniforms:**
  - **`uModelViewMatrix`**: Transforms model coordinates to view coordinates.
  - **`uProjectionMatrix`**: Projects 3D coordinates to 2D screen space.
  - **`uNormalMatrix`**: Transforms normals to view space.

### **Fragment Shader**
- **Diffuse Lighting**:
  \[
  \text{diffuse} = \max(\mathbf{N} \cdot \mathbf{L}, 0)
  \]
  - Ensures lighting only occurs on front-facing surfaces.
- **Specular Lighting**:
  \[
  \text{specular} = \max(\mathbf{N} \cdot \mathbf{H}, 0)^\alpha
  \]
  - Uses the halfway vector for smooth, efficient highlights.
- **Final Lighting**:
  Combines diffuse, specular, and texture contributions:
  \[
  \text{finalColor} = \text{diffuse} \cdot (\text{baseColor} + \text{specularLight})
  \]

---

## **Code Parameters**

### **Diffuse Light**
- Uniform `uLightDirection`: The light direction (constant in this example).
- Uniform `uLightIntensity`: Specifies the RGB intensity of the light source.

### **Specular Light**
- Uniform `uSpecularLightIntensity`: Determines specular highlight color intensity.
- Uniform `uAlpha`: Controls the shininess (higher values produce sharper highlights).

### **Texture**
- Uniform `uTexture`: Applies the pyramid’s metallic texture.

---

## **Image/Animation**
Replace this section with an image or video showcasing the pyramid.
