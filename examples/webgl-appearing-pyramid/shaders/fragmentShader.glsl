precision mediump float;

varying vec3 vNormal;   // Interpolated normal
varying vec2 vTexCoord; // Interpolated texture coordinates
varying float vuTime; // time 
varying vec3 vPositions; // positions in view model coord system used for specular light computation  


uniform vec3 uLightDirection; // Light direction in world space
uniform vec3 uLightIntensity; // Light intensity (RGB)
uniform sampler2D uTexture;   // Texture sampler

// for specular light
uniform vec3 uSpecularLightIntensity; // Light intensity (RGB)
uniform float uAlpha; // Aplha value for specular light

        void main(void) {
            // Normalize the interpolated normal
            vec3 normal = normalize(vNormal);

            // Calculate diffuse lighting
            float diffuse = max(dot(normal, normalize(uLightDirection)), 0.0);

            // Calculate the specular light component 
            float specular = pow(max(dot(normal, normalize(uLightDirection-vPositions)), 0.0), uAlpha);

            // Sample the texture color
            vec4 baseColor = texture2D(uTexture, vTexCoord);

            // Apply diffuse + specular + directional lighting to the texture color
            //vec3 finalColor = baseColor.rgb * diffuse * uLightIntensity; //* (sin(vuTime) + 1.3);
            vec3 finalColor = uLightIntensity * diffuse * (baseColor.rgb + uSpecularLightIntensity * specular);

            // Geometry effect here; for y axis depending on time
            // Set the final fragment color

            float alpha = step(vPositions.y, vuTime / 5.0 - 1.0);
            gl_FragColor = vec4(finalColor, baseColor.a * alpha);
        }