let maskShader;
let img;
let video_src;
let video_on;
let mask;
let w = 80;
let radio;
let alto = 500;

function preload() {
  video_src = createVideo(['/showcase/sketches/mandrill.webm']);
  video_src.hide(); // by default video shows up in separate dom
  maskShader = readShader('/showcase/sketches/shaders/maskABLupa.frag', { varyings: Tree.texcoords2 });
  
  img = loadImage('/showcase/sketches/arboles.jpg');
  
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(650, alto, WEBGL);
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
  video_on.position(10, (alto +30));
  mask = createCheckbox('ridges', false);
  mask.position(10, (alto +10));
  mask.style('color', 'white');
  shader(maskShader);
  maskShader.setUniform('texture', img);
  emitTexOffset(maskShader, img, 'texOffset');

  radio = createSlider(0, 1, 0.2, 0.05);
  radio.position(10, (alto +50));
  radio.style('width', '280px');

}

function draw() {
  background(0);
  // /*

  maskShader.setUniform('radius', radio.value()); 

  maskShader.setUniform('mouse_position_x', ((mouseX * pixelDensity())/width)); 
  maskShader.setUniform('mouse_position_y', (((mouseY) * pixelDensity())/height)); 

  maskShader.setUniform('mouse_pointer_x', (mouseX * pixelDensity())); 
  maskShader.setUniform('mouse_pointer_y', ((height - mouseY) * pixelDensity())); 

  maskShader.setUniform('mouse_resolution_x', (width * pixelDensity())); 
  maskShader.setUniform('mouse_resolution_y', (height * pixelDensity())); 

  //emitPointerPosition(maskShader, pointerX, pointerY, [uniform = 'u_pointer'])
  
  if (mask.checked()) {
    //maskShader.setUniform('mask', [1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9]);
    maskShader.setUniform('mask', [-1, -1, -1, -1, 8, -1, -1, -1, -1]);
    //maskShader.setUniform('mask', [0, -1, 0, -1, 5, -1, 0, -1, 0]);
  }
  else {
    maskShader.setUniform('mask', [0, 0, 0, 0, 1, 0, 0, 0, 0]);
  }
  quad(-width / 2, -height / 2, width / 2, -height / 2, width / 2, height / 2, -width / 2, height / 2);
  /*
  push();
  noStroke();
  quad(-width / 2, -height / 2, width / 2, -height / 2, width / 2, height / 2, -width / 2, height / 2);
  pop();
  */
  // */
  //quad(-width / 2, -height / 2, width / 2, -height / 2, width / 2, height / 2, -width / 2, height / 2);
}