# Taller 2

## Contexto
When a low-quality image is zoomed in or processed, the edges tend to become jagged or staggered. To solve this problem, we must apply smoothing to the figure. The process is carried out by generating a subdivision of the original pixels of the image. image in a greater number of pixels, to perform a smoothing of the edges with the use of barycentric coordinates, triangles are calculated on the original image, and taking the colors of each vertex of each triangle and performing a transformation of the color of the interior pixels with which achieves a smoothing of the edges of the original figure.
## Resultados
 {{< details title="p5-iframe markdown" open=false >}}

```js

```
{{< /details >}}




{{< p5-iframe sketch="/showcase/sketches/rasterExample.js" lib1="https://cdn.jsdelivr.net/gh/objetos/p5.quadrille.js/p5.quadrille.js" lib2="p5.js" lib3="p5.sound.js"  width="1020" height="1020" >}}

## Conclusiones y Trabajo Futuro
Improve the rasterization algorithm, changing the naive approach to a better one, able to run trough hardware, making the process faster, and to be able to use even smaller triangles for better results.
