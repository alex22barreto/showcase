
let toggle_3d_gui;
let auto_rotate;
// select
let mode;
// 3d gui
let color1;
let color2;
let gameStarted = false;
// Brush controls
let color;
let depth;
let brush;
let escorzo;
let points;
let record;

//Cam Controls
let easycam;
let state;

let raster;
let toRast=true;
let foreshortening = false;

// bulls shape
let circled = false;

// resume animation
let frames = 0;

// spaces
let sphere1;
let sphere2;

let input;
let img2;
let img;

function handleFile(file) {
  print(file);
  if (file.type === 'image') {
    img2 = loadImage(file.data, '');
    img2.hide();
  } else {
    img2 = null;
  }
}

function setup() {
  button = createButton("Start Your Drawing");
  button.mousePressed(() => gameStarted = !gameStarted
  );
  button.position(650,500)
  input = createFileInput(handleFile);
  input.position(0, 500);
  createCanvas(700, 510, WEBGL);
  if(img2!=null){
    img=img2;
  }
  else {
    img = loadImage("/showcase/sketches/skulltest.jpg");
    
  }
  TileSlider = createSlider(5, 200, 50, 1);
  TileSlider.position(20, 50);
  textureMode(NORMAL);
  raster = createCheckbox('Toggle Raster',true);
  raster.style('color', 'black');
  raster.position(590, 10);
  raster.changed(myCheckedEvent);
  toggle_3d_gui = createCheckbox('Toggle 3d Gui', true);
  toggle_3d_gui.style('color', 'black');
  toggle_3d_gui.position(10, 10);
  toggle_3d_gui.changed(() => {
    if (toggle_3d_gui.checked()) {
      color1.show();
      color2.show();
    }
    else {
      color1.hide();
      color2.hide();
    }
  });
  color1 = createColorPicker('cyan');
  color2 = createColorPicker("#000000");
  easycam = createEasyCam();
  let state = {
    distance: 450,           // scalar
    center: [0, 0, 0],       // vector
    rotation: [0, 0, 0, -1],  // quaternion
  };
  easycam.setState(state, 1000);
  escorzo = true;
  perspective();

  // brush stuff
  points = [];
  depth = createSlider(0,1 ,0.01, 0.05);
  depth.position(5, 480);
  depth.style('width', '580px');
  color = createColorPicker('#ed225d');
  color.position(width - 70, 40);
  // select initial brush
  brush = sphereBrush;
}

function draw() {
  if (gameStarted) {
    update();
  background(color1.color());
  push();
  strokeWeight(0.8);
  stroke('magenta');
  grid({ dotted: false });
  pop();
  for (const point of points) {
    push();
    translate(point.worldPosition);
    brush(point);
    pop();
  }
  fill(color2.color());
  noStroke();
  tiles =  TileSlider.value();;
  tileSize = width/tiles;
  scale(0.5) 
  if(img2 != null){
    img=img2;
  } 
  if (img && toRast) {
    for (x = 0; x < tiles; x++) {
      for (y = 0; y < tiles; y++) {
        c = img.get(int(x*tileSize),int(y*tileSize));
        b = map(brightness(c),0,255,1,0);
        z = map(b,0,1,-150,150);
        push();
        translate(x*tileSize - width/2, y*tileSize - height/2, z);
        sphere(tileSize*b*0.8);
        pop();
      }
    }
  }
  push();
  translate(tiles/2*tileSize - width/2, tiles/2*tileSize - height/2);
  sphere1 = mMatrix();
  axes(30);
  noStroke();
  fill(color1.color());
  sphere(15);
  pop();
  push();
  translate(1*tileSize - width/2+100, 1*tileSize - height/2+20);
  rotateZ(frames * 0.01);
  sphere2 = mMatrix();
  axes(30);
  noStroke();
  fill(color2.color());
  sphere(15);
  pop();
  if (toggle_3d_gui.checked()) {
    let sphere1Projection = treeLocation([0, 0, 0], { from: sphere1, to: 'SCREEN' });
    beginHUD();
    color1.position(sphere1Projection.x, sphere1Projection.y);
    endHUD();
    let sphere2Projection = treeLocation([0, 0, 0], { from: sphere2, to: 'SCREEN' });
    beginHUD();
    color2.position(sphere2Projection.x, sphere2Projection.y);
    endHUD();
  } 
  }
}

function update() {
  let dx = abs(mouseX - pmouseX);
  let dy = abs(mouseY - pmouseY);
  speed = constrain((dx + dy) / (2 * (width - height)), 0, 1);
  if (record) {
    points.push({
      worldPosition: treeLocation([mouseX, mouseY, depth.value()], { from: 'SCREEN', to: 'WORLD' }),
      color: color.color(),
      speed: speed
    });
  }
}

function sphereBrush(point) {
  push();
  noStroke();
  // TODO parameterize sphere radius and / or
  // alpha channel according to gesture speed
  fill(point.color);
  sphere(1);
  pop();
}

function keyPressed() {
  if (key === 'r') {
    record = !record;
  }
  if (key === 'p') {
    escorzo = !escorzo;
    escorzo ? perspective() : ortho();
  }
  if (key == 'c') {
    points = [];
  }
}

function mouseWheel(event) {
  //comment to enable page scrolling
  return false;
}

function myCheckedEvent() {
  if (raster.checked()) {
    toRast=true;
  } else {
    toRast=false;
  }
}