attribute vec3 aPosition;
        attribute vec3 aNormal;   // Normal attribute
        attribute vec2 aTexCoord; // Texture coordinates

        varying vec3 vNormal;    // Pass normal to the fragment shader
        varying vec2 vTexCoord; // Pass texture coordinates
        varying vec3 vPositions; // positions in view model coord system used for specular light computation  

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        uniform mat4 uNormalMatrix; // Matrix to transform normals to view space

        uniform float uTime; 
        varying float vuTime; // Interpolated texture coordinates

        void main(void) {
            // Transform vertex position
            gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);

            // Transform the normal to view space
            vNormal = mat3(uNormalMatrix) * aNormal;

            // Transform positons to view 
            vPositions = (uModelViewMatrix * vec4(aPosition, 1.0)).xyz;

            // Pass the texture coordinates
            vTexCoord = aTexCoord;
            vuTime = uTime;
        }