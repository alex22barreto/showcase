let easycam;
let uvShader;
let a,b,c;
let daShade;
function preload() {
  // Define geometry in world space (i.e., matrices: Tree.pmvMatrix).
  // The projection and modelview matrices may be emitted separately
  // (i.e., matrices: Tree.pMatrix | Tree.mvMatrix), which actually
  // leads to the same gl_Position result.
  // Interpolate only texture coordinates (i.e., varyings: Tree.texcoords2).
  // see: https://github.com/VisualComputing/p5.treegl#handling
  uvShader = readShader('uv.frag', {  matrices: Tree.NONE, varyings: Tree.texcoords2 });
}

function setup() {
  createCanvas(300, 300, WEBGL);
  daShade= createGraphics(250,250,WEBGL);
  textureMode(NORMAL);
  // use custom shader
 daShade.shader(uvShader);
 daShade.noStroke();
 daShade.textureMode(NORMAL);
  // use truchetShader to render onto pg
  daShade.shader(uvShader);
  // emitResolution, see:
  // https://github.com/VisualComputing/p5.treegl#macros
  daShade.emitResolution(uvShader);
  texture(daShade);
  daShade.quad(-1, -1, 1, -1, 1, 1, -1, 1);
}

function draw() {
  background(200);
  orbitControl();
  axes();
  push();
  
  a= Math.random() * 300;
  b= Math.random() * 300;
  c=0;
  // world-space quad (i.e., p5 world space definition: https://shorturl.at/dhCK2)
  
  box(20,20);
  ellipse(5, 5, 350, 350);
 
  pop();
  push();
  daShade.shader(uvShader);
  beginShape();
  vertex(30, 20);
  vertex(85, 20);
  vertex(85, 75);
  vertex(30, 75);
  uvShader.setUniform("u_valueX",30);
  uvShader.setUniform("u_valueY",20);
  endShape(CLOSE);
  pop();
}
