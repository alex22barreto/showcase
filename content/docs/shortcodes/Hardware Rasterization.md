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

## 3d Guis

The main use that we can find using 3d guis is inside virtual realty, at the moment the most used application is on videogames, well implemented, these can immerse the player even more inside the virtual world, even becoming a natural element of the player's experience, poorly implemented it can ruin the immersion, reminding the player that they are inside a virtual world.

![Skyrim Test](/showcase/sketches/3dguiskyrim.gif)

![Half Life Alyx](/showcase/sketches/alyxpuzzle.gif)

## Software Rasterizer

with the use  triangles, we are going to do something similar, in this case using a 2d image, sadly
it is way slower, so we need to wait a while for it to load.

## Future Work

We want to improve our implementation on the 3d rasterizer, removing the useless black dots, as well as improving speed, we also want to try to implement a more immersive way to control the camera and color selection system