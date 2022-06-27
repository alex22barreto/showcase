#  3d Brush and Rasterization

Is the process of taking an image, described in a vector graphics format
and converting it into a series of pixels, dots, or almost any shape.

When these shapes are together, they will form the original image.

Vector graphics are a set of mathematical statements which place lines shapes in a 3d or 2d enviroment, being generally a group of mathematical curves, these are great for printing or image manipulation, even when enlarger they retain detail and quality, while raster graphics uses bitmaps
to store information, this can limit the quality depending on resolution and file size.




## Results

Using this technique we want to extend the idea of a 3d brush, into a 3d painting application
where we could be able to import files, in this case an image and play with it, as an example we can use the next image

![PhotoTest](/showcase/sketches/skulltest.jpg)

Now we will take this picture and we will try to rasterize it, we will divide
the image into many tiles, each individual tile will be analyzed and according to its
contrast we will paint it black or white, black for high and white for low.
Also the darker the tile, the closer to the screen it will be.

We have many issues, since we are using a naive approach, we suffer a great loss in performance, and we need a very good hardware to run this app smoothly.



{{< details title="p5-iframe markdown" open=false >}}

```js



let toggle_3d_gui;
let auto_rotate;
// select
let mode;
// 3d gui
let color1;
let color2;

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

let foreshortening = false;
let raster;
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
  }
  else {
    img = loadImage("/showcase/sketches/skulltest.jpg");
    
  }
  TileSlider = createSlider(5, 200, 50, 1);
  TileSlider.position(20, 50);
  textureMode(NORMAL);
  raster = createCheckbox('toggle 3d gui',true);
  raster.style('color', 'black');
  raster.position(10, 50);
  
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
  valX=0;
  valY=0;
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
        print(z)
      }
    }
  }
  print(valX,valY);
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

  
```

{{< /details >}}

{{< p5-iframe sketch="/showcase/sketches/sketchRaster.js"  lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" lib2="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam@1.2.1/p5.easycam.js" width="740" height="550" >}}

Something quite interesting happened when we added normal mapping or bump mapping images, we could these images almost showing a 3d object, even better results were given when the image is black and white.

here some examples

### Original Image
![Mandelbrot fractal](/showcase/sketches/mandelbrotNormal.png)

### Obtained Object

![Mandelbrot 3d](/showcase/sketches/mandelbrot3d.png)

### Normal Mapping 

Is a texture mapping technique used for faking the lighting of bumps and dents – an implementation of bump mapping. It is used to add details without using more polygons. They are a special kind of texture that allow you to add surface detail such as bumps, grooves, and scratches to a model which catch the light as if they are represented by real geometry.

## Future Work

We want to improve our implementation on the 3d rasterizer, removing the useless black dots, as well as improving speed, we also want to try to implement a more immersive way to control the camera, the color selection system and the 3d brush

## References

* Create your own 3d rasterizer By Tim Roden Broeker https://timrodenbroeker.de/rasterize3d/
* P5 EasyCam https://diwi.github.io/p5.EasyCam/
* Normal mapping https://learnopengl.com/Advanced-Lighting/Normal-Mapping
* The Bump Mapping of Jurassic Park: Trespasser - Per-Pixel Lighting in 1998 https://www.fz.se/forum/trad/448946-the-bump-mapping-of-jurassic-park-trespasser-per-pixel-lighting-in-1998



