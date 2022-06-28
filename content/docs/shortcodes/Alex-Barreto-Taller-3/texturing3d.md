# Texturizado y coloreado

## Mapeo UV
El texturizado UV permite que los polígonos que componen un objeto 3D se pinten con color (y otros atributos de la superficie) de una imagen normal. 


## Resultados 

Puede usar el primer control deslizante para ajustar la intensidad del color en el canal R del modelo RGB. 


{{< p5-iframe sketch="/showcase/sketches/texturing3d.js" lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js"  lib2="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.1/p5.min.js" lib3="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.1/addons/p5.sound.min.js"  width="325" height="325" >}}

{{< details title="uv.js" open=false >}}
```js

let easycam;
let uvShader;
let colorR;

function preload() {
  // see: https://github.com/VisualComputing/p5.treegl#handling
  uvShader = readShader('/showcase/sketches/shaders/uv.frag', { matrices: Tree.pmvMatrix, varyings: Tree.texcoords2 });
}

function setup() {
  createCanvas(300, 300, WEBGL);
  textureMode(NORMAL);
  // use custom shader
  shader(uvShader);
  colorR = createSlider(0, 1, 0.5, 0.01);
  colorR.position(10, 25);
  colorR.style('width', '280px');
}


function draw() {
  
  uvShader.setUniform('colorR', colorR.value());
  background(200);
  orbitControl();
  axes();
  push();
  noStroke();
  quad(-width / 2, -height / 2, width / 2, -height / 2, width / 2, height / 2, -width / 2, height / 2);
  pop();
}

function mouseWheel(event) {
  return false;
}


```
{{< /details >}}


{{< details title="uv.frag" open=false >}}
```js
precision mediump float;

// the texture coordinates varying was defined in 
// the vertex shader by treegl readShader()
// open your console and & see!
varying vec2 texcoords2;
uniform float colorR;

void main() {
  // glsl swizzling is both handy and elegant
  // see: https://www.khronos.org/opengl/wiki/Data_Type_(GLSL)#Swizzling
  gl_FragColor = vec4(colorR, texcoords2.xy, 1.0);
}

```
{{< /details >}}

## Texture Screen 

{{< p5-iframe sketch="/showcase/sketches/uv_screen.js" lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js"  lib2="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam@1.2.1/p5.easycam.js" width="325" height="325" >}}

{{< details title="uv_screen.js" open=false >}}
```js

let easycam;
let uvShader;
let opacity;

function preload() {
  // see: https://github.com/VisualComputing/p5.treegl#handling
  uvShader = readShader('/showcase/sketches/shaders/uv_alpha.frag', { matrices: Tree.pmvMatrix, varyings: Tree.texcoords2 });
}

function setup() {
  createCanvas(300, 300, WEBGL);
  // easycam stuff
  let state = {
    distance: 250,           
    center: [0, 0, 0],       
    rotation: [0, 0, 0, 1],  
  };
  easycam = createEasyCam();
  easycam.state_reset = state;   
  easycam.setState(state, 2000); 
  textureMode(NORMAL);
  opacity = createSlider(0, 1, 0.5, 0.01);
  opacity.position(10, 25);
  opacity.style('width', '280px');
}

function draw() {
  background(200);
  resetShader();
  axes();
  grid();
  translate(0, -70);
  rotateY(0.5);
  fill(color(255, 0, 255, 125));
  box(30, 50);
  translate(70, 70);
  fill(color(0, 255, 255, 125));
  sphere(30, 50);
  shader(uvShader);
  // https://p5js.org/reference/#/p5.Shader/setUniform
  uvShader.setUniform('opacity', opacity.value());
  // see: https://github.com/VisualComputing/p5.treegl#heads-up-display
  beginHUD();
  noStroke();
  quad(0, 0, width, 0, width, height, 0, height);
  endHUD();
}

function mouseWheel(event) {
  return false;
}

```
{{< /details >}}


{{< details title="uv_screen.frag" open=false >}}
```js
precision mediump float;

varying vec2 texcoords2;
varying vec4 color4;
// uniform is sent by the sketch
uniform float opacity;

void main() {
  gl_FragColor = vec4(texcoords2.xy, 0.0, opacity);
}

```
{{< /details >}}

## Referencias

- https://en.wikipedia.org/wiki/UV_mapping
- https://en.wikipedia.org/wiki/Texture_mapping
- https://visualcomputing.github.io/docs/shaders/texturing/