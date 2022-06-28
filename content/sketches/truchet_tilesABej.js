let pg;
let truchetShader;

function preload() {
  // shader adapted from here: https://thebookofshaders.com/09/
  truchetShader = readShader('/showcase/sketches/shaders/truchetABej.frag', { matrices: Tree.NONE, varyings: Tree.NONE });
}

function setup() {
  createCanvas(400, 400, WEBGL);
  
  pg = createGraphics(400, 400, WEBGL);
  textureMode(NORMAL);
  noStroke();
  pg.noStroke();
  pg.textureMode(NORMAL);
  

  pg.shader(truchetShader);
  
  pg.emitResolution(truchetShader);
  
  truchetShader.setUniform('u_zoom', 3);
  
  pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
  
  texture(pg);
}

function draw() {
  background(33);
  orbitControl();
  sphere(100, 100);  
}

function mouseMoved() {
  
  truchetShader.setUniform('u_zoom', int(map(mouseX, 0, width, 1, 30)));
  truchetShader.setUniform('u_rotater', (mouseY - height/2)/50);
  
  pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
}