# Taller 1

## Intoduction 

  An image kernel is a small matrix used to apply effects like the ones you might find in Photoshop or Gimp, such as blurring, sharpening, outlining or embossing. They're also used in machine learning for 'feature extraction', a technique for determining the most important portions of an image. In this context the process is referred to more generally as "convolution".

  To see how they work, let's start by inspecting a black and white image. The matrix on the left contains numbers, between 0 and 255, which each correspond to the brightness of one pixel in a picture of a face. The large, granulated picture has been blown up to make it easier to see; the last image is the "real" size.
  
  {{< expand "Picture one" "..." >}}
  ![Picture one](..../sketches/ej1.jpg))
  {{< /expand >}}


## Context

  For each 3x3 block of pixels in the original image , we multiply each pixel by the corresponding entry of the kernel and then take the sum. That sum becomes a new pixel in the result image. 
  
  One subtlety of this process is what to do along the edges of the image. For example, the top left corner of the input image only has three neighbors. One way to fix this is to extend the edge values out by one in the original image while keeping our new image the same size. 

  For example, this is the kernel for the blue effect that you can apply and test below: 
  {{< expand "Blur Kernel" "..." >}}
  ![Blur Kernel](..../sketches/blurkernel.jpg))
  {{< /expand >}}

## Results

  
Below you can see the code that was used to do the process of convolution
 {{< details title="p5-iframe markdown" open=false >}}

```js

  let kernel = [[-1, -1, -1 ], [ -1,  9, -1 ], [-1, -1, -1 ]]; 


function preload() {

  img = loadImage("/showcase/sketches/arboles.jpg"); 
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

And here is the demo where you can do all the tests 

{{< p5-iframe sketch="/showcase/sketches/taller1.js" width="735" height="550" >}}




## Conclusions and Future work 

CONCLULIONS:

- Literally dont know xd. 
- or.....
- Nah

FUTURE WORK:

- Make it prettier :D 
- Faster
- Bigger
- Better
- Faster 
- Stronger

REFERENCES:

https://setosa.io/ev/image-kernels/
https://en.wikipedia.org/wiki/Convolution#Visual_explanation
https://en.wikipedia.org/wiki/Kernel_%28image_processing%29
https://visualcomputing.github.io/docs/illusions/masking/