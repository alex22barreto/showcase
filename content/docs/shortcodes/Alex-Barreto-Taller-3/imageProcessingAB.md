

# Procesamiento digital de imágenes

El procesamiento de imágenes digitales es el conjunto de técnicas que se aplican a las imágenes digitales con el objetivo de mejorar la calidad o facilitar la búsqueda de información.

## Proceso de filtrado
Es el conjunto de técnicas englobadas dentro del preprocesamiento de imágenes cuyo objetivo fundamental es obtener, a partir de una imagen origen, otra final cuyo resultado sea más adecuado para una aplicación específica mejorando ciertas características de la misma que posibilite efectuar operaciones del procesado sobre ella.

Los principales objetivos que se persiguen con la aplicación de filtros son:

- Suavizar la imagen: reduce la cantidad de variaciones de intensidad entre píxeles vecinos.
- Eliminar ruido: eliminar aquellos píxeles cuyo nivel de intensidad es muy diferente al de sus vecinos y cuyo origen puede estar tanto en el proceso de adquisición de la imagen como en el de transmisión.
- Realzar bordes: destacar los bordes que se localizan en una imagen.
- Detectar bordes: detectar los píxeles donde se produce un cambio brusco en la función intensidad.

Por tanto, se consideran los filtros como operaciones que se aplican a los píxeles de una imagen digital para optimizarla, enfatizar cierta información o conseguir un efecto especial en ella.

El proceso de filtrado puede llevarse a cabo sobre los dominios de frecuencia y/o espacio, el trabajo llevado a lo largo del curso se realiza un filtrado y procesamiento en el espacio.

Las operaciones de filtrado se llevan a cabo directamente sobre los píxeles de la imagen. En este proceso se relaciona, para todos y cada uno de los puntos de la imagen, un conjunto de píxeles próximos al píxel objetivo con la finalidad de obtener una información útil, dependiente del tipo de filtro aplicado, que permita actuar sobre el píxel concreto en que se está llevando a cabo el proceso de filtrado para, de este modo, obtener mejoras sobre la imagen y/o datos que podrían ser utilizados en futuras acciones o procesos de trabajo sobre ella.

## Kernel 

Un kernel es una matriz pequeña que se utiliza para desenfocar, agudizar, grabar, detectar bordes, entre otros. Esto se logra mediante  el proceso de agregar cada elemento de la imagen a sus vecinos locales, ponderados por el kernel.

## luminosidad 

La definición de una dimensión de luminosidad o valor no es obvia: hay varias posibilidades según el propósito y los objetivos de la representación.

Cuatro de las más comunes son:

- El enfoque más simple es el de la media aritmética de los tres componentes del color en el modelo RGB.

I = avg(R,G,B)

- En el modelo HSV, el valor se define como el componente más grande de un color. 

V = max(R,G,B)

- En el modelo HSL, la luminosidad se define como el promedio de los componentes de color más grande y más pequeño.

L = mid(R,G,B)

- Una alternativa más relevante es usar luma la cual consiste en calcular el promedio ponderado de R , G y B con corrección de gamma , en función de su contribución a la luminosidad percibida, utilizada durante mucho tiempo como la dimensión monocromática en la transmisión de televisión en color, la cual posee coeficientes distintos para cada componente del color con lo que el peso al momento de realizar el promedio no es igual por parte de cada componente. 



## Implementacion

Con el uso de shaders la implementacion de cada una de las mascaros de convolucion o calculo de luminosidad para cada pixel de la imagen en codigo fuente no es facil de ver a primera vista, pero su eficiencia y simplificacion de codigo fuente permite un desarrollo que con pocas lineas se realizen transformaciones optimas. 

