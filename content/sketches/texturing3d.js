let easycam;
let uvShader;
let colorR;

function preload() {
  // see: https://github.com/VisualComputing/p5.treegl#handling
  uvShader = readShader('/showcase/sketches/shaders/uv.frag', { matrices: Tree.pmvMatrix, varyings: Tree.texcoords2 });
}

function setup() {
  createCanvas(300, 300, WEBGL);
  textureMode(NORMAL);
  // use custom shader
  shader(uvShader);
  colorR = createSlider(0, 1, 0.5, 0.01);
  colorR.position(10, 25);
  colorR.style('width', '280px');
}


function draw() {
  
  uvShader.setUniform('colorR', colorR.value());
  background(200);
  orbitControl();
  axes();
  push();
  noStroke();
  quad(-width / 2, -height / 2, width / 2, -height / 2, width / 2, height / 2, -width / 2, height / 2);
  pop();
}

function mouseWheel(event) {
  return false;
}
