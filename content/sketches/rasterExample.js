let ROWS = 20;
let COLS = 20;
let LENGTH = 7;
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
  //createCanvas(COLS * LENGTH, ROWS * LENGTH);
  createCanvas(1000, 1000);
  pixelDensity(1);
  img.loadPixels();
  loadPixels();
  //quadrille = createQuadrille(1000/20, 1000/20);
  quadrille = createQuadrille(COLS, img);
  randomize();
  // highlevel call: = 4 * d*(y * d*width + x);
  
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
  //quadrille.colorizeTriangle(row0, col0, row1, col1, row2, col2, 'red', 'green', 'blue');
  //quadrille.colorize('red', 'green', 'blue', 'cyan');
  
}

function draw() {
  //console.log("*3*3*3**3**3*3**3**3*3*.*3*3*3*3*3*3*3*");
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
  //quadrille.clear();
  if (key === 'r') {
    // low level call:
    // [r, g, b, x, y]: rgb -> color components; x, y -> 2d normal
    //quadrille.rasterizeTriangle(row0, col0, row1, col1, row2, col2, colorize_shader, [255, 0, 0, 7, 4], [0, 255, 0, -1, -10], [0, 0, 255, 5, 8]);
    //c= img.pixels[i]
    //quadrille.colorizeTriangle(row0, col0, row1, col1, row2, col2, [255, 0, 0], [0, 255, 0], [0, 0, 255]);
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
  if (key === 's') {
    quadrille.rasterize(colorize_shader, [255, 0, 0, 7, 4], [0, 255, 0, -1, -10], [0, 0, 255, 5, 8], [255, 255, 0, -1, -10]);
  }
  /*
  if (key === 't') {
    quadrille.clear(5, 5);
    quadrille.fill(6, 6, color('cyan'));
  }
  */
}

// pretty similar to what p5.Quadrille.colorizeTriangle does
function colorize_shader({ pattern: mixin }) {
  let rgb = mixin.slice(0, 3);
  // debug 2d normal<
  //console.log(mixin.slice(3));
  // use interpolated color as is
  return color(rgb);
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

  //col0 = int(random(0, COLS));
  //row0 = int(random(0, ROWS));
  //col1 = int(random(0, COLS));
  //row1 = int(random(0, ROWS));
  //col2 = int(random(0, COLS));
  //row2 = int(random(0, ROWS));
}
