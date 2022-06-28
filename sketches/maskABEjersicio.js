let maskShader;
let img;
let video_src;
let video_on;
let mask;
let alto = 500;
let radio;

let grey_scale;
let igrey_scale;
let vgrey_scale;
let lgrey_scale;
let hsvgrey_scale;

A=0;
B=0;
C=0;
D=0;
E=1;
F=0;
G=0;
H=0;
I=0;

function preload() {
  video_src = createVideo(['/showcase/sketches/mandrill.webm']);
  video_src.hide(); // by default video shows up in separate dom
  maskShader = readShader('/showcase/sketches/shaders/maskABExample.frag', { varyings: Tree.texcoords2 });
  
  img = loadImage('/showcase/sketches/arboles.jpg');
  //img = loadImage('/showcase/sketches/fire_breathing.png');
  
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
  mask = createCheckbox('Aplicar mascara con los siguientes valores:', true);
  mask.position(10, (alto +70));
  mask.style('color', 'white');
  mask.changed(maskmyCheckedEvent);

  
  shader(maskShader);
  maskShader.setUniform('texture', img);
  emitTexOffset(maskShader, img, 'texOffset');
  radio = createSlider(0, 1, 0.2, 0.05);
  radio.position(10, (alto +50));
  radio.style('width', '280px');
  

  grey_scale = createCheckbox('luma', false);
  grey_scale.position(75, (alto +30));
  grey_scale.style('color', 'white');  
  grey_scale.changed(greymyCheckedEvent);

  igrey_scale = createCheckbox('Promedio', false);
  igrey_scale.position(130, (alto +30));
  igrey_scale.style('color', 'white');  
  igrey_scale.changed(imyCheckedEvent);

  vgrey_scale = createCheckbox('valor V', false);
  vgrey_scale.position(215, (alto +30));
  vgrey_scale.style('color', 'white');  
  vgrey_scale.changed(vmyCheckedEvent);

  lgrey_scale = createCheckbox('luminosidad L', false);
  lgrey_scale.position(285, (alto +30));
  lgrey_scale.style('color', 'white');  
  lgrey_scale.changed(lmyCheckedEvent);

  hsvgrey_scale = createCheckbox('HSV', false);
  hsvgrey_scale.position(400, (alto +30));
  hsvgrey_scale.style('color', 'white');  
  hsvgrey_scale.changed(hsvmyCheckedEvent);
  

  ASlider = createInput(-1);
  ASlider.position(10, (alto +100));
  ASlider.size(60);
  BSlider = createInput(-1);
  BSlider.position(80, (alto +100));
  BSlider.size(60);
  CSlider = createInput(-1);
  CSlider.position(150, (alto +100));
  CSlider.size(60);
  DSlider = createInput(-1);
  DSlider.position(10, (alto +130));
  DSlider.size(60);
  ESlider = createInput(8);
  ESlider.position(80, (alto +130));
  ESlider.size(60);
  FSlider = createInput(-1);
  FSlider.position(150, (alto +130));
  FSlider.size(60);
  GSlider = createInput(-1);
  GSlider.position(10, (alto +160));
  GSlider.size(60);
  HSlider = createInput(-1);
  HSlider.position(80, (alto +160));
  HSlider.size(60);
  ISlider = createInput(-1);
  ISlider.position(150, (alto +160));
  ISlider.size(60);

  button = createButton('Blur');
  button.position(10, (alto +190));
  button.mousePressed(blur);
  button = createButton('Outline');
  button.position(10, (alto +220));
  button.mousePressed(outline);	
  button = createButton('Right Sobel');
  button.position(10, (alto +250));
  button.mousePressed(ritsobel);
  button = createButton('Emboss');
  button.position(10, (alto +280));
  button.mousePressed(emboss);	
  button = createButton('Bottom Sobel');
  button.position(10, (alto +310));
  button.mousePressed(botsob);
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
  
  A = ASlider.value();
  B = BSlider.value();
  C = CSlider.value();
  D = DSlider.value();
  E = ESlider.value();
  F = FSlider.value();
  G = GSlider.value();
  H = HSlider.value();
  I = ISlider.value();
  
  maskShader.setUniform('grey_scale', grey_scale.checked());
  maskShader.setUniform('igrey_scale', igrey_scale.checked());
  maskShader.setUniform('vgrey_scale', vgrey_scale.checked());
  maskShader.setUniform('lgrey_scale', lgrey_scale.checked());
  maskShader.setUniform('hsvgrey_scale', hsvgrey_scale.checked());
  maskShader.setUniform('mascara', mask.checked());


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
    maskShader.setUniform('mask', [A, B, C, D, E, F, G, H, I]);
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

function botsob() {
  A=-1;
  B=-2;
  C=-1;
  D=0;
  E=0;
  F=0;
  G=1;
  H=2;
  I=1;
  ASlider.value(A);
  BSlider.value(B);
  CSlider.value(C);
  DSlider.value(D);
  ESlider.value(E);
  FSlider.value(F);
  GSlider.value(G);
  HSlider.value(H);
  ISlider.value(I);
}
function outline() {
  A=-5;
  B=4;
  C=0;
  D=0;
  E=2;
  F=0;
  G=0;
  H=-1;
  I=0;
  ASlider.value(A);
  BSlider.value(B);
  CSlider.value(C);
  DSlider.value(D);
  ESlider.value(E);
  FSlider.value(F);
  GSlider.value(G);
  HSlider.value(H);
  ISlider.value(I);
}

function blur() {
  
  A=0.0625;
  B=0.125;
  C=0.0625;
  D=0.125;
  E=0.25;
  F=0.125;
  G=0.0625;
  H=0.125;
  I=0.0625;
  ASlider.value(A);
  BSlider.value(B);
  CSlider.value(C);
  DSlider.value(D);
  ESlider.value(E);
  FSlider.value(F);
  GSlider.value(G);
  HSlider.value(H);
  ISlider.value(I);
}

function ritsobel(){
  A=-32;  
  B=50;
  C=45;
  D=-81;
  E=63;
  F=68;
  G=-68;
  H=59;
  I=59;
  ASlider.value(A);
  BSlider.value(B);
  CSlider.value(C);
  DSlider.value(D);
  ESlider.value(E);
  FSlider.value(F);
  GSlider.value(G);
  HSlider.value(H);
  ISlider.value(I);
}
 
function emboss(){
  A=-1.8;
  B=-1;
  C=0;
  D=-1;
  E=1.5;
  F= 1.5;
  G=0.1;
  H=1.5;
  I=2.5;
  ASlider.value(A);
  BSlider.value(B);
  CSlider.value(C);
  DSlider.value(D);
  ESlider.value(E);
  FSlider.value(F);
  GSlider.value(G);
  HSlider.value(H);
  ISlider.value(I);

  
}

function maskmyCheckedEvent() {
  
  if (mask.checked()) {
    grey_scale.checked(false);
    igrey_scale.checked(false);
    vgrey_scale.checked(false);
    lgrey_scale.checked(false);
    hsvgrey_scale.checked(false);
    console.log('mascara!');
  } 
}

function greymyCheckedEvent() {
  
   if (grey_scale.checked()){
    mask.checked(false);
    igrey_scale.checked(false);
    vgrey_scale.checked(false);
    lgrey_scale.checked(false);
    hsvgrey_scale.checked(false);
    console.log('grey_scale!');
  }
}

function imyCheckedEvent() {
  if (igrey_scale.checked()){
    mask.checked(false);
    grey_scale.checked(false);
    vgrey_scale.checked(false);
    lgrey_scale.checked(false);
    hsvgrey_scale.checked(false);
    console.log('igrey_scale!');
  }
}

function vmyCheckedEvent() {
  if (vgrey_scale.checked()){
    mask.checked(false);
    grey_scale.checked(false);
    igrey_scale.checked(false);
    lgrey_scale.checked(false);
    hsvgrey_scale.checked(false);
    console.log('vgrey_scale!');
  }
}

function lmyCheckedEvent() {
   if (lgrey_scale.checked()){
    mask.checked(false);
    grey_scale.checked(false);
    igrey_scale.checked(false);
    vgrey_scale.checked(false);
    hsvgrey_scale.checked(false);
    console.log('lgrey_scale!');
  }
}

function hsvmyCheckedEvent() {
  if (hsvgrey_scale.checked()){
    mask.checked(false);
    grey_scale.checked(false);
    igrey_scale.checked(false);
    vgrey_scale.checked(false);
    lgrey_scale.checked(false);
    console.log('hsvgrey_scale!');
  }
}