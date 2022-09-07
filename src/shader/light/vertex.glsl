varying vec2 vUv;

precision lowp float;

varying vec4 vPosition;
varying vec3 gPosition;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vUv = uv;
  vPosition = modelPosition;
  gPosition = position;
  gl_Position = projectionMatrix * viewMatrix * modelPosition;
}