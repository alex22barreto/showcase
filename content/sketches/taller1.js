
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
  
ASlider = createInput('');
ASlider.position(180, 300);
BSlider = createInput('');
BSlider.position(180, 320);
CSlider = createInput('');
CSlider.position(180, 340);
DSlider = createInput('');
DSlider.position(180, 360);
ESlider = createInput('');
ESlider.position(180, 380);
FSlider = createInput('');
FSlider.position(180, 400);
GSlider = createInput('');
GSlider.position(180, 420);
HSlider = createInput('');
HSlider.position(180, 440);
ISlider = createInput('');
ISlider.position(180, 460);

  
  button = createButton('Apply Slider');
  button.position(540, 300);
  button.mousePressed(appslider);
  button = createButton('Blur');
  button.position(540, 330);
  button.mousePressed(blur);
  button = createButton('Identity');
  button.position(540, 360);
  button.mousePressed(identity);
  button = createButton('Outline');
  button.position(540, 390);
  button.mousePressed(outline);	
  button = createButton('Right Sobel');
  button.position(540, 420);
  button.mousePressed(ritsobel);
  button = createButton('Emboss');
  button.position(540, 450);
  button.mousePressed(emboss);	
  button = createButton('Bottom Sobel');
  button.position(540, 480);
  button.mousePressed(botsob);		
  noLoop();
}
function botsob() {
    clear();
    A=-1;
    B=-2;
    C=-1;
    D=0;
    E=0;
    F=0;
    G=1;
    H=2;
    I=1;
    kernel = [[A, B, C ], [ D,  E, -F ], [G, H, I ]]; 
    redraw();
  }
function outline() {
    clear();
    A=-5;
    B=4;
    C=0;
    D=0;
    E=2;
    F=0;
    G=0;
    H=-1;
    I=0;
    kernel = [[A, B, C ], [ D,  E, -F ], [G, H, I ]]; 
    redraw();
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

  function ritsobel(){
    clear();
    A=-32;  
    B=50;
    C=45;
    D=-81;
    E=63;
    F=68;
    G=-68;
    H=59;
    I=59;
    kernel = [[A, B, C ], [ D,  E, -F ], [G, H, I ]]; 
    redraw();
  }
   
 function emboss(){
    clear();
    A=-1.8;
    B=-1;
    C=0;
    D=-1;
    E=1.5;
    F= 1.5;
    G=0.1;
    H=1.5;
    I=2.5;
    kernel = [[A, B, C ], [ D,  E, -F ], [G, H, I ]]; 
    redraw();
  }


function draw() {
  noLoop();
    text("Valor Slider A: "+ASlider.value(),20,300);
    text("Valor Slider B: "+BSlider.value(),20,320);
    text("Valor Slider C: "+CSlider.value(),20,340);
    text("Valor Slider D: "+DSlider.value(),20,360);
    text("Valor Slider E: "+ESlider.value(),20,380);
    text("Valor Slider F: "+FSlider.value(),20,400);
    text("Valor Slider G: "+GSlider.value(),20,420);
    text("Valor Slider H: "+HSlider.value(),20,440);
    text("Valor Slider I: "+ISlider.value(),20,460);
    text("Apply current slider value: ",380,300);
    text("Apply blur effect: ",380,330);
    text("Apply default values: ",380,360);
    text("Apply Outline: ",380,390);
    text("Apply Right Sobel: ",380,420);
    text("Apply Emboss: ",380,450);	
	
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
