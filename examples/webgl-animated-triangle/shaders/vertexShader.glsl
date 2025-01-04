attribute vec2 aPosition;
attribute vec3 aColor;
varying lowp vec3 vColor;
uniform float uTime;

void main(void) {
    // Compute the time-based rotation of colors
    float red = aColor.r * abs(sin(uTime));
    float green = aColor.g * abs(sin(uTime + 2.0944)); // Offset by 2π/3
    float blue = aColor.b * abs(sin(uTime + 4.1888));  // Offset by 4π/3

    // Ensure values are clamped between 0 and 1
    vColor = vec3(red, green, blue);

    gl_Position = vec4(aPosition, 0.0, 1.0);
}
