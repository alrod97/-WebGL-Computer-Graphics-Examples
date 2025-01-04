attribute vec2 aPosition;
attribute vec3 aColor;
varying lowp vec3 vColor;
void main(void) {
    gl_Position = vec4(aPosition, 0.0, 1.0);
    vColor = aColor;
}