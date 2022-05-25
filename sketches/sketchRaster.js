
let toggle_3d_gui;
let auto_rotate;
// select
let mode;
// 3d gui
let color1;
let color2;

let easycam;
let foreshortening = true;

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
  input = createFileInput(handleFile);
  input.position(0, 500);
  createCanvas(700, 510, WEBGL);
  if(img2!=null){
    img=img2;
    img.resize(740, 550);
  }
  else {
    img = loadImage("/showcase/sketches/skulltest.jpg");
    img.resize(740, 550);
  }
  TileSlider = createSlider(5, 200, 50, 1);
  TileSlider.position(20, 50);
  textureMode(NORMAL);
  toggle_3d_gui = createCheckbox('toggle 3d gui', true);
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
}

function draw() {
  background(color1.color());
  fill(color2.color());
  noStroke();
  sphere(1);
  tiles =  TileSlider.value();;
  tileSize = width/tiles;
  push();
  translate(width/2-390,height/2-350);
  scale(0.5) 
  if(img2 != null){
    img=img2;
    print("HOLANDAS"+img2.type);
  } 
  if (img) {
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
  
  pop();
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
