# Rasterization

Is the process of taking an image, described in a vector graphics format
and converting it into a series of pixels, dots, or almost any shape.

When these shapes are together, they will form the original image.

Vector graphics are a set of mathematical statements which place lines shapes in a 3d or 2d enviroment, being generally a group of mathematical curves, these are great for printing or image manipulation, even when enlarger they retain detail and quality, while raster graphics uses bitmaps
to store information, this can limit the quality depending on resolution and file size.




## Showcase
![PhotoTest](/showcase/sketches/skulltest.jpg)

Now we will take this picture and we will try to rasterize it, we will divide
the image into many tiles, each individual tile will be analyzed and according to its
contrast we will paint it black or white, black for high and white for low.
Also the darker the tile, the closer to the screen it will be.

Since the image is smaller than the canvas, we have a lot of useless black dots.



{{< p5-iframe sketch="/showcase/sketches/sketchRaster.js"  lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" lib2="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam@1.2.1/p5.easycam.js" width="740" height="550" >}}

## Contacto
klalvarezm@unal.edu.co