let maskShader;
let img;
let video_src;
let video_on;
let mask;
let w = 80;
let radio;

function preload() {
  video_src = createVideo(['/showcase/sketches/mandrill.webm']);
  video_src.hide(); // by default video shows up in separate dom
  maskShader = readShader('/showcase/sketches/shaders/maskABExample.frag', { varyings: Tree.texcoords2 });
  
  img = loadImage('/showcase/sketches/arboles.jpg');
  
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
  mask = createCheckbox('ridges', true);
  mask.position(10, 10);
  mask.style('color', 'white');
  shader(maskShader);
  maskShader.setUniform('texture', img);
  emitTexOffset(maskShader, img, 'texOffset');
  emitMousePosition(maskShader, 'u_mouse')
  radio = createSlider(0, 1, 0.2, 0.05);
  radio.position(10, 50);
  radio.style('width', '280px');
}

function draw() {
  background(0);
  // /*
  maskShader.setUniform('maskDefault', [0, 0, 0, 0, 1, 0, 0, 0, 0]);
  const x_mouse = parseFloat((mouseX * pixelDensity())/width);
  const y_mouse = parseFloat(((mouseY) * pixelDensity())/height);

  maskShader.setUniform('radio', radio.value()); 

  maskShader.setUniform('mouse_position_x', x_mouse); 
  maskShader.setUniform('mouse_position_y', y_mouse); 
  
  video_on.changed(() => {
    if (video_on.checked()) {
      maskShader.setUniform('texture', video_src);
      video_src.loop();
    } else {
      maskShader.setUniform('texture', img);
      video_src.pause();
    }
  });

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