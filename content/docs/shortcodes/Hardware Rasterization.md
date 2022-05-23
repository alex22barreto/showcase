# Rasterization

Is the process of taking an image, described in a vector graphics format
and converting it into a series of pixels, dots, or almost any shape.

When these shapes are together, they will form the original image.

Vector graphics are a set of mathematical statements which place lines shapes in a 3d or 2d enviroment, being generally a group of mathematical curves, these are great for printing or image manipulation, even when enlarger they retain detail and quality, while raster graphics uses bitmaps
to store information, this can limit the quality depending on resolution and file size.




## Showcase
![PhotoTest](/showcase/sketches/skulltest.jpg)

Now we will take this picture and we will try to rasterize it, we will divide
the image into many tiles, each individual tile will be analyzed and according to its
contrast we will paint it black or white, black for high and white for low.
Also the darker the tile, the closer to the screen it will be.

Since the image is smaller than the canvas, we have a lot of useless black dots.

{{< details title="p5-iframe markdown" open=false >}}

```js


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

function setup() {
  createCanvas(700, 510, WEBGL);
  img = loadImage("/showcase/sketches/skulltest.jpg");
  img.resize(740, 550);
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


  
```

{{< /details >}}

{{< p5-iframe sketch="/showcase/sketches/sketchRaster.js"  lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" lib2="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam@1.2.1/p5.easycam.js" width="740" height="550" >}}

## 3d Guis

The main use that we can find using 3d guis is inside virtual realty, at the moment the most used application is on videogames, well implemented, these can immerse the player even more inside the virtual world, even becoming a natural element of the player's experience, poorly implemented it can ruin the immersion, reminding the player that they are inside a virtual world.

![Skyrim Test](/showcase/sketches/3dguiskyrim.gif)

![Half Life Alyx](/showcase/sketches/alyxpuzzle.gif)

## Software Rasterizer

with the use of triangles, we are going to do something similar, in this case using a 2d image, sadly
it is way slower, so we need to wait a while for it to load.

## Future Work

We want to improve our implementation on the 3d rasterizer, removing the useless black dots, as well as improving speed, we also want to try to implement a more immersive way to control the camera and color selection system