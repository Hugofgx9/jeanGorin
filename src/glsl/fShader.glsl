varying vec2 v_uv;

uniform sampler2D u_map;
uniform float u_colorAmount;

void main() {
	vec4 map = texture2D(u_map, v_uv );
	float colorAmount = u_colorAmount;

	vec3 finalColor = vec3(
		1. - colorAmount * (1. - map.r), 
		1. - colorAmount * (1. - map.g), 
		1. - colorAmount * (1. - map.b)
	);
	

	gl_FragColor = vec4(finalColor, 1.0);
}