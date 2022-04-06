
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

  createCanvas(600, 600);
  image(img, 140, 0);
   edgeImg = createImage(img.width, img.height);
   edgeImg.loadPixels();
  
ASlider = createSlider(-255, 255, 1);
ASlider.position(20, 230);

BSlider = createSlider(-255, 255, 1);
BSlider.position(20, 250);
CSlider = createSlider(-255, 255, 1);
CSlider.position(20, 270);
DSlider = createSlider(-255, 255, 1);
DSlider.position(20, 290);
ESlider = createSlider(-255, 255,1);
ESlider.position(20, 310);
FSlider = createSlider(-255, 255, 1);
FSlider.position(20, 330);
GSlider = createSlider(-255, 255, 1);
GSlider.position(20, 350);
HSlider = createSlider(-255, 255, 1);
HSlider.position(20, 370);
ISlider = createSlider(-255, 255, 1);
ISlider.position(20, 390);

  
  button = createButton('Apply Slider');
  button.position(200, 230);
  button.mousePressed(appslider);

  button = createButton('Blur');
  button.position(200, 250);
  button.mousePressed(blur);
  
  button = createButton('Identity');
  button.position(200, 270);
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
    text("Valor Slider A: "+ASlider.value(),20,10);
    text("Valor Slider B: "+BSlider.value(),20,20);
    text("Valor Slider C: "+CSlider.value(),20,30);
    text("Valor Slider D: "+DSlider.value(),20,40);
    text("Valor Slider E: "+ESlider.value(),20,50);
    text("Valor Slider F: "+FSlider.value(),20,60);
    text("Valor Slider G: "+GSlider.value(),20,70);
    text("Valor Slider H: "+HSlider.value(),20,80);
    text("Valor Slider I: "+ISlider.value(),20,90);
    
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
  image(edgeImg, 140, 0);
}