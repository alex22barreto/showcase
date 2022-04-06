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
  ![Blur Kernel](/sketches/blurkernel.jpg))
  {{< /expand >}}

## Results

  
Below you can see the code that was used to do the process of convolution
 {{< details title="p5-iframe markdown" open=false >}}

```js

A=0;
B=0;
C=0;
D=0;
E=1;
F=0;
G=0;
H=0;
I=0;

kernel = [[A, B, C ], [ D,  E, -F ], [G, H, I ]]; 


function preload() {
   img = loadImage("/showcase/sketches/skull.jpg"); 
   }


function setup() {

  createCanvas(550, 550);
  image(img, 240, 0);
   edgeImg = createImage(img.width, img.height);
   edgeImg.loadPixels();
  
ASlider = createSlider(-255, 255, 1);
ASlider.position(180, 300);
BSlider = createSlider(-255, 255, 1);
BSlider.position(180, 320);
CSlider = createSlider(-255, 255, 1);
CSlider.position(180, 340);
DSlider = createSlider(-255, 255, 1);
DSlider.position(180, 360);
ESlider = createSlider(-255, 255,1);
ESlider.position(180, 380);
FSlider = createSlider(-255, 255, 1);
FSlider.position(180, 400);
GSlider = createSlider(-255, 255, 1);
GSlider.position(180, 420);
HSlider = createSlider(-255, 255, 1);
HSlider.position(180, 440);
ISlider = createSlider(-255, 255, 1);
ISlider.position(180, 460);

  text("Aplly current slider value: ",380,310);
  button = createButton('Apply Slider');
  button.position(540, 300);
  button.mousePressed(appslider);
  text("Aplly blur effect: ",380,350);
  button = createButton('Blur');
  button.position(540, 340);
  button.mousePressed(blur);
  text("Aplly default values: ",380,390);
  button = createButton('Identity');
  button.position(540, 380);
  button.mousePressed(identity);

  noLoop();
}

function identity() {
    clear();
    A=0;
    B=0;
    C=0;
    D=0;
    E=1;
    F=0;
    G=0;
    H=0;
    I=0;
    kernel = [[A, B, C ], [ D,  E, -F ], [G, H, I ]]; 
    redraw();
  }

function appslider() {
    clear();
    A = ASlider.value();
    B = BSlider.value();
    C = CSlider.value();
    D = DSlider.value();
    E = ESlider.value();
    F = FSlider.value();
    G = GSlider.value();
    H = HSlider.value();
    I = ISlider.value();
    kernel = [[A, B, C ], [ D,  E, -F ], [G, H, I ]]; 
    redraw();
  }

function blur() {
    clear();
    A=0.0625;
    B=0.125;
    C=0.0625;
    D=0.125;
    E=0.25;
    F=0.125;
    G=0.0625;
    H=0.125;
    I=0.0625;
    kernel = [[A, B, C ], [ D,  E, -F ], [G, H, I ]]; 
    redraw();
  }

  function botsobel(){
    clear();
    A=-1;
    B=-0;
    C=-1;
    D=-2;
    E= 0;
    F= 2;
    G=-1;
    H=0;
    I=0;
    kernel = [[A, B, C ], [ D,  E, -F ], [G, H, I ]]; 
    redraw();
  }


function draw() {
    text("Valor Slider A: "+ASlider.value(),20,300);
    text("Valor Slider B: "+BSlider.value(),20,320);
    text("Valor Slider C: "+CSlider.value(),20,340);
    text("Valor Slider D: "+DSlider.value(),20,360);
    text("Valor Slider E: "+ESlider.value(),20,380);
    text("Valor Slider F: "+FSlider.value(),20,400);
    text("Valor Slider G: "+GSlider.value(),20,420);
    text("Valor Slider H: "+HSlider.value(),20,440);
    text("Valor Slider I: "+ISlider.value(),20,460);
    
   for (let x = 1; x < img.width - 1; x++) {
    for (let y = 1; y < img.height - 1; y++) {
      let sum = 0; 
      
      for (kx = -1; kx <= 1; kx++) {
        for (ky = -1; ky <= 1; ky++) {
          
          let xpos = x + kx;
          let ypos = y + ky;
          let pos = (y + ky)*img.width + (x + kx);
          let valr = red(img.get(xpos, ypos));
		  let valg = green(img.get(xpos, ypos));
		  let valb = blue(img.get(xpos, ypos));
		  let val = (valr*0.299) + (valg*0.587) + (valb*0.114);
          sum += kernel[ky+1][kx+1] * val;
        }
      }
      edgeImg.set(x, y, color(sum, sum, sum));
    }
  }
  
  edgeImg.updatePixels();
  image(edgeImg, 240, 0);
}

  
```

{{< /details >}}

And here is the demo where you can do all the tests 

{{< p5-iframe sketch="/showcase/sketches/taller1.js" width="735" height="550" >}}




## Conclusions and Future work 

CONCLULIONS:

- Image processing done by software and sequentially takes too much processing time.
- The application of filters is used to improve the quality of the image, by eliminating noise data, highlighting some necessary aspect of the image or only leaving some characteristics of the image and eliminating the rest of the data.

FUTURE WORK:

- As future work, it is hoped to be able to apply a greater number of filters to the same image, individually and combined, since the combination of different kernels can give better results. Depending on the application, you may want to apply a filter that removes blemishes or smoothes an image, and then apply another that detects edges.

- Another aspect to focus future work on is performance, where changes can be seen immediately with any change in kernel values, so you can have a better interpretation of the image as desired.

REFERENCES:

https://setosa.io/ev/image-kernels/
https://en.wikipedia.org/wiki/Convolution#Visual_explanation
https://en.wikipedia.org/wiki/Kernel_%28image_processing%29
https://visualcomputing.github.io/docs/illusions/masking/
