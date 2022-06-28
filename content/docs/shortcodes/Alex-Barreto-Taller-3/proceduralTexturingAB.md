# Textura de procedimiento
 
En gráficos por computadora , una textura de procedimiento es una textura creada utilizando una descripción matemática (es decir, un algoritmo ) en lugar de datos almacenados directamente. La ventaja de este enfoque es el bajo costo de almacenamiento, la resolución ilimitada de texturas y el fácil mapeo de texturas.
 
Este tipo de texturas se utilizan a menudo para modelar superficies o representaciones volumétricas de elementos naturales como madera , mármol , granito , metal , piedra y otros.
 
## Patrones
Dado que los programas de shaders se ejecutan píxel por píxel, no importa cuánto repita una forma, el número de cálculos permanece constante. Esto significa que los shaders de fragmentos son particularmente adecuados para patrones de mosaico.
 
## Implementación
 
Teniendo en cuenta que se quiere realizar patrones de mosaico sobre la superficie de distintas figuras, además de generar los patrones le podemos asignar movimiento, inspirado y guiado por los código de shaders presentes en "The Book of Shaders" en la seccion [Patterns](https://thebookofshaders.com/09/), realize la implmentacion de un patron de circulos sobre una superficie esférica, donde al pasar el puntero sobre la superficie se genera movimiento sobre el patrón de la textura y girando la superficie dando click y arrastrando.
En el segundo shader se genera sobre una superficie cúbica un patrón de ladrillos el cual cambia dependiendo del número de frames y pudiendo detener la el cambio del patrón con una caja de selección.

## Ejercicio 1

{{< p5-iframe sketch="/showcase/sketches/truchet_tilesABej.js" lib2="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.1/p5.min.js" lib3="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.1/addons/p5.sound.min.js" lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="500" height="500" >}}


{{< details title="truchet.js" open=false >}}

```js

let pg;
let truchetShader;

function preload() {
  // shader adapted from here: https://thebookofshaders.com/09/
  truchetShader = readShader('/showcase/sketches/shaders/truchetABej.frag', { matrices: Tree.NONE, varyings: Tree.NONE });
}

function setup() {
  createCanvas(400, 400, WEBGL);
  
  pg = createGraphics(400, 400, WEBGL);
  textureMode(NORMAL);
  noStroke();
  pg.noStroke();
  pg.textureMode(NORMAL);
  

  pg.shader(truchetShader);
  
  pg.emitResolution(truchetShader);
  
  truchetShader.setUniform('u_zoom', 3);
  
  pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
  
  texture(pg);
}

function draw() {
  background(33);
  orbitControl();
  sphere(100, 100);  
}

function mouseMoved() {
  
  truchetShader.setUniform('u_zoom', int(map(mouseX, 0, width, 1, 30)));
  truchetShader.setUniform('u_rotater', (mouseY - height/2)/50);
  
  pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
}

```

{{< /details >}}


{{< details title="truchet.frag" open=false >}}

```js

// Codigo tomado y modificado de https://thebookofshaders.com/09/

#ifdef GL_ES
precision mediump float;
#endif

const float PI = 3.1415926535897932384626433832795;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_rotater;

vec2 movingTiles(vec2 _st, float _zoom, float _speed){
    _st *= _zoom;
    float time = u_rotater*_speed;
    if( fract(time)>0.5 ){
        if (fract( _st.y * 0.5) > 0.5){
            _st.x += fract(time)*2.0;
        } else {
            _st.x -= fract(time)*2.0;
        }
    } else {
        if (fract( _st.x * 0.5) > 0.5){
            _st.y += fract(time)*2.0;
        } else {
            _st.y -= fract(time)*2.0;
        }
    }
    return fract(_st);
}

float circle(vec2 _st, float _radius){
    vec2 pos = vec2(0.5)-_st;
    return smoothstep(1.0-_radius,1.0-_radius+_radius*0.2,1.-dot(pos,pos)*3.14);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    st = movingTiles(st,10.,0.5);

    vec3 color = vec3( 1.0-circle(st, 0.3 ) );

    gl_FragColor = vec4(color,1.0);
}

```

{{< /details >}}


## Ejercicio 2

{{< p5-iframe sketch="/showcase/sketches/truchet_tilesABLadrillo.js" lib2="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.1/p5.min.js" lib3="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.1/addons/p5.sound.min.js" lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="500" height="500" >}}

{{< details title="truchet.js" open=false >}}

```js

let pg;
let truchetShader;

let mask;

function preload() {
  // shader adapted from here: https://thebookofshaders.com/09/
  truchetShader = readShader('/showcase/sketches/shaders/truchetABLadrillo.frag', { matrices: Tree.NONE, varyings: Tree.NONE });
}

function setup() {
  createCanvas(400, 400, WEBGL);
  
  pg = createGraphics(400, 400, WEBGL);
  textureMode(NORMAL);
  noStroke();
  pg.noStroke();
  pg.textureMode(NORMAL);
  
  pg.shader(truchetShader);
  
  pg.emitResolution(truchetShader);
  
  truchetShader.setUniform('u_zoom', 3);  
  pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
  
  texture(pg);

  mask = createCheckbox('Generar Textura', true);
  mask.position(10, (440));
  mask.style('color', 'white');
}

function draw() {

  background(33);
  orbitControl();
  box(200, 200); 

  if(frameCount%25==0 && mask.checked()){
    truchetShader.setUniform('u_time', frameCount/50);   
    
  }
  
  truchetShader.setUniform('u_zoom', int(map(mouseX, 0, width, 1, 30)));
  truchetShader.setUniform('u_rotater', (mouseY - height/2)/50);
  pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
  
}

```

{{< /details >}}


{{< details title="truchet.frag" open=false >}}

```js

// Codigo tomado y modificado de https://thebookofshaders.com/09/

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

vec2 brickTile(vec2 _st, float _zoom){
    _st *= u_time;

    // Here is where the offset is happening
    _st.x += step(1., mod(_st.y,2.0)) * 0.5;

    return fract(_st);
}

float box(vec2 _st, vec2 _size){
    _size = vec2(0.5)-_size*0.5;
    vec2 uv = smoothstep(_size,_size+vec2(1e-4),_st);
    uv *= smoothstep(_size,_size+vec2(1e-4),vec2(1.0)-_st);
    return uv.x*uv.y;
}

void main(void){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    st = brickTile(st,5.0);

    color = vec3(box(st,vec2(0.9)));
    
    gl_FragColor = vec4(color,1.0);
}


```

{{< /details >}}

## Conclusiones y trabajo futuro

### CONCLUSIONES:

- Es muy interesante cómo se pueden generar patrones o texturas para superficies sin necesidad de mantenerlos almacenados y con un costo computacional bastante bajo, además de poder dar animación a los patrones de manera eficiente.

- En la segunda implementación cabe destacar como la modificación a través del tiempo de un parámetro con el cual se construye el patrón cambia el patrón en sí, al verlo de manera local no se ve un cambio significativo pero al verlo sobre el total de la superficie se puede ver la generación de otros patrones dependiendo del tiempo, incluso se llega a generar ilusiones visuales como algunas curvaturas. 

### TRABAJO FUTURO:

- Como trabajo futuro, se espera poder generar patrones más complejos donde se puedan simular texturas de la naturaleza de forma indistinguible, además de generar texturas con animación que sean de igual forma indistinguibles al compararlo con un video de una textura de la naturaleza. 





## Referencias

- https://en.wikipedia.org/wiki/Procedural_texture
- https://thebookofshaders.com/09/
- https://visualcomputing.github.io/docs/shaders/procedural_texturing/