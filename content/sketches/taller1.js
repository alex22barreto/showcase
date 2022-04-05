
let kernel = [[-1, -1, -1 ], [ -1,  9, -1 ], [-1, -1, -1 ]]; 


function preload() {

  img = loadImage("/showcase/sketches/ojos.jpg"); 
}


function setup() {

  createCanvas(293, 172);
  noLoop();
}

function draw() {
  
  image(img, 0, 0);

  edgeImg = createImage(img.width, img.height);
  
  edgeImg.loadPixels();

  


  for (let x = 1; x < img.width - 1; x++) {
    for (let y = 1; y < img.height - 1; y++) {
      let sum = 0; 
      
      for (kx = -1; kx <= 1; kx++) {
        for (ky = -1; ky <= 1; ky++) {
          
          let xpos = x + kx;
          let ypos = y + ky;
          let pos = (y + ky)*img.width + (x + kx);
          let val = red(img.get(xpos, ypos));
          sum += kernel[ky+1][kx+1] * val;
        }
      }
      edgeImg.set(x, y, color(sum, sum, sum));
    }
  }
  
  edgeImg.updatePixels();
  image(edgeImg, 0, 0);
}
