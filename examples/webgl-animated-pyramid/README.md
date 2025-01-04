# WebGL Animated 3D Pyramid

This project demonstrates how to render an **animated 3D Pyramid** using **WebGL**. The pyramid features dynamic vertex color changes over time, creating a visually engaging effect with a rotating animation. The pyramid rotates continuously, with its vertex colors dynamically changing over time:

<p align="center">
<img src="../../figures/animatedPyramidColor.gif" alt="animated" width="400">
</p>

---

## **Overview**
- **Purpose**: To showcase how to animate a 3D object with vertex color changes based on time.
- **Key Features**:
  - Smooth animation of vertex colors using sinusoidal functions (`sin()`) in the vertex shader.
  - Dynamic transformation of the model using `uProjectionMatrix` and `uModelViewMatrix`.
  - Continuous rotation of the pyramid for added visual appeal.

---

## **Shaders**
1. **Vertex Shader**:
   - Transforms vertex positions using the projection and model-view matrices.
   - Animates vertex colors based on the `uTime` uniform, creating a cycling RGB effect.

2. **Fragment Shader**:
   - Receives interpolated vertex colors for each fragment.
   - Outputs the animated colors.
