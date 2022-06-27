let pg;
let truchetShader;
let colorer;
let colorer2;
let styler;
let gameStarted = false;
function preload() {
  truchetShader = readShader('truchet.frag', { matrices: Tree.NONE, varyings: Tree.NONE });
}

function setup() {
  colorer = Math.random() * 1.5;
  colorer2 =  Math.random() * 1.5;
  truchetShader.setUniform('v1', colorer);
  truchetShader.setUniform('v2', colorer2);
  createCanvas(600, 600, WEBGL);
  // create frame buffer object to render the procedural texture
  pg = createGraphics(400, 400, WEBGL);
  textureMode(NORMAL);
  noStroke();
  pg.noStroke();
  pg.textureMode(NORMAL);
  // use truchetShader to render onto pg
  pg.shader(truchetShader);
  // emitResolution, see:
  // https://github.com/VisualComputing/p5.treegl#macros
  pg.emitResolution(truchetShader);
  // https://p5js.org/reference/#/p5.Shader/setUniform
  tiling = createSlider(0, 10, 1, 0.05);
  tiling.position(10, 30);
  tiling.style("width", "280px");
  tiling2 = createSlider(3.14, 10, 3.14, 0.05);
  tiling2.position(10, 45);
  tiling2.style("width", "280px");
  truchetShader.setUniform('u_zoom', 3);
  // pg clip-space quad (i.e., both x and y vertex coordinates ∈ [-1..1])
  pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
  // set pg as texture
  texture(pg);
  option = createSelect();
  option.position(10, 10);
  option.option("Donut", 0);
  option.option("Cube", 1);
  option.option("Sphere", 2);
  option.option("Cone", 3);
  option.option("Cylinder", 4);
  option2 = createSelect();
  option2.position(400, 10);
  option2.option("Style 1", 0);
  option2.option("Style 2", 1);
  option2.option("Style 3", 2);
  option2.option("Style 4", 3);
  option2.option("Style 5", 4);
  
}

function draw() {
  background(120);
  orbitControl();
  if(option2.value()==0){
    styler=0;
    truchetShader.setUniform('option',styler);
  }else if(option2.value()==1){
    styler=1;
    truchetShader.setUniform('option',styler);
    truchetShader.setUniform('u_rotater', tiling2.value(4));
  }else if(option2.value()==2){
    styler=2;
    truchetShader.setUniform('option',styler);
  }else if(option2.value()==3){
    styler=3;
    truchetShader.setUniform('option',styler);
  }else if(option2.value()==4){
    styler=4;
    truchetShader.setUniform('option',styler);
  }
  if(option.value()==0){
    torus(100, 50);
  }else if(option.value()==1){
    box(200, 200);
  }else if(option.value()==2){
    sphere(100, 100);
  }else if(option.value()==3){
    cone(100, 200);
  }else if(option.value()==4){
    cylinder(100, 200);
  }
 
  truchetShader.setUniform('u_zoom', tiling.value());
  truchetShader.setUniform('u_rotater', tiling2.value());
  print(tiling2.value());
  // pg clip-space quad (i.e., both x and y vertex coordinates ∈ [-1..1])
  pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
  if(frameCount%60==0){
    truchetShader.setUniform('u_time', frameCount/60);
   
  }
}
