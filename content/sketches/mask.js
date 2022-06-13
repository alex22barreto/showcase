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
  video_on.position(10, 30);
  //Adding kernels Checkboxes
  mask = createCheckbox('Ridges', false);
  mask.position(10, 10);
  mask.style('color', 'white');
  //Blur
  mask2 = createCheckbox('Blur', false);
  mask2.position(80, 10);
  mask2.style('color', 'white');
  //Bottom Sobel
  mask3 = createCheckbox('Bottom Sobel', false);
  mask3.position(80, 30);
  mask3.style('color', 'white');
  //Emboss
  mask4 = createCheckbox('Emboss', false);
  mask4.position(140, 10);
  mask4.style('color', 'white');
  //Checkboxes above
  shader(maskShader);
  maskShader.setUniform('texture', img);
  emitTexOffset(maskShader, img, 'texOffset');
}

function draw() {
  background(0);
  // /*
  if (mask2.checked()) {
    maskShader.setUniform('mask', [0.0625, 0.125, 0.0625, 0.125, 0.25, 0.125, 0.0625, 0.125, 0.0625]);
  }
  else if (mask4.checked()) {
    maskShader.setUniform('mask', [-2, -1, 0, -1, 1, 1, 0, 1, 2]);
  }
  else if (mask3.checked()) {
    maskShader.setUniform('mask', [-1, -2, -1, 0, 0, 0, 1, 2, 1]);
  }
  else if (mask.checked()) {
    maskShader.setUniform('mask', [-1, -1, -1, -1, 8, -1, -1, -1, -1]);
  }
  else {
    maskShader.setUniform('mask', [0, 0, 0, 0, 1, 0, 0, 0, 0]);
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