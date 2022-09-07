precision lowp float;

varying vec4 vPosition;
varying vec3 gPosition;

void main() {
  vec3 redColor = vec3(1.0, 0.0, 0.0);
  vec3 yellowColor = vec3(1.0, 1.0, 0.5);
  vec3 mixColor = mix(yellowColor, redColor, gPosition.y / 3.0);
  gl_FragColor = vec4(mixColor, 1.0);

  // 判断是否是表面
  if(gl_FrontFacing) {
    // 根据高度降低颜色明度
    gl_FragColor = vec4(mixColor.xyz - (vPosition.y - 20.0) / 80.0 - 0.1, 1.0);
  } else {
    gl_FragColor = vec4(mixColor, 1.0);
  }
}
