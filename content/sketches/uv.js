let uvShader;
let colorR;

function preload() {
  // Define geometry directly in clip space (i.e., matrices: Tree.NONE).
  // Interpolate only texture coordinates (i.e., varyings: Tree.texcoords2).
  // see: https://github.com/VisualComputing/p5.treegl#handling

  uvShader = readShader('/showcase/sketches/shaders/uv.frag', { matrices: Tree.NONE, varyings: Tree.texcoords2 });

}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(300, 300, WEBGL);
  //noStroke();
  // see: https://p5js.org/reference/#/p5/shader
  shader(uvShader);
  // https://p5js.org/reference/#/p5/textureMode
  // best and simplest is to just always used NORMAL
  textureMode(NORMAL);
  colorR = createSlider(0, 1, 0.5, 0.01);
  colorR.position(10, 25);
  colorR.style('width', '280px');
}

function draw() {
  background(0);
  // clip-space quad (i.e., both x and y vertex coordinates ∈ [-1..1])
  // https://p5js.org/reference/#/p5/quad
  // It's worth noting (not mentioned in the api docs) that the quad
  // command also adds the texture coordinates to each of its vertices.
  
  
  uvShader.setUniform('colorR', colorR.value());
  quad(-1, -1, 1, -1, 1, 1, -1, 1);

}