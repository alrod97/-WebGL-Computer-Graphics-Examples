const canvas = document.getElementById('webglCanvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    alert('WebGL not supported!');
    throw new Error('WebGL not supported');
}

// Utility function to load a shader from a file
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

    // Define triangle vertices and colors
    const vertices = new Float32Array([
        0.0,  0.8,  1.0, 0.0, 0.0,  // Top vertex (red)
       -0.8, -0.8,  0.0, 1.0, 0.0,  // Bottom-left vertex (green)
        0.8, -0.8,  0.0, 0.0, 1.0   // Bottom-right vertex (blue)
    ]);

    // Create and bind the buffer
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Get attribute locations
    const aPosition = gl.getAttribLocation(shaderProgram, 'aPosition');
    const aColor = gl.getAttribLocation(shaderProgram, 'aColor');

    // Link vertex data to attributes
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(aPosition);

    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(aColor);

    // Set background color
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Rendering function
    function render() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        requestAnimationFrame(render);
    }

    render();
}

init();