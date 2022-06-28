let pg;
let truchetShader;

let mask;

function preload() {
  // shader adapted from here: https://thebookofshaders.com/09/
  truchetShader = readShader('/showcase/sketches/shaders/truchetABLadrillo.frag', { matrices: Tree.NONE, varyings: Tree.NONE });
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

  mask = createCheckbox('Generar Textura', true);
  mask.position(10, (440));
  mask.style('color', 'white');
}

function draw() {

  background(33);
  orbitControl();
  box(200, 200); 

  if(frameCount%25==0 && mask.checked()){
    truchetShader.setUniform('u_time', frameCount/50);   
    
  }
  
  truchetShader.setUniform('u_zoom', int(map(mouseX, 0, width, 1, 30)));
  truchetShader.setUniform('u_rotater', (mouseY - height/2)/50);
  pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
  
}

