#  Texturing and Coloring   


## Background

We can use shaders as a texture, this allows us to give any 3d object a more dynamic appearance,
shaders are simple scripts that allows us to map a color to each pixel of a given image, using parameters such as model coordinates. In this workshop we faced the challenge of mapping a shader on a non-primitive object, that is, using begin and end shape on p5, we faced some issues, the main one was that the shader was never applied on our shape, to solve this issue we needed to send the texture coordinates to a vertex shader, which is later sent to the fragment shader, this method allowed us to map our shader as a texture.

### UV Mapping

This is the method used, it allows us to project or map a 2d image into a 3d model, it is called UV because it is using U and V as 2d coordinates, it creates a 2d representation of the 3d object and then "wraps" the 2d image or texture onto it, this is a very convenient way to texture models, although it come with some compromises, like distortion of the textures.

## Results

Now, our first task was to modify our UV to have a blue channel, you can check that out below.
you can use the sliders to adjust the color channels.

UV Shader

{{< p5-iframe sketch="/showcase/sketches/uv.js"  lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" lib2="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam@1.2.1/p5.easycam.js" width="500" height="500" >}}

{{< details title="uv.js" open=false >}}

```js
let uvShader;
let colorR;

function preload() {
  // Define geometry directly in clip space (i.e., matrices: Tree.NONE).
  // Interpolate only texture coordinates (i.e., varyings: Tree.texcoords2).
  // see: https://github.com/VisualComputing/p5.treegl#handling

  uvShader = readShader('/showcase/sketches/shaders/uv.frag', { matrices: Tree.NONE, varyings: Tree.texcoords2 });

}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(470, 470, WEBGL);
  //noStroke();
  // see: https://p5js.org/reference/#/p5/shader
  shader(uvShader);
  // https://p5js.org/reference/#/p5/textureMode
  // best and simplest is to just always used NORMAL
  textureMode(NORMAL);
  colorR = createSlider(0, 1, 0.5, 0.01);
  colorR.position(10, 25);
  colorR.style('width', '280px');
}

function draw() {
  background(0);
  // clip-space quad (i.e., both x and y vertex coordinates ∈ [-1..1])
  // https://p5js.org/reference/#/p5/quad
  // It's worth noting (not mentioned in the api docs) that the quad
  // command also adds the texture coordinates to each of its vertices.
  
  uvShader.setUniform('colorR', colorR.value());
  quad(-1, -1, 1, -1, 1, 1, -1, 1);

}

```

{{< /details >}}

{{< details title="uv.frag" open=false >}}

```js
//-------------------------------------------------------------
precision mediump float;

// the texture coordinates varying was defined in 
// the vertex shader by treegl readShader()
// open your console and & see!
varying vec2 texcoords2;
uniform int v1;
uniform int u_valueX;
uniform int u_valueY;
void main() {
  // glsl swizzling is both handy and elegant
  // see: https://www.khronos.org/opengl/wiki/Data_Type_(GLSL)#Swizzling
  gl_FragColor = vec4(texcoords2, 0.5, 1.0);
}
//-------------------------------------------




```

{{< /details >}}

{{< details title="uv.vert" open=false >}}

```js
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

attribute vec3 aPosition;    // Vertex position
attribute vec2 aTexCoord;    // Vertex texture coordinate
attribute vec3 aNormal;      // Vertex normal
attribute vec4 aVertexColor; // Vertex color

// =====================================

varying vec3 vPosition;
varying vec2 vTexCoord;

void main() {

  // Store the vertex position for use in the fragment shader
  vPosition = aPosition;
  vTexCoord = aTexCoord;

  // Set the vertex position without any change besides the view transformations
  // Note: it is important to apply these matrices to get your shape to render in the correct location
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
}

```

{{< /details >}}


Now, here is the demonstrarion of our sketch, notice that both the fragment and vertex shader are embedded into the same file, this was done simply to ease the process of file tracking.

You can use the first slider to adjust the intensity of the channels depending on the mode chosen.
If you use the coloring mode, the sliders adjust the individual color channels (Red, Blue and Green), it is recommended to disable the camera using the button, since moving the sliders also moves the camera.

UV Shader on a random 4 - vertex figure.

{{< p5-iframe sketch="/showcase/sketches/uv-world.js"  lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" lib2="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam@1.2.1/p5.easycam.js" width="500" height="500" >}}

{{< details title="uvWorld.js" open=false >}}

```js
const vert = `#ifdef GL_ES
precision mediump float;
#endif

// =====================================
// Built in p5js uniforms and attributes
// =====================================

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
attribute vec3 aPosition;    // Vertex position
attribute vec2 aTexCoord;    // Vertex texture coordinate
attribute vec3 aNormal;      // Vertex normal
attribute vec4 aVertexColor; // Vertex color

// =====================================

varying vec3 vPosition;
varying vec2 vTexCoord;

void main() {

  // Store the vertex position for use in the fragment shader
  vPosition = aPosition;
  vTexCoord = aTexCoord;

  // Set the vertex position without any change besides the view transformations
  // Note: it is important to apply these matrices to get your shape to render in the correct location
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
}`;

const frag = `#ifdef GL_ES
precision mediump float;
#endif
  
// Position in world space
varying vec3 vPosition;
// Position in texture space
varying vec2 vTexCoord;
uniform float colorR,colorA,colorG;
uniform int option;
// Ignored
uniform sampler2D uSampler;

void main() {
  // Color based on texture coordinate position
  vec2 st = vTexCoord.xy;
  vec4 tex = texture2D(uSampler, vTexCoord);

  // Go from red to green on one diagonal and white to black on the other.
  if(option == 0){gl_FragColor =vec4(colorR,vTexCoord.xy,1.0);;}
  if(option == 1){gl_FragColor =vec4(vTexCoord.xy,colorR,1.0);;}
  if(option == 2){gl_FragColor =vec4(colorR,colorG,colorA,1.0);;} // R,G,B,A
}`;
let valX=4,valY=2,valZ=0.1;
let camopt=true;
let shdr;
let pos1=0,pos2=10,pos3=100,pos4=10,pos5=50,pos6=-100;
function setup() {
  button = createButton("Randomize");
  button.mousePressed(changeCoords);
  button.position(10,470);
  button2 = createButton("Enable / Disable Cam");
  button2.mousePressed(changeCam);
  button2.position(330,460);
  createCanvas(470, 470, WEBGL);
  shdr = createShader(vert, frag);
  textureMode(NORMAL);
  noStroke();
  colorR = createSlider(0,1 , 0.05, 0.01);
  colorR.position(10, 25);
  colorR.style('width', '280px');
  colorA = createSlider(0, 1, 0.05, 0.01);
  colorA.position(10, 45);
  colorA.style('width', '280px');
  colorG = createSlider(0, 1, 0.05, 0.01);
  colorG.position(10, 65);
  colorG.style('width', '280px');
  option = createSelect();
  option.position(10, 450);
  option.option("Blue/ Red", 0);
  option.option("Green / Blue", 1);
  option.option("Coloring", 2);
}
function changeCam(){
  camopt=!camopt;
  print (camopt);
  if(camopt){
    valX=4;valY=2;valZ=0.1;
  }
  else{
    valX=0;valY=0;valZ=0;
  }
}
function changeCoords(){
  pos1=random(-250,250);
  pos2=random(-250,250);
  pos3=random(-250,250);
  pos4=random(-250,250);
  pos5=random(-250,250);
  pos6=random(-250,250);

}

function draw() {
  background(255);
  shader(shdr);
  orbitControl(valX, valY, valZ);
  if(option.value()==0){
    styler=0;
    shdr.setUniform('option',styler);
  }else if(option.value()==1){
    styler=1;
    shdr.setUniform('option',styler);
  }else if(option.value()==2){
    styler=2;
    shdr.setUniform('option',styler);
  }
  shdr.setUniform('colorR', colorR.value());
  shdr.setUniform('colorA', colorA.value());
  shdr.setUniform('colorG', colorG.value());
  beginShape();
  //Triangulo 2d
  normal(2, 1, 1);
  //Cara 1  
  vertex(pos1, pos2,0,-0.5);
  vertex(pos3, pos4,0,3.5);
  vertex(pos5, pos6,0,0);  
  endShape();
  
}

```

{{< /details >}}

## Conclusions and Future Work

We were able to apply a texture to a "custom" shape by using both a vertex and frament shader, and sending the relevant information (texture coordinates), sadly we were unable to apply the shader using the three channels at the same time, since we were limited by applying color using the coordinates, for future work, so we wish to improve the shader mapping to include the three channels, having a better efecto, also, it would be interesting to apply different shaders and images using this methos.

## References

* https://conceptartempire.com/uv-mapping-unwrapping/
* https://riptutorial.com/opengl/example/32426/using-textures-in-glsl-shaders
* https://docs.unity3d.com/es/2019.4/Manual/Shaders.html
* https://discourse.processing.org/t/beginshape-and-custom-shaders/35021 (This one was specially useful)