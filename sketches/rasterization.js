let quadrille;
let image;

function preload() {
  image = loadImage('/showcase/sketches/arboles.jpg');
}

function setup() {
  createCanvas(1000, 800);
}

function draw() {
  if (frameCount % 200 === 0) {
    let scl = 2 ** int(5);
    quadrille = createQuadrille(20 * scl, image);
    drawQuadrille(quadrille, {cellLength: 40 / scl, outlineWeight: 1.6 / scl, outline: color(random(255))});
  }
}