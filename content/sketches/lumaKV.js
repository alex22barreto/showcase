let lumaShader;
let img;
let grey_scale;

function preload() {
  lumaShader = readShader('luma.frag', { varyings: Tree.texcoords2 });
  // image source: https://en.wikipedia.org/wiki/HSL_and_HSV#/media/File:Fire_breathing_2_Luc_Viatour.jpg
  img = loadImage('./planeta.jpg');
}

function setup() {
  createCanvas(690, 490, WEBGL);
  noStroke();
  textureMode(NORMAL);
  option = createSelect();
  option.position(10, 10);
  option.option("None", 0);
  option.option("Luma", 1);
  option.option("HSV", 2);
  option.option("HSL", 3);
  shader(lumaShader);
  lumaShader.setUniform('texture', img);
}

function draw() {
  background(0);
  if (option.value() ==0){
    lumaShader.setUniform('chaval', 0); 
  }
  else if (option.value() ==1){
    lumaShader.setUniform('chaval', 1); 
  }else if (option.value() ==2){
    lumaShader.setUniform('chaval', 2); 
  }else if (option.value() ==3){
    lumaShader.setUniform('chaval', 3); 
  }
  quad(-width / 2, -height / 2, width / 2, -height / 2, width / 2, height / 2, -width / 2, height / 2);
}