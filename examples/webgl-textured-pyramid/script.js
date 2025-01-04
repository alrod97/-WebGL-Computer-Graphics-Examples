const canvas = document.getElementById('webglCanvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    alert('WebGL not supported!');
    throw new Error('WebGL not supported');
}

// Utility function to load shaders
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
    // Load shaders
    const vertexShader = await loadShader(gl, './shaders/vertexShader.glsl', gl.VERTEX_SHADER);
    const fragmentShader = await loadShader(gl, './shaders/fragmentShader.glsl', gl.FRAGMENT_SHADER);

    // Create and link shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error('Error linking program:', gl.getProgramInfoLog(shaderProgram));
        return;
    }
    gl.useProgram(shaderProgram);

    // Pyramid vertices and texture coordinates
    const vertices = new Float32Array([
        // Positions         // Texture Coords
         0.0,  1.0,  0.0,    0.5, 1.0,  // Apex
        -1.0, -1.0,  1.0,    0.0, 0.0,  // Front-left
         1.0, -1.0,  1.0,    1.0, 0.0,  // Front-right
         1.0, -1.0, -1.0,    1.0, 1.0,  // Back-right
        -1.0, -1.0, -1.0,    0.0, 1.0   // Back-left
    ]);

    const indices = new Uint16Array([
        0, 1, 2, // Front face
        0, 2, 3, // Right face
        0, 3, 4, // Back face
        0, 4, 1, // Left face
        1, 2, 3, // Base face 1
        1, 3, 4  // Base face 2
    ]);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(shaderProgram, 'aPosition');
    const aTexCoord = gl.getAttribLocation(shaderProgram, 'aTexCoord');
    const uModelViewMatrix = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix');
    const uProjectionMatrix = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');

    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(aPosition);

    gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(aTexCoord);

    const modelViewMatrix = mat4.create();
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 0.1, 100.0);
    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -5.0]);

    const texture = gl.createTexture();
    const img = new Image();
    img.src = '../textures/metallTexture.jpg'; // Path to texture image

    img.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        render();
    };

    function render() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);

        mat4.rotateY(modelViewMatrix, modelViewMatrix, 0.01);

        gl.uniformMatrix4fv(uModelViewMatrix, false, modelViewMatrix);
        gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix);

        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(render);
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
}

init();
