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
  var aux = int(random(4, COLS-4));
  var auy = int(random(4, COLS-4));
  var sumx = int(random(1, 4));
  var sumy = int(random(1, 4));
  var auxX = aux+sumx;
  var auyY = auy+sumy;

  col0 = aux;
  row0 = auy;
  col1 = aux;
  row1 = auyY;
  col2 = auxX;
  row2 = auy;

}
