attribute vec3 aPosition;
attribute vec3 aColor;
varying lowp vec3 vColor;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uTime;

void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);

    // Time-based color rotation
    float red = aColor.r * abs(sin(uTime));
    float green = aColor.g * abs(sin(uTime + 2.0944)); // Offset by 2π/3
    float blue = aColor.b * abs(sin(uTime + 4.1888));  // Offset by 4π/3

    vColor = vec3(red, green, blue);
}