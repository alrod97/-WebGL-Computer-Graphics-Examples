

###  **WebGL Shader Examples**

#### **Overview**
This repository showcases a variety of WebGL examples demonstrating the use of **vertex shaders**, **fragment shaders**, and different lighting models for 3D rendering. It is designed to help developers and enthusiasts understand and experiment with WebGL concepts, including geometry, shading, and lighting techniques.

#### **Key Features**
- **Vertex and Fragment Shaders**: Learn how to create and use vertex and fragment shaders to manipulate 3D models and achieve visually appealing effects.
- **Lighting Models**:
  - **Flat Shading**: Apply a single normal per face for distinct and crisp lighting across polygonal surfaces.
  - **Gouraud Shading**: Smoothly interpolate vertex colors across a surface for a softer lighting effect.
  - **Blinn-Phong Model**: Implement advanced lighting with diffuse and specular components for realistic effects.
- **Texture Mapping**: Add and configure textures on 3D surfaces to enhance realism.
- **Interactive Animations**: Explore animated examples, such as rotating pyramids with time-based transformations.
- **Point Light vs. Directional Light**: Understand the differences in how light sources impact models, including calculation of light direction for point lights.

#### **Included Examples**
- **Basic Shapes**:
  - A simple 2D triangle with color interpolation.
  - Animated 2D triangle with color rotation using sinusoidal functions.
- **3D Models**:
  - A textured pyramid with rotation.
  - A pyramid using flat shading for lighting.
  - A pyramid with Gouraud shading for smooth lighting.
  - A Blinn-Phong textured pyramid with specular highlights.
- **Lighting Techniques**:
  - Directional light for consistent light direction.
  - Point light for dynamic lighting calculations based on distance and position.

#### **How to Use**
1. Clone the repository:
   ```bash
   git clone https://github.com/<your-repo>/webgl-shader-examples.git
   ```
2. Open the project in your favorite code editor.

3. Open the examples in your browser using the corresponding .hmtl files

#### **Structure**
- `/shaders`: Contains GLSL shader files for vertex and fragment shaders.
- `/textures`: Includes texture images used in examples.
- `/examples`: Contains HTML and JavaScript files for each WebGL demo.
- `/figures`: Visual assets such as example screenshots or videos.
- `README.md`: Documentation for each specific example.

#### **Contributing**
Contributions are welcome! If you have ideas for new examples or improvements, feel free to submit a pull request or open an issue.

#### **License**
This project is licensed under the MIT License. See the LICENSE file for details.
