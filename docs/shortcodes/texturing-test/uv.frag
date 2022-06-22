//-------------------------------------------------------------
/*precision mediump float;

// the texture coordinates varying was defined in 
// the vertex shader by treegl readShader()
// open your console and & see!
varying vec2 texcoords2;
uniform int v1;
uniform int u_valueX;
uniform int u_valueY;
void main() {
  // glsl swizzling is both handy and elegant
  // see: https://www.khronos.org/opengl/wiki/Data_Type_(GLSL)#Swizzling
  gl_FragColor = vec4(texcoords2, 0.5, 1.0);
}*/
//-------------------------------------------


precision mediump float;
  
// Position in world space
varying vec3 vPosition;
// Position in texture space
varying vec2 texcoords2;

// Ignored
uniform sampler2D uSampler;

void main() {
  // Color based on texture coordinate position
  vec2 st = texcoords2.xy;
  vec4 tex = texture2D(uSampler, texcoords2);

  // Go from red to green on one diagonal and white to black on the other.
  gl_FragColor = tex * 0.0 + vec4(st.y, st.x, (st.x + st.y) / 2., 1.); // R,G,B,A
}

