const vert = `#ifdef GL_ES
precision mediump float;
#endif

// =====================================
// Built in p5js uniforms and attributes
// =====================================

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

attribute vec3 aPosition;    // Vertex position
attribute vec2 aTexCoord;    // Vertex texture coordinate
attribute vec3 aNormal;      // Vertex normal
attribute vec4 aVertexColor; // Vertex color

// =====================================

varying vec3 vPosition;
varying vec2 vTexCoord;

void main() {

  // Store the vertex position for use in the fragment shader
  vPosition = aPosition;
  vTexCoord = aTexCoord;

  // Set the vertex position without any change besides the view transformations
  // Note: it is important to apply these matrices to get your shape to render in the correct location
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
}`;

const frag = `#ifdef GL_ES
precision mediump float;
#endif
  
// Position in world space
varying vec3 vPosition;
// Position in texture space
varying vec2 vTexCoord;

// Ignored
uniform sampler2D uSampler;

void main() {
  // Color based on texture coordinate position
  vec2 st = vTexCoord.xy;
  vec4 tex = texture2D(uSampler, vTexCoord);

  // Go from red to green on one diagonal and white to black on the other.
  gl_FragColor =vec4(vTexCoord, 0.5, 1.0);; // R,G,B,A
}`;

let shdr;

function setup() {
  createCanvas(400, 400, WEBGL);
  shdr = createShader(vert, frag);
  textureMode(NORMAL);
  noStroke();
}

function draw() {
  background(255);
  axes();
  shader(shdr);
  orbitControl(4, 2, 0.1);
  beginShape();
  //Triangulo 2d
  normal(2, 1, 1);
  //Cara 1  
  vertex(0, 10,0,-0.5);
  vertex(100, 10,0,3.5);
  vertex(50, -100,-25,0);  
  vertex(0, 10,0,0)
  vertex(50,10,-100,1)  
  vertex(50, -100,-25,1);  
  vertex(50,10,-100);
  vertex(100, 10,0,1);  
  endShape();
  
}