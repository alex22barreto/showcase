# Image Processing

## Background

We can use a different set of algorithms to process (modify, transform) and image, in this case, we are going to use Convolutional Masks to transform an image and obtain different features of the image, and also we can see different effects on the image.

### Convolutional Masks

Is a small matrix (in our case is a 9x9 matrix) which includes weightings (set of values that gives "relevance") which are applied on pixel values in order to change the image and create different effects.
Convolution is the process of flipping both the rows and columns of the kernel (our matrix) and multiplying locally similar entries and summing. The element at the central coordinates of the resulting image would be a weighted combination of all the entries of the image matrix, with weights given by the kernel

## Results

Using our shader we could apply different effects by simply modifying the kernel values, to make the magnifying glass, we used p5's function copy, that allows to take a rectangular section, stretching it, and the mapping this rectangle, giving the illusion of zooming in the image on an area.

{{< p5-iframe sketch="/showcase/sketches/mask.js"  lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" lib2="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam@1.2.1/p5.easycam.js" width="680" height="520" >}}

{{< details title="mask.js" open=false >}}

```js
/*Testing*/

/*Testing*/

let maskShader;
let img;
let video_src;
let video_on;
let mask;

function preload() {
  video_src = createVideo(['mandrill.webm']);
  video_src.hide(); // by default video shows up in separate dom
  maskShader = readShader('mask.frag', { varyings: Tree.texcoords2 });
  img = loadImage('ojos.jpg');
 
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(650, 500, WEBGL);
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
  video_on.position(10, 10);
  //Adding kernel options
  option = createSelect();
  option.position(520, 10);
  option.option("None", 0);
  option.option("Blue", 1);
  option.option("Ridge", 2);
  option.option("Bottom Sobel", 3);
  option.option("Emboss", 4);
  

  shader(maskShader);
  maskShader.setUniform('texture', img);
  emitTexOffset(maskShader, img, 'texOffset');
}

function draw() {
  background(0);
  // /*
  if (option.value()==0) {
    maskShader.setUniform('mask', [0, 0, 0, 0, 1, 0, 0, 0, 0]);
  }
  else if (option.value()==1) {
    maskShader.setUniform('mask', [0.0625, 0.125, 0.0625, 0.125, 0.25, 0.125, 0.0625, 0.125, 0.0625]);
  }
  else if (option.value()==2) {
    maskShader.setUniform('mask', [-2, -1, 0, -1, 1, 1, 0, 1, 2]);
  }
  else if (option.value()==3) {
    maskShader.setUniform('mask', [-1, -2, -1, 0, 0, 0, 1, 2, 1]);
  }
  else if (option.value()==4) {
    maskShader.setUniform('mask', [-1, -1, -1, -1, 8, -1, -1, -1, -1]);
  }
  
  quad(-width / 2, -height / 2, width / 2, -height / 2, width / 2, height / 2, -width / 2, height / 2);
  push();
  // Origin X Y,taking size, Destination, Destination SIZE 
  copy( mouseX - width/2, mouseY - height/2, 50, 50, mouseX - width/2, mouseY - height/2, 100, 100);
  stroke(255,0,0);
  noFill();
  // Rectangle shows area being copied
  rect(mouseX - width/2, mouseY - height/2, 100, 100);
  pop(); 
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

// we need our interpolated tex coord
varying vec2 texcoords2;

void main() {
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
  for (int i = 0; i < 9; i++) {
    convolution += rgba[i]*mask[i];
  }

  // 4. Set color from convolution
  gl_FragColor = vec4(convolution.rgb, 1.0); 
}
```

{{< /details >}}

## Conclusions and Future Work

We discovered that using this method, we were able to obtain extremely fast loading times for the desired effects, specially compare to our first convolution method using software, now we can even apply masks to a video without any issue, contrary to our software method, that ran poorly and hanged often.

## References
 * https://setosa.io/ev/image-kernels/
 * https://www.tutorialspoint.com/dip/concept_of_convolution.htm
 * https://p5js.org/reference/#/p5/copy
 * https://github.com/processing/p5.js/issues/995
