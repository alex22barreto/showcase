## Resultados

 {{< details title="p5-iframe markdown" open=false >}}

```js

  let kernel = [[-1, -1, -1 ], [ -1,  9, -1 ], [-1, -1, -1 ]]; 
  function setup() {
  createCanvas(350, 300,WEBGL);
 
 
  xSensitivitySlider = createSlider(0, 5, 1, 0.1);
  xSensitivitySlider.position(20, 50);
 
  ySensitivitySlider = createSlider(0, 5, 1, 0.1);
  ySensitivitySlider.position(20, 80);
 
  zSensitivitySlider = createSlider(0, 5, 1, 0.1);
  zSensitivitySlider.position(20, 110);
}

function draw() {
 
background("green");
text("Move the sliders to modify the x, y and"
         + " z orbit sensitivity", -285, -125);
  strokeWeight(3);
 
  xSensitivity = xSensitivitySlider.value();
  ySensitivity = ySensitivitySlider.value();
  zSensitivity = zSensitivitySlider.value();
 
  text("x Sensitivity is: " + xSensitivity, -285, 100);
  text("y Sensitivity is: " + ySensitivity, -285, 120);
  text("z Sensitivity is: " + zSensitivity, -285, 140);
 
  // Enable default lights
 
 
  orbitControl(xSensitivity, ySensitivity, zSensitivity);
 
 
 
  push();
    beginShape();
//Triangulo 2d

//Cara 1  
vertex(0, 10,0);
  //Punto derecha
  vertex(100, 10,0);
  //Vertex Central
  vertex(50, -100,-25);  
  //Union
  vertex(0, 10,0)
 
//Cara 2
vertex(50,10,-100)  
vertex(50, -100,-25);  

//Cara 3
  vertex(50,10,-100)
  vertex(100, 10,0);  
 
endShape();
  pop();
}
```
{{< /details >}}

{{< p5-iframe sketch="/showcase/sketches/sketchwebgl.js" width="600" height="600" >}}
## Conclusiones y Trabajo Futuro