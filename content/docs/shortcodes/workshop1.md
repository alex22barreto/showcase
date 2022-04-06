# Taller 1

## Introduccion

## Contexto

## Resultados

 {{< details title="p5-iframe markdown" open=false >}}

```js

  let kernel = [[-1, -1, -1 ], [ -1,  9, -1 ], [-1, -1, -1 ]]; 


function preload() {

  img = loadImage("/content/sketches/arboles.jpg"); 
}


function setup() {

  createCanvas(710, 400);
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
  image(edgeImg, img.width, 0);
}

  
```
{{< /details >}}

{{< p5-iframe sketch="/showcase/sketches/taller1.js" width="400" height="400" >}}




## Conclusiones y Trabajo Futuro