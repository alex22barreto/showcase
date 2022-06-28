# Texture Sampling



## Background

The main idea is to treat our image like a set of values, this allows us to sample it, or getting a finite number of values from said image, we then, can play with these values adding more effects, or altering the properties of our image, or even applying filters.

### Luma

Luma allows us to see the light intensity in an image, by removing color, it shows areas with greater luminance in a whiter color, and a darker color in areas without light.

![Luma Demonstration](./luma.jpg)

### HSV

It is a color space focused mainly on the hue (what color), saturation (how strong) and color (how dark) value of a given image.

Here you can see it better

![HSV Demonstration](./hsvCylinder.png)

Finally, with this 3 parameters, we map them as rgb values on a new image, getting new effects.

### HSL

This is similar to HSV focusing mainly on Hue, saturation and lightness, and we also focus on converting these values to rgb and mapping them into an image.

![HSL Demonstration](./hsl.png)

## Results

Finally, you can see the different effects, we are also able to add "color filtering" by playing with the rgb values of the image, keep in mind that these effects don't work with the luma option, since it is in black and white.

{{< p5-iframe sketch="/showcase/sketches/lumaKV.js"  lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" lib2="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam@1.2.1/p5.easycam.js" width="710" height="520" >}}

{{< details title="lumaKV.js" open=false >}}

```js
let lumaShader;
let img;
let grey_scale;

function preload() {
  lumaShader = readShader('luma.frag', { varyings: Tree.texcoords2 });
  // image source: https://en.wikipedia.org/wiki/HSL_and_HSV#/media/File:Fire_breathing_2_Luc_Viatour.jpg
  img = loadImage('./planeta.jpg');
}

function setup() {
  createCanvas(690, 490, WEBGL);
  noStroke();
  textureMode(NORMAL);
  option = createSelect();
  option.position(10, 10);
  option.option("None", 0);
  option.option("Luma", 1);
  option.option("HSV", 2);
  option.option("HSL", 3);
  option2 = createSelect();
  option2.position(610, 10);
  option2.option("None", 0);
  option2.option("Red", 1);
  option2.option("Green", 2);
  option2.option("Blue", 3);
  shader(lumaShader);
  lumaShader.setUniform('texture', img);
}

function draw() {
  background(0);
  if (option.value() ==0){
    lumaShader.setUniform('chaval', 0); 
  }
  else if (option.value() ==1){
    lumaShader.setUniform('chaval', 1); 
  }else if (option.value() ==2){
    lumaShader.setUniform('chaval', 2); 
  }else if (option.value() ==3){
    lumaShader.setUniform('chaval', 3); 
  }

  if (option2.value() ==0){
    lumaShader.setUniform('colval', 0); 
  }
  else if (option2.value() ==1){
    lumaShader.setUniform('colval', 1); 
  }else if (option2.value() ==2){
    lumaShader.setUniform('colval', 2); 
  }else if (option2.value() ==3){
    lumaShader.setUniform('colval', 3); 
  }


  quad(-width / 2, -height / 2, width / 2, -height / 2, width / 2, height / 2, -width / 2, height / 2);
}
```

{{< /details >}}

{{< details title="luma.frag" open=false >}}

```js
precision mediump float;

// uniforms are defined and sent by the sketch
bool grey_scale;
uniform sampler2D texture;
uniform int chaval;
uniform int colval;
// interpolated texcoord (same name and type as in vertex shader)
varying vec2 texcoords2;
uniform sampler2D tex;
uniform vec3 hue;

vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
float luma(vec3 texel) {
  return 0.299 * texel.r + 0.587 * texel.g + 0.114 * texel.b;
}

vec3 rgb2hsl( vec3 c ){
  float h = 0.0;
	float s = 0.0;
	float l = 0.0;
	float r = c.r;
	float g = c.g;
	float b = c.b;
	float cMin = min( r, min( g, b ) );
	float cMax = max( r, max( g, b ) );

	l = ( cMax + cMin ) / 2.0;
	if ( cMax > cMin ) {
		float cDelta = cMax - cMin;
        
        //s = l < .05 ? cDelta / ( cMax + cMin ) : cDelta / ( 2.0 - ( cMax + cMin ) ); Original
		s = l < .0 ? cDelta / ( cMax + cMin ) : cDelta / ( 2.0 - ( cMax + cMin ) );
        
		if ( r == cMax ) {
			h = ( g - b ) / cDelta;
		} else if ( g == cMax ) {
			h = 2.0 + ( b - r ) / cDelta;
		} else {
			h = 4.0 + ( r - g ) / cDelta;
		}

		if ( h < 0.0) {
			h += 6.0;
		}
		h = h / 6.0;
	}
	return vec3( h, s, l );
}


void main() {
  vec4 salVal;
 if(chaval == 0 || chaval == 1) {
  if(chaval==0){
    grey_scale=false;
    }
  else if(chaval==1){
    grey_scale=true;
    }
  vec4 texel = texture2D(texture, texcoords2);
  salVal = grey_scale ? vec4((vec3(luma(texel.rgb))), 1.0) : texel;}

  if (chaval == 2){
    vec4 textureColor = texture2D(texture, texcoords2);
    vec3 fragRGB = textureColor.rgb;
    vec3 fragHSV = rgb2hsv(fragRGB).xyz;
   salVal = vec4(fragHSV, 1.0);
  }
  if (chaval == 3){
    vec4 textureColor = texture2D(texture, texcoords2);
    vec3 fragRGB = textureColor.rgb;
    vec3 fragHSL = rgb2hsl(fragRGB).xyz;
    salVal = vec4(fragHSL, textureColor.w);
  }
  if(colval==0 && chaval!=1){
    salVal.rgb=salVal.rgb*1.0;
  }
  if(colval==1 && chaval!=1){
    salVal.rgb=salVal.rgb*vec3(1.0, 0.0, 0.0);
  }
  if(colval==2 && chaval!=1){
    salVal.rgb=salVal.rgb*vec3(0.0, 1.0, 0.0);
  }
  if(colval==3 && chaval!=1){
    salVal.rgb=salVal.rgb*vec3(0.0, 0.0, 1.0);
  }
  
  gl_FragColor=salVal;
}

```

{{< /details >}}

## Conclusions and Future Work

We can see some strange effect while using HSV and HSL, it seems to generate pixelation and artifacting in some parts of the image, we wish to know what this happens, and also try to implement a cleaner solution for this unwanted effects, or to detect if this artifacting actually happens because of an element on the image that cannot be seen on the normal color space.

## References

* http://www.chaospro.de/documentation/html/paletteeditor/colorspace_hsl.htm
* https://www.ronja-tutorials.com/post/041-hsv-colorspace/
* https://support.apple.com/es-es/guide/motion/motn14b9a05a/mac