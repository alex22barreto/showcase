/*
Eye Tracking Tomado de:
Jeff Thompson | 2021 | jeffreythompson.org

Referencias
+ https://github.com/tensorflow/tfjs-models/tree/master/blazeface
+ https://arxiv.org/abs/1907.05047



*/

let video;  // webcam input
let model;  // BlazeFace machine-learning model
let face;   // detected face

// print details when a face is
// first found
let firstFace = true;


function setup() {
  var canvas=createCanvas(400, 380,WEBGL);
  canvas.parent('sketch-holder');
  video = createCapture(VIDEO);
  video.size(300,300)
  video.hide();

  // load the BlazeFace model
  loadFaceModel();
}


// TensorFlow requires the loading of the
// model to be done in an asynchronous function
// this means it will load in the background
// and be available to us when it's done
async function loadFaceModel() {
  model = await blazeface.load();
}


function draw() {
  scale(-1, 1);
  background(200);
  // if the video is active and the model has
  // been loaded, get the face from this frame
  if (video.loadedmetadata && model !== undefined) {
    getFace();
  }

  // if we have face data, display it
  if (face !== undefined) {
    image(video, -200,-170, width,height);

    // if this is the first face we've
    // found, print the info
    if (firstFace) {
      console.log(face);
      firstFace = false;
    }

    // the model returns us a variety of info
    // (see the output in the console) but the
    // most useful will probably be landmarks,
    // which correspond to facial features
    let leftEye =  face.landmarks[1];
    // the points are given based on the dimensions
    // of the video, which may be different than
    // your canvas – we can convert them using map()!
    leftEye =  scalePoint(leftEye);
   

    // from there, it's up to you to do fun
    // stuff with those points!
    push();// begin motion
    translate(leftEye.x-450,leftEye.y-300,leftEye.z+3);
    fill(0,220,210);
    box(20,20);
    pop();//end motion
    
  }
}


// a little utility function that converts positions
// in the video to the canvas' dimensions
function scalePoint(pt) {
  let x = map(pt[0], 0,video.width, 0,width);
  let y = map(pt[1], 0,video.height, 0,height);
  return createVector(x, y);
}


// like loading the model, TensorFlow requires
// we get the face data using an async function
async function getFace() {
  
  // get predictions using the video as
  // an input source (can also be an image
  // or canvas!)
  const predictions = await model.estimateFaces(
    document.querySelector('video'),
    false
  );

  // false means we want positions rather than 
  // tensors (ie useful screen locations instead
  // of super-mathy bits)
  
  // if we there were no predictions, set
  // the face to undefined
  if (predictions.length === 0) {
    face = undefined;
  }

  // otherwise, grab the first face
  else {
    face = predictions[0];
  }
}

