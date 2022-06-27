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
uniform float colorR,colorA,colorG;
uniform int option;
// Ignored
uniform sampler2D uSampler;

void main() {
  // Color based on texture coordinate position
  vec2 st = vTexCoord.xy;
  vec4 tex = texture2D(uSampler, vTexCoord);

  // Go from red to green on one diagonal and white to black on the other.
  if(option == 0){gl_FragColor =vec4(colorR,vTexCoord.xy,1.0);;}
  if(option == 1){gl_FragColor =vec4(vTexCoord.xy,colorR,1.0);;}
  if(option == 2){gl_FragColor =vec4(colorR,colorG,colorA,1.0);;} // R,G,B,A
}`;
let valX=4,valY=2,valZ=0.1;
let camopt=true;
let shdr;
let pos1=0,pos2=10,pos3=100,pos4=10,pos5=50,pos6=-100;
function setup() {
  button = createButton("Randomize");
  button.mousePressed(changeCoords);
  button.position(10,470);
  button2 = createButton("Enable / Disable Cam");
  button2.mousePressed(changeCam);
  button2.position(330,460);
  createCanvas(470, 470, WEBGL);
  shdr = createShader(vert, frag);
  textureMode(NORMAL);
  noStroke();
  colorR = createSlider(0,1 , 0.05, 0.01);
  colorR.position(10, 25);
  colorR.style('width', '280px');
  colorA = createSlider(0, 1, 0.05, 0.01);
  colorA.position(10, 45);
  colorA.style('width', '280px');
  colorG = createSlider(0, 1, 0.05, 0.01);
  colorG.position(10, 65);
  colorG.style('width', '280px');
  option = createSelect();
  option.position(10, 450);
  option.option("Blue/ Red", 0);
  option.option("Green / Blue", 1);
  option.option("Coloring", 2);
}
function changeCam(){
  camopt=!camopt;
  print (camopt);
  if(camopt){
    valX=4;valY=2;valZ=0.1;
  }
  else{
    valX=0;valY=0;valZ=0;
  }
}
function changeCoords(){
  pos1=random(-250,250);
  pos2=random(-250,250);
  pos3=random(-250,250);
  pos4=random(-250,250);
  pos5=random(-250,250);
  pos6=random(-250,250);

}

function draw() {
  background(255);
  shader(shdr);
  orbitControl(valX, valY, valZ);
  if(option.value()==0){
    styler=0;
    shdr.setUniform('option',styler);
  }else if(option.value()==1){
    styler=1;
    shdr.setUniform('option',styler);
  }else if(option.value()==2){
    styler=2;
    shdr.setUniform('option',styler);
  }
  shdr.setUniform('colorR', colorR.value());
  shdr.setUniform('colorA', colorA.value());
  shdr.setUniform('colorG', colorG.value());
  beginShape();
  //Triangulo 2d
  normal(2, 1, 1);
  //Cara 1  
  vertex(pos1, pos2,0,-0.5);
  vertex(pos3, pos4,0,3.5);
  vertex(pos5, pos6,0,0);  
  endShape();
  
}
