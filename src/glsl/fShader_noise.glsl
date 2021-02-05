uniform float u_time;
uniform sampler2D tDiffuse;
varying vec2 v_uv;

float random( vec2 p )
{
  vec2 K1 = vec2(
    23.14069263277926, // e^pi (Gelfond's constant)
    2.665144142690225 // 2^sqrt(2) (Gelfond–Schneider constant)
  );
return fract( cos( dot(p,K1) ) * 12345.6789 );
}

void main() {
  vec4 color = texture2D( tDiffuse, v_uv );
  vec2 uvRandom = v_uv;
  uvRandom.y *= random(vec2(uvRandom.y,u_time * 10000.));
  color.rgb += random(uvRandom)*0.15;

  gl_FragColor = vec4( color );
}