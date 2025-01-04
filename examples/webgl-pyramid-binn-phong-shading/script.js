const canvas = document.getElementById('webglCanvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    alert('WebGL not supported!');
    throw new Error('WebGL not supported');
}

async function loadShader(gl, path, type) {
    const response = await fetch(path);
    const source = await response.text();
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(`Error compiling ${type === gl.VERTEX_SHADER ? 'vertex' : 'fragment'} shader:`, gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        throw new Error('Shader compilation failed');
    }
    return shader;
}

async function init() {
    const vertexShader = await loadShader(gl, './shaders/vertexShader.glsl', gl.VERTEX_SHADER);
    const fragmentShader = await loadShader(gl, './shaders/fragmentShader.glsl', gl.FRAGMENT_SHADER);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error('Error linking program:', gl.getProgramInfoLog(shaderProgram));
        return;
    }
    gl.useProgram(shaderProgram);

    // Shader compilation helper
    function compileShader(gl, source, type) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          console.error('Error compiling shader:', gl.getShaderInfoLog(shader));
          gl.deleteShader(shader);
          return null;
      }
      return shader;
  }

  // Positions (x, y, z)
  // Normals   (nx, ny, nz)  -- smoothed
  // TexCoords (u, v)        -- example values
  const baseVertices = new Float32Array([
      // Apex
      0.0,  1.0,  0.0,    0.0,  1.0,  0.0,           0.5, 1.0,
      // Front-left
      -1.0, -1.0,  1.0,   -0.7051, -0.0832,  0.7051,  0.0, 0.0,
      // Front-right
      1.0, -1.0,  1.0,    0.7051, -0.0832,  0.7051,  1.0, 0.0,
      // Back-right
      1.0, -1.0, -1.0,    0.7051, -0.0832, -0.7051,  1.0, 0.0,
      // Back-left
      -1.0, -1.0, -1.0,   -0.7051, -0.0832, -0.7051,  0.0, 0.0
  ]);


  const baseIndices = new Uint16Array([
      0, 1, 2, // Front face
      0, 2, 3, // Right face
      0, 3, 4, // Back face
      0, 4, 1, // Left face
      1, 2, 3, // Base face 1
      1, 3, 4  // Base face 2
  ]);

  // Create and bind buffers
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, baseVertices, gl.STATIC_DRAW);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, baseIndices, gl.STATIC_DRAW);

  // Define attribute pointers
  const aPosition = gl.getAttribLocation(shaderProgram, 'aPosition');
  const aNormal = gl.getAttribLocation(shaderProgram, 'aNormal');
  const aTexCoord = gl.getAttribLocation(shaderProgram, 'aTexCoord');

  const stride = 8 * Float32Array.BYTES_PER_ELEMENT; // 3 position + 3 normal + 2 texCoord

  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, stride, 0);
  gl.enableVertexAttribArray(aPosition);

  gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, stride, 3 * Float32Array.BYTES_PER_ELEMENT);
  gl.enableVertexAttribArray(aNormal);

  gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, stride, 6 * Float32Array.BYTES_PER_ELEMENT);
  gl.enableVertexAttribArray(aTexCoord);

  // Set up uniforms
  const uModelViewMatrix = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix');
  const uProjectionMatrix = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');
  const uNormalMatrix = gl.getUniformLocation(shaderProgram, 'uNormalMatrix');
  const uLightDirection = gl.getUniformLocation(shaderProgram, 'uLightDirection');
  const uLightIntensity = gl.getUniformLocation(shaderProgram, 'uLightIntensity');
  const uAlpha = gl.getUniformLocation(shaderProgram, 'uAlpha');
  const uSpecularLightIntensity = gl.getUniformLocation(shaderProgram, 'uSpecularLightIntensity');


  const uTime = gl.getUniformLocation(shaderProgram, 'uTime');
  const texture = gl.createTexture();
  const img = new Image();


  const modelViewMatrix = mat4.create();
  const projectionMatrix = mat4.create();
  const normalMatrix = mat4.create();

  mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 0.1, 100.0);
  mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -5.0]);

  // Set Diffuse light properties
  gl.uniform3fv(uLightDirection, [0.0, 0.0, 1.0]);
  gl.uniform3fv(uLightIntensity, [1.0*3, 1.0*2, 0.7*2]); // somewhat warm color
  // Set Specular light properties
  gl.uniform3fv(uSpecularLightIntensity, [1.0/3, 1.0/3, 1.0/3]);
  gl.uniform1f(uAlpha, 2.0); // somewhat warm color

  // Animation function
  let startTime = performance.now();

  // Load the texture
  img.src = '../textures/metallTexture.jpg'; // Replace with the actual texture image path

  img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);

      // Upload the image to the GPU
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

      // Generate mipmaps
      gl.generateMipmap(gl.TEXTURE_2D);

      // Set texture parameters
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      // Set the texture uniform
      const uTexture = gl.getUniformLocation(shaderProgram, 'uTexture');
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(uTexture, 0);

      // Start rendering
      render();
  };

  // Animation loop
  function render() {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);

      const currentTime = performance.now();
      const elapsedTime = (currentTime - startTime) / 1000; // Convert to seconds

      // Pass the time to the shader
      gl.uniform1f(uTime, elapsedTime);

      mat4.rotateY(modelViewMatrix, modelViewMatrix, 0.01);
      mat4.invert(normalMatrix, modelViewMatrix);
      mat4.transpose(normalMatrix, normalMatrix);

      gl.uniformMatrix4fv(uModelViewMatrix, false, modelViewMatrix);
      gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix);
      gl.uniformMatrix4fv(uNormalMatrix, false, normalMatrix);

      gl.drawElements(gl.TRIANGLES, baseIndices.length, gl.UNSIGNED_SHORT, 0);

      requestAnimationFrame(render);
  }

  render();
}

init();