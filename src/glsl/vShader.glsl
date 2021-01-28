varying vec2 v_uv;

uniform float u_time;

float wave (float speed, float amp, float offset) {
  return cos((u_time + offset) * speed) * amp;
}

void main() {
  float wavy = cos( u_time * 1.5 ) * 10.;

  // overflow
  float cropY = 0.8;
  v_uv = vec2( (uv.x * 0.2) + 0.4 , (uv.y * cropY) + (.5 * (1. - cropY)) + wave(1.5, 0.03, 0.) );

  vec3 pos = position;
  pos.x += pos.y * 0.2;
  pos.y += wave(1.5, 15., 0.);

 
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

}