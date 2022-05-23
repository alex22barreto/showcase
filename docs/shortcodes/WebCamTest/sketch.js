//Finger Finder
//Mano izq primero luego der
paint = []

// This is like pmouseX and pmouseY...but for every finger [pointer, middle, ring, pinky]
let prevPointer = [
  // Left hand
  [{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}],
  // Right hand
  [{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}]
]


function setup(){
  sketch=createCanvas(400, 380,WEBGL);
  
  colorMap = [
    // Left fingertips
    [color(0, 0, 0), color(255, 0, 255), color(0, 0, 255), color(255, 255, 255)],
    // Right fingertips
    [color(255, 0, 0), color(0, 255, 0), color(0, 0, 255), color(255, 255, 0)]
  ]
  handsfree = new Handsfree({
    showDebug: true, // Comment this out to hide the default webcam feed with landmarks
    hands: true
  })
  handsfree.enablePlugins('browser')
  handsfree.plugin.pinchScroll.disable()
  buttonStart = createButton('Start Webcam')
  buttonStart.class('handsfree-show-when-stopped')
  buttonStart.class('handsfree-hide-when-loading')
  buttonStart.mousePressed(() => handsfree.start())

  // Create a "loading..." button
  buttonLoading = createButton('...loading...')
  buttonLoading.class('handsfree-show-when-loading')

  // Create a stop button
  buttonStop = createButton('Stop Webcam')
  buttonStop.class('handsfree-show-when-started')
  buttonStop.mousePressed(() => handsfree.stop())
}

function draw(){
  background(0)
  drawHands()
  
 
}

function drawHands () {
  const hands = handsfree.data?.hands
  
  // Bail if we don't have anything to draw
  if (!hands?.landmarks) return
  
  // Draw keypoints
  hands.landmarks.forEach((hand, handIndex) => {
    hand.forEach((landmark, landmarkIndex) => {
      // Set color
      // @see https://handsfree.js.org/ref/model/hands.html#data
      
      // Set stroke
      if (handIndex === 0 && landmarkIndex === 8) {
        stroke(color(255, 255, 255))
        strokeWeight(5)
        circleSize = 40
      } else {
        stroke(color(0, 0, 0))
        strokeWeight(0)
        circleSize = 0
      }
     
      
     
      circle(
        // Flip horizontally
        sketch.width - landmark.x * sketch.width,
        landmark.y * sketch.height,
        circleSize)
      print('Equis: '+landmark.x);
      print('Ye: '+landmark.y);
      box(20)
      fill(0,200,0)
      translate(landmark.x-1,landmark.y-1)
    })
    
  })
}