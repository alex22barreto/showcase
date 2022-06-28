# Procedural Texturing

# Background

Is the method of generating textures by providing a set of parameters, these parameters are sent to an algorithm (in our case a shader) and it will create its own variations, using this method, computers generate data automatically, it is quite useful to make large textures , that wouldn't be practical doing by hand, also reduces the need of storage for textures, and provides almost unlimited texture resolution.

Using this method, we can create patters, without using too much computing power (the number of calculations should remain constant).

# Results

Keeping this idea in mind, we use a shader to implement various different patterns, you can choose the style of patter you want to see, use the sliders to change certain parameters of the pattern (like repetition, size or rotation). It is also interesting how we can send different parameters to our shader, like time, using this, we can create more vivid effects like color changing or movement of the texture (see Style 2, which changes its patterns almost every two seconds)

{{< p5-iframe sketch="/showcase/sketches/tiles.js"  lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" lib2="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam@1.2.1/p5.easycam.js" width="600" height="600" >}}

{{< details title="tiles.js" open=false >}}

```js
let pg;
let truchetShader;
let colorer;
let colorer2;
let styler;
let gameStarted = false;
function preload() {
  truchetShader = readShader('truchet.frag', { matrices: Tree.NONE, varyings: Tree.NONE });
}

function setup() {
  colorer = Math.random() * 1.5;
  colorer2 =  Math.random() * 1.5;
  truchetShader.setUniform('v1', colorer);
  truchetShader.setUniform('v2', colorer2);
  createCanvas(600, 600, WEBGL);
  // create frame buffer object to render the procedural texture
  pg = createGraphics(400, 400, WEBGL);
  textureMode(NORMAL);
  noStroke();
  pg.noStroke();
  pg.textureMode(NORMAL);
  // use truchetShader to render onto pg
  pg.shader(truchetShader);
  // emitResolution, see:
  // https://github.com/VisualComputing/p5.treegl#macros
  pg.emitResolution(truchetShader);
  // https://p5js.org/reference/#/p5.Shader/setUniform
  tiling = createSlider(0, 10, 1, 0.05);
  tiling.position(10, 30);
  tiling.style("width", "280px");
  tiling2 = createSlider(3.14, 10, 3.14, 0.05);
  tiling2.position(10, 45);
  tiling2.style("width", "280px");
  truchetShader.setUniform('u_zoom', 3);
  // pg clip-space quad (i.e., both x and y vertex coordinates ∈ [-1..1])
  pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
  // set pg as texture
  texture(pg);
  option = createSelect();
  option.position(10, 10);
  option.option("Donut", 0);
  option.option("Cube", 1);
  option.option("Sphere", 2);
  option.option("Cone", 3);
  option.option("Cylinder", 4);
  option2 = createSelect();
  option2.position(400, 10);
  option2.option("Style 1", 0);
  option2.option("Style 2", 1);
  option2.option("Style 3", 2);
  option2.option("Style 4", 3);
  option2.option("Style 5", 4);
  
}

function draw() {
  background(120);
  orbitControl();
  if(option2.value()==0){
    styler=0;
    truchetShader.setUniform('option',styler);
  }else if(option2.value()==1){
    styler=1;
    truchetShader.setUniform('option',styler);
    truchetShader.setUniform('u_rotater', tiling2.value(4));
  }else if(option2.value()==2){
    styler=2;
    truchetShader.setUniform('option',styler);
  }else if(option2.value()==3){
    styler=3;
    truchetShader.setUniform('option',styler);
  }else if(option2.value()==4){
    styler=4;
    truchetShader.setUniform('option',styler);
  }
  if(option.value()==0){
    torus(100, 50);
  }else if(option.value()==1){
    box(200, 200);
  }else if(option.value()==2){
    sphere(100, 100);
  }else if(option.value()==3){
    cone(100, 200);
  }else if(option.value()==4){
    cylinder(100, 200);
  }
 
  truchetShader.setUniform('u_zoom', tiling.value());
  truchetShader.setUniform('u_rotater', tiling2.value());
  print(tiling2.value());
  // pg clip-space quad (i.e., both x and y vertex coordinates ∈ [-1..1])
  pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
  if(frameCount%60==0){
    truchetShader.setUniform('u_time', frameCount/60);
   
  }
}

```

{{< /details >}}

{{< details title="truchet.frag" open=false >}}

```js
#ifdef GL_ES
precision mediump float;
#endif
#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_zoom, u_rotater;
uniform float v1,v2;
uniform int option;
uniform vec2 u_mouse;



float shape(vec2 st, float N){
    st = st*2.-1.;
    float a = atan(st.x,st.y)+PI;
    float r = TWO_PI/N;
    return abs(cos(floor(.5+a/r)*r-a)*length(st));
}

float box2(vec2 st, vec2 size){
    return shape(st*size,u_rotater);
}

float rect(vec2 _st, vec2 _size){
    _size = vec2(0.5)-_size*0.5;
    vec2 uv = smoothstep(_size,_size+vec2(1e-4),_st);
    uv *= smoothstep(_size,_size+vec2(1e-4),vec2(1.0)-_st);
    return uv.x*uv.y;
}

float hex(vec2 st, float a, float b, float c, float d, float e, float f){
    st = st*vec2(2.,6.);

    vec2 fpos = fract(st);
    vec2 ipos = floor(st);

    if (ipos.x == 1.0) fpos.x = 1.-fpos.x;
    if (ipos.y < 1.0){
        return mix(box2(fpos, vec2(0.84,1.)),box2(fpos-vec2(0.03,0.),vec2(1.)),a);
    } else if (ipos.y < 2.0){
        return mix(box2(fpos, vec2(0.84,1.)),box2(fpos-vec2(0.03,0.),vec2(1.)),b);
    } else if (ipos.y < 3.0){
        return mix(box2(fpos, vec2(0.84,1.)),box2(fpos-vec2(0.03,0.),vec2(1.)),c);
    } else if (ipos.y < 4.0){
        return mix(box2(fpos, vec2(0.84,1.)),box2(fpos-vec2(0.03,0.),vec2(1.)),d);
    } else if (ipos.y < 5.0){
        return mix(box2(fpos, vec2(0.84,1.)),box2(fpos-vec2(0.03,0.),vec2(1.)),e);
    } else if (ipos.y < 6.0){
        return mix(box2(fpos, vec2(0.84,1.)),box2(fpos-vec2(0.03,0.),vec2(1.)),f);
    }
    return 0.0;
}

float hex(vec2 st, float N){
    float b[6];
    float remain = floor(mod(N,64.));
    for(int i = 0; i < 6; i++){
        b[i] = 0.0;
        b[i] = step(1.0,mod(remain,2.));
        remain = ceil(remain/2.);
    }
    return hex(st,b[0],b[1],b[2],b[3],b[4],b[5]);
}

vec2 mirrorTile(vec2 _st, float _zoom){
    _st *= _zoom;
    if (fract(_st.y * 0.5) > 0.5){
        _st.x = _st.x+0.5;
        _st.y = 1.0-_st.y;
    }
    return fract(_st);
}

float fillY(vec2 _st, float _pct,float _antia){
  return  smoothstep( _pct-_antia, _pct, _st.y);
}
vec2 brickTile(vec2 _st, float _zoom){
    _st *= _zoom;

    // Here is where the offset is happening
    _st.x += step(1., mod(_st.y,4.0)) * 0.5;

    return fract(_st);
}

float box(vec2 _st, vec2 _size){
    _size = vec2(0.5)-(u_zoom*0.05);
    vec2 uv = smoothstep(_size,_size+vec2(1e-2),_st);
    uv *= smoothstep(_size,_size+vec2(1e-4),vec2(1.0)-_st);
    if(option==0){
    return uv.x*uv.y;}
    else if(option==2)
    {
        return uv.x+uv.y;
    }else if(option==3)
    {
        return uv.x-uv.y;
    }
}

void main(void){
if (option == 1){
     vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.y *= u_resolution.y/u_resolution.x;

    st *= u_zoom;
    vec2 fpos = fract(st);
    vec2 ipos = floor(st);

    float t = u_time*u_rotater;
    float df = 1.0;
    df = hex(fpos,ipos.x+ipos.y+t)+(1.0-rect(fpos,vec2(0.7)));

    gl_FragColor = vec4(mix(vec3(0.),vec3(0.9),step(0.7,df)),1.0);
}
else if(option ==4){
        vec2 st = gl_FragCoord.xy/u_resolution.xy;
  vec3 color = vec3(0.0);

  st = mirrorTile(st*vec2(1.,2.),5.);
  float x = st.x*u_zoom;
  float a = floor(1.+sin(x*u_rotater));
  float b = floor(1.+sin((x+1.)*3.14));
  float f = fract(x);

  color = vec3( fillY(st,mix(a,b,f),0.01) );
  
   gl_FragColor = vec4(10.5,9.5,color);
    }
    else {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(1.5);
    st = brickTile(st,u_rotater);
    color = vec3(box(st,vec2(v1)));
    gl_FragColor = vec4(10.5,9.5,color);
    }
}

```

{{< /details >}}

# Conclusions and Future Work

It is quite interesting to see how it is possible to add multiple features and processes to the same shader without losing any performance, using a simple if, we were able to implement many different patterns, and we were also able to send parameters, modifying how the texture looked. For the future we wish to implement more animated textures, or even, be able to send video or the web cam as shader and try to generate patterns using these sources.

# References

Patterns code found on The Book Of Shaders 

* https://thebookofshaders.com/examples/
* https://en.wikipedia.org/wiki/Procedural_texture
* https://conceptartempire.com/procedural-textures-maps/

