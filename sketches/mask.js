/*Testing*/

/*Testing*/

let maskShader;
let img;
let video_src;
let video_on;
let mask;

function preload() {
  video_src = createVideo(['mandrill.webm']);
  video_src.hide(); // by default video shows up in separate dom
  maskShader = readShader('mask.frag', { varyings: Tree.texcoords2 });
  img = loadImage('ojos.jpg');
 
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(650, 500, WEBGL);
  noStroke();
  textureMode(NORMAL);
  video_on = createCheckbox('video', false);
  video_on.style('color', 'white');
  
  video_on.changed(() => {
    if (video_on.checked()) {
      maskShader.setUniform('texture', video_src);
      video_src.loop();
    } else {
      maskShader.setUniform('texture', img);
      video_src.pause();
    }
  });
  video_on.position(10, 10);
  //Adding kernel options
  option = createSelect();
  option.position(520, 10);
  option.option("None", 0);
  option.option("Blue", 1);
  option.option("Ridge", 2);
  option.option("Bottom Sobel", 3);
  option.option("Emboss", 4);
  

  shader(maskShader);
  maskShader.setUniform('texture', img);
  emitTexOffset(maskShader, img, 'texOffset');
}

function draw() {
  background(0);
  // /*
  if (option.value()==0) {
    maskShader.setUniform('mask', [0, 0, 0, 0, 1, 0, 0, 0, 0]);
  }
  else if (option.value()==1) {
    maskShader.setUniform('mask', [0.0625, 0.125, 0.0625, 0.125, 0.25, 0.125, 0.0625, 0.125, 0.0625]);
  }
  else if (option.value()==2) {
    maskShader.setUniform('mask', [-2, -1, 0, -1, 1, 1, 0, 1, 2]);
  }
  else if (option.value()==3) {
    maskShader.setUniform('mask', [-1, -2, -1, 0, 0, 0, 1, 2, 1]);
  }
  else if (option.value()==4) {
    maskShader.setUniform('mask', [-1, -1, -1, -1, 8, -1, -1, -1, -1]);
  }
  
  quad(-width / 2, -height / 2, width / 2, -height / 2, width / 2, height / 2, -width / 2, height / 2);
  push();
  // Origin X Y,taking size, Destination, Destination SIZE 
  copy( mouseX - width/2, mouseY - height/2, 50, 50, mouseX - width/2, mouseY - height/2, 100, 100);
  stroke(255,0,0);
  noFill();
  // Rectangle shows area being copied
  rect(mouseX - width/2, mouseY - height/2, 100, 100);
  pop(); 
}