Como primera aproximacion se replica la transformacion realizada en el libro [Visual Computing](https://visualcomputing.github.io/docs/shaders/image_processing/)


{{< p5-iframe sketch="/showcase/sketches/maskAB.js" lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js"  lib2="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam@1.2.1/p5.easycam.js"   width="680" height="520" >}}

Ademas de manera facil se puede aplicar las convoluciones o transformaciones de la imagen sobre un area en especifico sin afectar a la totalidad de la imagen e ir moviendo con el mouse el lugar donde se quiere aplicar la trasnformacion, o cambiando el tamaño del objeto mismo.
Basado en "The Book of Shaders" donde documentan la funcion [Distance()](https://thebookofshaders.com/glossary/?search=distance), se realizo la implementacion donde se genera una region circular que sigue el puntero al pasar sobre la imagen aplicando la transformacion deseada, ademas inspirado en [Image Kernels](https://setosa.io/ev/image-kernels/) se crea una seccion de cajas de texto representativas al kernel, donde se pueden ir modificando los valores que se aplican en la convolucion. 

## Resultados

Por defecto se aplica un kernel de convolucion sobre la imagen, pero puede elegirse para aplicar sobre video, ademas de la transformacion a otros valores de luminosidad, para cuando se seleccione la aplicacion del kernel puede modificarse los valores y se vera el resultado de inmediato, ademas de poseer botones para aplicar mascaras ya definidas en la literatura. 



{{< p5-iframe sketch="/showcase/sketches/maskABEjersicio.js" lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js"  lib2="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam@1.2.1/p5.easycam.js"   width="680" height="1020" >}}


{{< details title="mask.js" open=false >}}

```js

let maskShader;
let img;
let video_src;
let video_on;
let mask;
let alto = 500;
let radio;

let grey_scale;
let igrey_scale;
let vgrey_scale;
let lgrey_scale;
let hsvgrey_scale;

A=0;
B=0;
C=0;
D=0;
E=1;
F=0;
G=0;
H=0;
I=0;

function preload() {
  video_src = createVideo(['/showcase/sketches/mandrill.webm']);
  maskShader = readShader('/showcase/sketches/shaders/maskABExample.frag', { varyings: Tree.texcoords2 });  
  img = loadImage('/showcase/sketches/arboles.jpg');  
}

function setup() {
  createCanvas(650, alto, WEBGL);
  noStroke();
  textureMode(NORMAL);
  video_on = createCheckbox('video', false);
  video_on.style('color', 'white');
  video_on.changed(() => {
    if (video_on.checked()) {
      maskShader.setUniform('texture', video_src);
      video_src.loop();
    } else {
      maskShader.setUniform('texture', img);
      video_src.pause();
    }
  });
  video_on.position(10, (alto +30));
  mask = createCheckbox('Aplicar mascara con los siguientes valores:', true);
  mask.position(10, (alto +70));
  mask.style('color', 'white');
  mask.changed(maskmyCheckedEvent);

  
  shader(maskShader);
  maskShader.setUniform('texture', img);
  emitTexOffset(maskShader, img, 'texOffset');
  radio = createSlider(0, 1, 0.2, 0.05);
  radio.position(10, (alto +50));
  radio.style('width', '280px');
  

  grey_scale = createCheckbox('luma', false);
  grey_scale.position(75, (alto +30));
  grey_scale.style('color', 'white');  
  grey_scale.changed(greymyCheckedEvent);

  igrey_scale = createCheckbox('Promedio', false);
  igrey_scale.position(130, (alto +30));
  igrey_scale.style('color', 'white');  
  igrey_scale.changed(imyCheckedEvent);

  vgrey_scale = createCheckbox('valor V', false);
  vgrey_scale.position(215, (alto +30));
  vgrey_scale.style('color', 'white');  
  vgrey_scale.changed(vmyCheckedEvent);

  lgrey_scale = createCheckbox('luminosidad L', false);
  lgrey_scale.position(285, (alto +30));
  lgrey_scale.style('color', 'white');  
  lgrey_scale.changed(lmyCheckedEvent);

  hsvgrey_scale = createCheckbox('HSV', false);
  hsvgrey_scale.position(400, (alto +30));
  hsvgrey_scale.style('color', 'white');  
  hsvgrey_scale.changed(hsvmyCheckedEvent);
  

  ASlider = createInput(-1);
  ASlider.position(10, (alto +100));
  ASlider.size(60);
  BSlider = createInput(-1);
  BSlider.position(80, (alto +100));
  BSlider.size(60);
  CSlider = createInput(-1);
  CSlider.position(150, (alto +100));
  CSlider.size(60);
  DSlider = createInput(-1);
  DSlider.position(10, (alto +130));
  DSlider.size(60);
  ESlider = createInput(8);
  ESlider.position(80, (alto +130));
  ESlider.size(60);
  FSlider = createInput(-1);
  FSlider.position(150, (alto +130));
  FSlider.size(60);
  GSlider = createInput(-1);
  GSlider.position(10, (alto +160));
  GSlider.size(60);
  HSlider = createInput(-1);
  HSlider.position(80, (alto +160));
  HSlider.size(60);
  ISlider = createInput(-1);
  ISlider.position(150, (alto +160));
  ISlider.size(60);

  button = createButton('Blur');
  button.position(10, (alto +190));
  button.mousePressed(blur);
  button = createButton('Outline');
  button.position(10, (alto +220));
  button.mousePressed(outline);	
  button = createButton('Right Sobel');
  button.position(10, (alto +250));
  button.mousePressed(ritsobel);
  button = createButton('Emboss');
  button.position(10, (alto +280));
  button.mousePressed(emboss);	
  button = createButton('Bottom Sobel');
  button.position(10, (alto +310));
  button.mousePressed(botsob);
}

function draw() {
  background(0);
  maskShader.setUniform('maskDefault', [0, 0, 0, 0, 1, 0, 0, 0, 0]);
  const x_mouse = parseFloat((mouseX * pixelDensity())/width);
  const y_mouse = parseFloat(((mouseY) * pixelDensity())/height);

  maskShader.setUniform('radio', radio.value()); 

  maskShader.setUniform('mouse_position_x', x_mouse); 
  maskShader.setUniform('mouse_position_y', y_mouse); 
  
  A = ASlider.value();
  B = BSlider.value();
  C = CSlider.value();
  D = DSlider.value();
  E = ESlider.value();
  F = FSlider.value();
  G = GSlider.value();
  H = HSlider.value();
  I = ISlider.value();
  
  maskShader.setUniform('grey_scale', grey_scale.checked());
  maskShader.setUniform('igrey_scale', igrey_scale.checked());
  maskShader.setUniform('vgrey_scale', vgrey_scale.checked());
  maskShader.setUniform('lgrey_scale', lgrey_scale.checked());
  maskShader.setUniform('hsvgrey_scale', hsvgrey_scale.checked());
  maskShader.setUniform('mascara', mask.checked());


  video_on.changed(() => {
    if (video_on.checked()) {
      maskShader.setUniform('texture', video_src);
      video_src.loop();
    } else {
      maskShader.setUniform('texture', img);
      video_src.pause();
    }
  });

  if (mask.checked()) {
    maskShader.setUniform('mask', [A, B, C, D, E, F, G, H, I]);
  }
  else {
    maskShader.setUniform('mask', [0, 0, 0, 0, 1, 0, 0, 0, 0]);
  }
  quad(-width / 2, -height / 2, width / 2, -height / 2, width / 2, height / 2, -width / 2, height / 2);
  
}

function botsob() {
  A=-1;
  B=-2;
  C=-1;
  D=0;
  E=0;
  F=0;
  G=1;
  H=2;
  I=1;
  ASlider.value(A);
  BSlider.value(B);
  CSlider.value(C);
  DSlider.value(D);
  ESlider.value(E);
  FSlider.value(F);
  GSlider.value(G);
  HSlider.value(H);
  ISlider.value(I);
}
function outline() {
  A=-5;
  B=4;
  C=0;
  D=0;
  E=2;
  F=0;
  G=0;
  H=-1;
  I=0;
  ASlider.value(A);
  BSlider.value(B);
  CSlider.value(C);
  DSlider.value(D);
  ESlider.value(E);
  FSlider.value(F);
  GSlider.value(G);
  HSlider.value(H);
  ISlider.value(I);
}

function blur() {
  
  A=0.0625;
  B=0.125;
  C=0.0625;
  D=0.125;
  E=0.25;
  F=0.125;
  G=0.0625;
  H=0.125;
  I=0.0625;
  ASlider.value(A);
  BSlider.value(B);
  CSlider.value(C);
  DSlider.value(D);
  ESlider.value(E);
  FSlider.value(F);
  GSlider.value(G);
  HSlider.value(H);
  ISlider.value(I);
}

function ritsobel(){
  A=-32;  
  B=50;
  C=45;
  D=-81;
  E=63;
  F=68;
  G=-68;
  H=59;
  I=59;
  ASlider.value(A);
  BSlider.value(B);
  CSlider.value(C);
  DSlider.value(D);
  ESlider.value(E);
  FSlider.value(F);
  GSlider.value(G);
  HSlider.value(H);
  ISlider.value(I);
}
 
function emboss(){
  A=-1.8;
  B=-1;
  C=0;
  D=-1;
  E=1.5;
  F= 1.5;
  G=0.1;
  H=1.5;
  I=2.5;
  ASlider.value(A);
  BSlider.value(B);
  CSlider.value(C);
  DSlider.value(D);
  ESlider.value(E);
  FSlider.value(F);
  GSlider.value(G);
  HSlider.value(H);
  ISlider.value(I);

  
}

function maskmyCheckedEvent() {
  
  if (mask.checked()) {
    grey_scale.checked(false);
    igrey_scale.checked(false);
    vgrey_scale.checked(false);
    lgrey_scale.checked(false);
    hsvgrey_scale.checked(false);
    console.log('mascara!');
  } 
}

function greymyCheckedEvent() {
  
   if (grey_scale.checked()){
    mask.checked(false);
    igrey_scale.checked(false);
    vgrey_scale.checked(false);
    lgrey_scale.checked(false);
    hsvgrey_scale.checked(false);
    console.log('grey_scale!');
  }
}

function imyCheckedEvent() {
  if (igrey_scale.checked()){
    mask.checked(false);
    grey_scale.checked(false);
    vgrey_scale.checked(false);
    lgrey_scale.checked(false);
    hsvgrey_scale.checked(false);
    console.log('igrey_scale!');
  }
}

function vmyCheckedEvent() {
  if (vgrey_scale.checked()){
    mask.checked(false);
    grey_scale.checked(false);
    igrey_scale.checked(false);
    lgrey_scale.checked(false);
    hsvgrey_scale.checked(false);
    console.log('vgrey_scale!');
  }
}

function lmyCheckedEvent() {
   if (lgrey_scale.checked()){
    mask.checked(false);
    grey_scale.checked(false);
    igrey_scale.checked(false);
    vgrey_scale.checked(false);
    hsvgrey_scale.checked(false);
    console.log('lgrey_scale!');
  }
}

function hsvmyCheckedEvent() {
  if (hsvgrey_scale.checked()){
    mask.checked(false);
    grey_scale.checked(false);
    igrey_scale.checked(false);
    vgrey_scale.checked(false);
    lgrey_scale.checked(false);
    console.log('hsvgrey_scale!');
  }
}

```

{{< /details >}}


{{< details title="mask.frag" open=false >}}

```js

precision mediump float;

uniform sampler2D texture;
uniform vec2 texOffset;
// holds the 3x3 kernel
uniform float mask[9];
uniform float maskDefault[9];

uniform float radio;
uniform float mouse_position_x;
uniform float mouse_position_y;
uniform bool grey_scale;
uniform bool igrey_scale;
uniform bool vgrey_scale;
uniform bool lgrey_scale;
uniform bool hsvgrey_scale;
uniform bool mascara;

// we need our interpolated tex coord
varying vec2 texcoords2;

// returns luma of given texel
// Codigo tomado de https://visualcomputing.github.io/docs/shaders/texturing/#texture-sampling
float luma(vec3 texel) {
  return 0.299 * texel.r + 0.587 * texel.g + 0.114 * texel.b;
}

// returns the color HSV
// Codigo tomado de http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

// insperado en las ecuaciones de luminicidad presentadas en 
// https://en.wikipedia.org/wiki/HSL_and_HSV#:~:text=of%20about%2013.4%25.-,Lightness,-%5Bedit%5D

float Irgb(vec3 texel) {
  return (texel.r + texel.g + texel.b)/3.0;
}

float Vhsv(vec3 texel) {
  float M =0.0;
  if(texel.r>M){
    M=texel.r;
  }
  if(texel.g>M){
    M=texel.g;
  }
  if(texel.b>M){
    M=texel.b;
  }
  return M;
}

float Lhsl(vec3 texel) {
  float M =0.0;
  if(texel.r>M){
    M=texel.r;
  }
  if(texel.g>M){
    M=texel.g;
  }
  if(texel.b>M){
    M=texel.b;
  }

  float min =255.0;
  if(texel.r<min){
    min=texel.r;
  }
  if(texel.g<min){
    min=texel.g;
  }
  if(texel.b<min){
    min=texel.b;
  }

  return (M + min)/2.0;
}

void main() {

  vec2 st = vec2(mouse_position_x,mouse_position_y);
  
  float pct = 0.0;

  pct = distance(st,texcoords2);

    // 1. Use offset to move along texture space.
  // In this case to find the texcoords of the texel neighbours.
  vec2 tc0 = texcoords2 + vec2(-texOffset.s, -texOffset.t);
  vec2 tc1 = texcoords2 + vec2(         0.0, -texOffset.t);
  vec2 tc2 = texcoords2 + vec2(+texOffset.s, -texOffset.t);
  vec2 tc3 = texcoords2 + vec2(-texOffset.s,          0.0);
  // origin (current fragment texcoords)
  vec2 tc4 = texcoords2 + vec2(         0.0,          0.0);
  vec2 tc5 = texcoords2 + vec2(+texOffset.s,          0.0);
  vec2 tc6 = texcoords2 + vec2(-texOffset.s, +texOffset.t);
  vec2 tc7 = texcoords2 + vec2(         0.0, +texOffset.t);
  vec2 tc8 = texcoords2 + vec2(+texOffset.s, +texOffset.t);


  // 2. Sample texel neighbours within the rgba array
  vec4 rgba[9];
  rgba[0] = texture2D(texture, tc0);
  rgba[1] = texture2D(texture, tc1);
  rgba[2] = texture2D(texture, tc2);
  rgba[3] = texture2D(texture, tc3);
  rgba[4] = texture2D(texture, tc4);
  rgba[5] = texture2D(texture, tc5);
  rgba[6] = texture2D(texture, tc6);
  rgba[7] = texture2D(texture, tc7);
  rgba[8] = texture2D(texture, tc8);

  // 3. Apply convolution kernel
  vec4 convolution;
if(pct<radio){
  vec4 texel = texture2D(texture, texcoords2);
  if(grey_scale){    
    convolution += vec4(vec3(luma(texel.rgb)), 1.0);
  }
  else if(igrey_scale){
    convolution += vec4(vec3(Irgb(texel.rgb)), 1.0);
  }
  else if(vgrey_scale){
    convolution += vec4(vec3(Vhsv(texel.rgb)), 1.0);
  }
  else if(lgrey_scale){
    convolution += vec4(vec3(Lhsl(texel.rgb)), 1.0);
  }
  else if(hsvgrey_scale){
    convolution += vec4(rgb2hsv(texel.rgb), 1.0);
  }
  else if(mascara){
    for (int i = 0; i < 9; i++) {
      convolution += rgba[i]*mask[i];
    }
  }
  else
  {
    for (int i = 0; i < 9; i++) {
      convolution += rgba[i]*maskDefault[i];
    }
  }
  
}
else
{
  for (int i = 0; i < 9; i++) {
    convolution += rgba[i]*maskDefault[i];
  }
}
  // 4. Set color from convolution
  gl_FragColor = vec4(convolution.rgb, 1.0); 
  
  
}

```

{{< /details >}}



## Conclusiones y trabajo futuro

### CONCLUSIONES:

- El procesamiento de imágenes realizado por software y secuencialmente toma demasiado tiempo de procesamiento, pero con el uso de shaders, el tiempo ya no es un problema, la diferencia entre los tiempos de renderizacion de la implementacion del taller 1 a lo realizado en este punto es muy grande, en la primera entrega era necesario diligenciar los valores de la matriz y luego si lanzar la convolucion pero tardaba demasiado, en este punto se pueden realizar los cambios en linea y los resultados se ven de inmediato, visualizando las implementaciones en equipos de las mismas condiciones.

### TRABAJO FUTURO:

- Como trabajo futuro, se espera poder aplicar un mayor número de filtros a una misma imagen, individualmente y combinados, ya que la combinación de diferentes kernels puede dar mejores resultados. Según la aplicación, es posible que desee aplicar un filtro que elimine las imperfecciones o suavice una imagen y luego aplicar otro que detecte los bordes.


## Referencias

- https://visualcomputing.github.io/docs/illusions/masking/
- https://visualcomputing.github.io/docs/shaders/image_processing/
- https://es.wikipedia.org/wiki/Procesamiento_digital_de_im%C3%A1genes
- https://en.wikipedia.org/wiki/Kernel_%28image_processing%29
- https://en.wikipedia.org/wiki/HSL_and_HSV
- https://setosa.io/ev/image-kernels/
- https://thebookofshaders.com/glossary/?search=distance