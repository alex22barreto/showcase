let maskShader;
let img;
let video_src;
let video_on;
let mask;
let w = 80;


function preload() {
  video_src = createVideo(['/showcase/sketches/mandrill.webm']);
  video_src.hide(); // by default video shows up in separate dom
  maskShader = readShader('/showcase/sketches/shaders/maskAB.frag', { varyings: Tree.texcoords2 });
  
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
  mask = createCheckbox('ridges', false);
  mask.position(10, 10);
  mask.style('color', 'white');
  shader(maskShader);
  maskShader.setUniform('texture', img);
  emitTexOffset(maskShader, img, 'texOffset');
}

function draw() {
  background(0);
  // /*

  const xstart = constrain((mouseX - width/2) - w/2, 0, width);
  const ystart = constrain((mouseY - height/2) - w/2, 0, height);
  const xend = constrain((mouseX - width/2) + w/2, 0, width);
  const yend = constrain((mouseY - height/2) + w/2, 0, height);


  console.log("xstart " +xstart);
  console.log("ystart "+ystart);
  console.log("xend "+xend);
  console.log("yend "+yend);

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