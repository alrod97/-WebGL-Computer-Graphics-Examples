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

  const pyramidVertices = new Float32Array([
    // Face 1: Front
    // apex
    0, 1, 0,    0, 0.4472, 0.8944,   0.5, 1.0,
    // front-left
    -1,-1, 1,   0, 0.4472, 0.8944,   0.0, 0.0,
    // front-right
    1, -1, 1,   0, 0.4472, 0.8944,   1.0, 0.0,
  
    // Face 2: Right
    0, 1, 0,    1, 0, 0,   0.5, 1.0,
    1, -1, 1,   1, 0, 0,   0.0, 0.0,
    1, -1, -1,  1, 0, 0,   1.0, 0.0,
  
    // Face 3: Back
    0, 1, 0,    0, 0.4472, -0.8944,   0.5, 1.0,
    1, -1, -1,  0, 0.4472, -0.8944,   0.0, 0.0,
    -1, -1, -1, 0, 0.4472, -0.8944,   1.0, 0.0,
  
    // Face 4: Left
    0, 1, 0,    -1, 0, 0,   0.5, 1.0,
    -1, -1, -1, -1, 0, 0,   0.0, 0.0,
    -1, -1,  1,  -1, 0, 0,   1.0, 0.0,
  
    // Face 5: Base (triangle 1)
    -1, -1, 1,   0, -1, 0,   0.0, 0.0,
    1, -1, 1,    0, -1, 0,   1.0, 0.0,
    1, -1, -1,   0, -1, 0,   1.0, 1.0,
  
    // Face 6: Base (triangle 2)
    -1, -1, 1,   0, -1, 0,   0.0, 0.0,
    1, -1, -1,   0, -1, 0,   1.0, 1.0,
    -1, -1, -1,  0, -1, 0,   0.0, 1.0
  ]);

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, pyramidVertices, gl.STATIC_DRAW);

  const aPosition = gl.getAttribLocation(shaderProgram, 'aPosition');
  const aNormal = gl.getAttribLocation(shaderProgram, 'aNormal');
  const aTexCoord = gl.getAttribLocation(shaderProgram, 'aTexCoord');

  const FLOAT_SIZE = Float32Array.BYTES_PER_ELEMENT;
  const STRIDE = 8 * FLOAT_SIZE;

  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, STRIDE, 0);
  gl.enableVertexAttribArray(aPosition);
  gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, STRIDE, 3 * FLOAT_SIZE);
  gl.enableVertexAttribArray(aNormal);
  gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, STRIDE, 6 * FLOAT_SIZE);
  gl.enableVertexAttribArray(aTexCoord);

  const modelViewMatrix = mat4.create();
  const projectionMatrix = mat4.create();
  const normalMatrix = mat4.create();
  mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 0.1, 100.0);
  mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -6]);

  const uModelViewMatrix = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix');
  const uProjectionMatrix = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');
  const uNormalMatrix = gl.getUniformLocation(shaderProgram, 'uNormalMatrix');
  const uLightDirection = gl.getUniformLocation(shaderProgram, 'uLightDirection');
  const uLightIntensity = gl.getUniformLocation(shaderProgram, 'uLightIntensity');

  gl.uniform3fv(uLightDirection, [0.0, 0.5, 1.0]);
  gl.uniform3fv(uLightIntensity, [1.0, 1.0, 1.0]);

  const texture = gl.createTexture();
  const img = new Image();
  img.src = '../textures/metallTexture.jpg';
  img.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.generateMipmap(gl.TEXTURE_2D);

    render();
  };

  function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    mat4.rotateY(modelViewMatrix, modelViewMatrix, 0.01);
    mat4.invert(normalMatrix, modelViewMatrix);
    mat4.transpose(normalMatrix, normalMatrix);

    gl.uniformMatrix4fv(uModelViewMatrix, false, modelViewMatrix);
    gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(uNormalMatrix, false, normalMatrix);

    gl.drawArrays(gl.TRIANGLES, 0, pyramidVertices.length / 8);
    requestAnimationFrame(render);
  }
}

init();
