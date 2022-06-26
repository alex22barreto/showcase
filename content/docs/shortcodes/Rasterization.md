# Taller 2

When a low-quality image is zoomed in or processed, the edges tend to become jagged or staggered. To solve this problem, we must apply smoothing to the figure. The process is carried out by generating a subdivision of the original pixels of the image. image in a greater number of pixels, to perform a smoothing of the edges with the use of barycentric coordinates, triangles are calculated on the original image.


## Background

### Rasterization

It is the task of taking an image and converting it into a set of pixels, points or lines that, when shown together, allow the original image to be seen through the forms with which it is represented, the rasterized image can be displayed on a computer screen, or as a video, among other ways.

### Aliasing

In visual computing, images are displayed on monitors with pixels, which are nothing more than tiny squares.
So, when a straight line appears in the image, it is very easy to represent it with pixels because they are straight, but when a diagonal edge is represented, regardless of the degree of inclination, the small squares are stacked next to each other, forming the well-known phenomenon such as Aliasing, “steps” or “saw teeth”.

### Anti Aliasing

Smoothing is nothing more than a post-processing filter, and is therefore performed after generating the image, which smooths these jagged edges so that lines that are not vertical or horizontal appear more homogeneous, eliminating or at least mitigating this stair effect.

## Implementation

Like the smoothing process in an image post-processing process, what is done is a subdivision of an image space into much smaller frames, in order to blur the steps present at the edges of the image, actually it can generate many more steps but of a smaller size, which gives the sensation of elimination or at least the mitigation is carried out.
With the use of the barycentric coordinates we can an area in that created subspace, recalculate the value of the color for each of the subframes that are part of the area of ​​the triangle, smoothing the edges of the original figure.

Press R to change apply antialiasing on a random position
## Results
 {{< details title="p5-iframe markdown" open=false >}}

```js

let ROWS = 20;
let COLS = 20;
let LENGTH = 10;
let quadrille;
let row0, col0, row1, col1, row2, col2;
let img;
let c1, c2, c3 ;
let index, r0, g0, b0, r1, g1, b1, r2, g2, b2, d;

function preload() {
  img = loadImage('/showcase/sketches/vida.PNG');
}

function setup() {
  
  ROWS = Math.floor(img.height/LENGTH);
  COLS = Math.floor(img.width/LENGTH);
  createCanvas(1000, 1000);
  pixelDensity(1);
  img.loadPixels();
  loadPixels();
  quadrille = createQuadrille(COLS, img);
  randomize();
  
  index = ((col0* LENGTH + LENGTH / 2) + (row0* LENGTH + LENGTH / 2)*(COLS*LENGTH))*4;
  r0 = img.pixels[index];
  g0 = img.pixels[index+1];
  b0 = img.pixels[index+2];
  
  index = ((col1* LENGTH + LENGTH / 2) + (row1* LENGTH + LENGTH / 2)*(COLS*LENGTH))*4;
  r1 = img.pixels[index];
  g1 = img.pixels[index+1];
  b1 = img.pixels[index+2];

  index = ((col2* LENGTH + LENGTH / 2) + (row2* LENGTH + LENGTH / 2)*(COLS*LENGTH))*4;
  r2 = img.pixels[index];
  g2 = img.pixels[index+1];
  b2 = img.pixels[index+2];

  quadrille.colorizeTriangle(row0, col0, row1, col1, row2, col2, [r0, g0, b0], [r1, g1, b1], [r2, g2, b2]);
  
}

function draw() {
  background('#060621');
  drawQuadrille(quadrille, { cellLength: LENGTH, outlineWeight: 0.01,outline: 'green' });
  tri();
}

function tri() {
  push();
  stroke('cyan');
  strokeWeight(3);
  noFill();
  triangle(col0 * LENGTH + LENGTH / 2, row0 * LENGTH + LENGTH / 2, col1 * LENGTH + LENGTH / 2, row1 * LENGTH + LENGTH / 2, col2 * LENGTH + LENGTH / 2, row2 * LENGTH + LENGTH / 2);
  pop();
}

function keyPressed() {
  randomize();
  if (key === 'r') {
    index = ((col0* LENGTH + LENGTH / 2) + (row0* LENGTH + LENGTH / 2)*(COLS*LENGTH))*4;
    r0 = img.pixels[index];
    g0 = img.pixels[index+1];
    b0 = img.pixels[index+2];
    
    index = ((col1* LENGTH + LENGTH / 2) + (row1* LENGTH + LENGTH / 2)*(COLS*LENGTH))*4;
    r1 = img.pixels[index];
    g1 = img.pixels[index+1];
    b1 = img.pixels[index+2];

    index = ((col2* LENGTH + LENGTH / 2) + (row2* LENGTH + LENGTH / 2)*(COLS*LENGTH))*4;
    r2 = img.pixels[index];
    g2 = img.pixels[index+1];
    b2 = img.pixels[index+2];

    quadrille.colorizeTriangle(row0, col0, row1, col1, row2, col2, [r0, g0, b0], [r1, g1, b1], [r2, g2, b2]);
  }
  
}

function randomize() {
  var aux = int(random(0, COLS-4));
  var auy = int(random(0, COLS-4));
  var auxX = aux+4;
  var auyY = auy+4;

  col0 = aux;
  row0 = auy;
  col1 = aux;
  row1 = auyY;
  col2 = auxX;
  row2 = auy;

}


```
{{< /details >}}

{{< p5-iframe sketch="/showcase/sketches/rasterExample.js" lib1="https://cdn.jsdelivr.net/gh/objetos/p5.quadrille.js/p5.quadrille.js" lib2="p5.js" lib3="p5.sound.js"  width="1020" height="1020" >}}

## Conclusiones y Trabajo Futuro

We've managed to create an anti aliasing effect, where we could see how the image becomes softer, sadly to have a more uniform effect, we have to use the same triangle all the time, so the effect is not as seamless as desired.

![resultado anti aliasing](/showcase/sketches/hongoantialias.png)



Improve the rasterization algorithm, changing the naive approach to a better one, able to run trough hardware, making the process faster, and to be able to use even smaller triangles for better results.
