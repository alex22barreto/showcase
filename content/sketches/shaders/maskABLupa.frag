precision mediump float;

uniform sampler2D texture;
uniform vec2 texOffset;
uniform vec2 u_pointer;
// holds the 3x3 kernel
uniform float mask[9];

uniform float radius;
uniform float mouse_position_x;
uniform float mouse_position_y;
uniform float mouse_pointer_x;
uniform float mouse_pointer_y;
uniform float mouse_resolution_x;
uniform float mouse_resolution_y;
// we need our interpolated tex coord
varying vec2 texcoords2;

void main() {

  //vec2 coordxy = u_pointer;
  vec2 coordxy = vec2(mouse_pointer_x,mouse_pointer_y);
  vec2 resolutionxy = vec2(mouse_resolution_x,mouse_resolution_y);
  vec2 mousexy = vec2(mouse_position_x,mouse_position_y);

  vec2 uv = coordxy/resolutionxy;
	vec2 center = mousexy/resolutionxy;

  float depth=radius/2.;

  float ax = ((uv.x - center.x) * (uv.x - center.x)) / (0.2*0.2) + ((uv.y - center.y) * (uv.y - center.y)) / (0.2/ (  mouse_resolution_x / mouse_resolution_y )) ;
	float dx = 0.0 + (-depth/radius)*ax + (depth/(radius*radius))*ax*ax;
  float f =  (ax + dx );

  if (ax > radius){
    f = ax;
  } 

  vec2 magnifierArea = center + (uv-center)*f/ax;

  //gl_FragColor = vec4(texture2D( texture, texcoords2 ).rgb, 1.); 
  //gl_FragColor = vec4(texture2D( texture, texcoords2 ).rgb, 1.); 
  //gl_FragColor = vec4(texture2D( texture, vec2(1,-1) * magnifierArea ).rgb, 1.); 
  gl_FragColor = vec4(texture2D( texture,  texcoords2 ).rgb, 1.); 
}