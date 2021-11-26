let faceapi;
let video;
let detections;
let noseX = 0;
let noseY = 0;

const detectionOptions = {
  withLandmarks: true,
  withDescriptors: false,
};

function setup() {
  createCanvas(640, 480);
  
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  faceapi = ml5.faceApi(video, detectionOptions, modelReady);
  textAlign(RIGHT);
}

function modelReady() {
  console.log("ready!");
  console.log(faceapi);
  faceapi.detect(gotResults);
}

function gotResults(err, result) {
  if (err) {
    console.log(err);
    return;
  }
  
  detections = result;
  
  background(255);
  image(video, 0, 0, 640, 480);
  if (detections) {
    if (detections.length > 0) {
      drawBox(detections);
      follow(detections);
      //drawLandmarks(detections);
    }
  }
  
  faceapi.detect(gotResults);
}

function follow(detections) {
  for (let i = 0; i < detections.length; i += 1) {
    const nose = detections[i].parts.nose;//._x;
    
    drawPart(nose, false);
    
    for (let j = 0; j < nose.length; j += 1) {
      noseX = nose[j]._x;
      noseY = nose[j]._y;
      
      if ((noseX <= width/3) && (noseX>=0)) {
        textSize(20);
        fill(255);
        text("Moving Robot Left", 10, 470);
      } else if ((noseX > width/3) && (noseX <2*width/3)) {
        textSize(20);
        fill(255);
        text("Moving Robot Forward", 10, 470);
      } else if ((noseX > 2*width/3) && (noseX <width)) {
        textSize(20);
        fill(255);
        text("Moving Robot Right", 10, 470);
      }
      console.log(noseX);
    }
    
    
  }
}

function drawBox(detections) {
  for (let i = 0; i <detections.length; i += 1) {
    const alignedRect = detections[i].alignedRect;
    const x = alignedRect._box._x;
    const y = alignedRect._box._y;
    const boxWidth = alignedRect._box._width;
    const boxHeight = alignedRect._box._height;
    
    noFill();
    stroke(161, 95, 251);
    strokeWeight(2);
    rect(x, y, boxWidth, boxHeight);
  }
}

function drawLandmarks(detections) {
  noFill();
  stroke(161, 95, 251);
  strokeWeight(2);
  
  for (let i = 0; i < detections.length; i+=1) {
    const mouth = detections[i].parts.mouth;
    const nose = detections[i].parts.nose;
    const leftEye = detections[i].parts.leftEye;
    const rightEye = detections[i].parts.rightEye;
    const leftEyeBrow = detections[i].parts.leftEyeBrow;
    const rightEyeBrow = detections[i].parts.rightEyeBrow;
    
    drawPart(mouth, true);
    drawPart(nose, false);
    drawPart(leftEye, true);
    drawPart(leftEyeBrow, false);
    drawPart(rightEye, true);
    drawPart(rightEyeBrow, false);
  }
}

function drawPart(feature, closed) {
  beginShape();
  for (let i = 0; i < feature.length; i += 1) {
    const x = feature[i]._x;
    const y = feature[i]._y;
    vertex(x, y);
  }
  
  if (closed == true) {
    endShape(CLOSE);
  } else {
    endShape();
  }
}