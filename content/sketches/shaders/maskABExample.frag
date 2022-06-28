precision mediump float;

uniform sampler2D texture;
uniform vec2 texOffset;
// holds the 3x3 kernel
uniform float mask[9];
uniform float maskDefault[9];

uniform float radio;
uniform float mouse_position_x;
uniform float mouse_position_y;
uniform bool grey_scale;
uniform bool igrey_scale;
uniform bool vgrey_scale;
uniform bool lgrey_scale;
uniform bool hsvgrey_scale;
uniform bool mascara;

// we need our interpolated tex coord
varying vec2 texcoords2;

// returns luma of given texel
// Codigo tomado de https://visualcomputing.github.io/docs/shaders/texturing/#texture-sampling
float luma(vec3 texel) {
  return 0.299 * texel.r + 0.587 * texel.g + 0.114 * texel.b;
}

// returns the color HSV
// Codigo tomado de http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

// insperado en las ecuaciones de luminicidad presentadas en 
// https://en.wikipedia.org/wiki/HSL_and_HSV#:~:text=of%20about%2013.4%25.-,Lightness,-%5Bedit%5D

float Irgb(vec3 texel) {
  return (texel.r + texel.g + texel.b)/3.0;
}

float Vhsv(vec3 texel) {
  float M =0.0;
  if(texel.r>M){
    M=texel.r;
  }
  if(texel.g>M){
    M=texel.g;
  }
  if(texel.b>M){
    M=texel.b;
  }
  return M;
}

float Lhsl(vec3 texel) {
  float M =0.0;
  if(texel.r>M){
    M=texel.r;
  }
  if(texel.g>M){
    M=texel.g;
  }
  if(texel.b>M){
    M=texel.b;
  }

  float min =255.0;
  if(texel.r<min){
    min=texel.r;
  }
  if(texel.g<min){
    min=texel.g;
  }
  if(texel.b<min){
    min=texel.b;
  }

  return (M + min)/2.0;
}

void main() {

  vec2 st = vec2(mouse_position_x,mouse_position_y);
  
  float pct = 0.0;

  pct = distance(st,texcoords2);

  

  
    // 1. Use offset to move along texture space.
  // In this case to find the texcoords of the texel neighbours.
  vec2 tc0 = texcoords2 + vec2(-texOffset.s, -texOffset.t);
  vec2 tc1 = texcoords2 + vec2(         0.0, -texOffset.t);
  vec2 tc2 = texcoords2 + vec2(+texOffset.s, -texOffset.t);
  vec2 tc3 = texcoords2 + vec2(-texOffset.s,          0.0);
  // origin (current fragment texcoords)
  vec2 tc4 = texcoords2 + vec2(         0.0,          0.0);
  vec2 tc5 = texcoords2 + vec2(+texOffset.s,          0.0);
  vec2 tc6 = texcoords2 + vec2(-texOffset.s, +texOffset.t);
  vec2 tc7 = texcoords2 + vec2(         0.0, +texOffset.t);
  vec2 tc8 = texcoords2 + vec2(+texOffset.s, +texOffset.t);


  // 2. Sample texel neighbours within the rgba array
  vec4 rgba[9];
  rgba[0] = texture2D(texture, tc0);
  rgba[1] = texture2D(texture, tc1);
  rgba[2] = texture2D(texture, tc2);
  rgba[3] = texture2D(texture, tc3);
  rgba[4] = texture2D(texture, tc4);
  rgba[5] = texture2D(texture, tc5);
  rgba[6] = texture2D(texture, tc6);
  rgba[7] = texture2D(texture, tc7);
  rgba[8] = texture2D(texture, tc8);

  // 3. Apply convolution kernel
  vec4 convolution;
if(pct<radio){
  vec4 texel = texture2D(texture, texcoords2);
  if(grey_scale){    
    convolution += vec4(vec3(luma(texel.rgb)), 1.0);
  }
  else if(igrey_scale){
    convolution += vec4(vec3(Irgb(texel.rgb)), 1.0);
  }
  else if(vgrey_scale){
    convolution += vec4(vec3(Vhsv(texel.rgb)), 1.0);
  }
  else if(lgrey_scale){
    convolution += vec4(vec3(Lhsl(texel.rgb)), 1.0);
  }
  else if(hsvgrey_scale){
    convolution += vec4(rgb2hsv(texel.rgb), 1.0);
  }
  else if(mascara){
    for (int i = 0; i < 9; i++) {
      convolution += rgba[i]*mask[i];
    }
  }
  else
  {
    for (int i = 0; i < 9; i++) {
      convolution += rgba[i]*maskDefault[i];
    }
  }
  
  
  
  
  
}
else
{
  for (int i = 0; i < 9; i++) {
    convolution += rgba[i]*maskDefault[i];
  }
}
  // 4. Set color from convolution
  gl_FragColor = vec4(convolution.rgb, 1.0); 
  
  
}