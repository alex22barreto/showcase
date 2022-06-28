let easycam;
let uvShader;
let opacity;

function preload() {
  // see: https://github.com/VisualComputing/p5.treegl#handling
  uvShader = readShader('/showcase/sketches/shaders/uv_alpha.frag', { matrices: Tree.pmvMatrix, varyings: Tree.texcoords2 });
}

function setup() {
  createCanvas(300, 300, WEBGL);
  // easycam stuff
  let state = {
    distance: 250,           
    center: [0, 0, 0],       
    rotation: [0, 0, 0, 1],  
  };
  easycam = createEasyCam();
  easycam.state_reset = state;   
  easycam.setState(state, 2000); 
  textureMode(NORMAL);
  opacity = createSlider(0, 1, 0.5, 0.01);
  opacity.position(10, 25);
  opacity.style('width', '280px');
}

function draw() {
  background(200);
  resetShader();
  axes();
  grid();
  translate(0, -70);
  rotateY(0.5);
  fill(color(255, 0, 255, 125));
  box(30, 50);
  translate(70, 70);
  fill(color(0, 255, 255, 125));
  sphere(30, 50);
  shader(uvShader);
  // https://p5js.org/reference/#/p5.Shader/setUniform
  uvShader.setUniform('opacity', opacity.value());
  // see: https://github.com/VisualComputing/p5.treegl#heads-up-display
  beginHUD();
  noStroke();
  quad(0, 0, width, 0, width, height, 0, height);
  endHUD();
}

function mouseWheel(event) {
  return false;
}