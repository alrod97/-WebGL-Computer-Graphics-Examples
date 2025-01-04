
# WebGL Animated 2D Triangle

This project demonstrates how to render an **animated 2D Triangle** using **WebGL** with vertex and fragment shaders. The animation dynamically updates the colors of the triangle's vertices over time using sinusoidal functions. The triangle's vertex colors are animated, smoothly transitioning through the RGB spectrum over time:

<p align="center">
<img src="../../figures/animatedTriangleColor.gif" alt="animated" width="400">
</p> 

---

## **Overview**
- **Purpose**: To illustrate how to animate vertex colors in WebGL.
- **Key Features**:
  - Smooth color transitions over time using `sin()` functions in the vertex shader.
  - Animation achieved via a time uniform (`uTime`) passed from JavaScript to the shaders.
  - Highlights the use of interpolated colors for fragment shading.

---

## **Shaders**
1. **Vertex Shader**:
   - Computes dynamic vertex colors based on time (`uTime`).
   - Passes interpolated colors to the fragment shader for rendering.

2. **Fragment Shader**:
   - Receives interpolated colors for each fragment.
   - Outputs the dynamically changing colors.
