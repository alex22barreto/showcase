
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
