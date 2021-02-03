varying vec2 v_uv;

uniform sampler2D u_map;
uniform vec3 u_colorAmount;

void main() {
	vec4 map = texture2D(u_map, v_uv );
	vec3 colorAmount = u_colorAmount;


	float r = mix(0., 1., colorAmount.r);
	float g = mix(0., 1., colorAmount.g);
	float b = mix(0., 1., colorAmount.b);


	vec3 finalColor = vec3(map.r * r, map.g * g, map.b * b);


	gl_FragColor = vec4(finalColor, 1.0);
}