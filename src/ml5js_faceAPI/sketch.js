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
  var cnv = createCanvas(640, 480);

  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
  
  /*default option is front facing camera*/
  options = {
    video: {
      faceingMode: {
        exact: "user"
      }
    }
  };

  video = createCapture(options);
  video.size(640, 480);
  video.hide();
  faceapi = ml5.faceApi(video, detectionOptions, modelReady);

  switchButton = createButton('Switch Camera');
  switchButton.position(19, 100);
  switchButton.mousePressed(switchCamera);

  //textAlign(RIGHT);
}

/* function to switch the camera depending if the switchFlag has been set to true or false*/
function switchCamera() {
  switchFlag = !switchFlag;
  stopCapture(); //stops the current createCapture
  if(switchFlag == true) {
    video.remove(); //removes the video currently being captured
    options = {
      video: {
        facingMode: {
          exact: "environment"
        }
      }
    };
  } else {
    video.remove();
    options = {
      video: {
        facingMode: {
          exact: "user"
        }
      }
    };
  }

  video = createCapture(options); // create a new capture using the updated options 
  video.size(640, 480); //resize the video to fit the display width and height 
  video.hide(); //hide the video feed 
  //pixelDensity(1);
  noStroke();
}

/* function to stop the current capture*/
function stopCapture() {
  let stream = video.elt.srcObject;
  let tracks = stream.getTracks();

  tracks.forEach(function(track) {
    track.stop();
  });

  video.elt.srcObject = null;
}

function modelReady() {
  console.log("ready!");
  console.log(faceapi);
  faceapi.detect(draw);
}

function draw(err, result) {
  if (err) {
    console.log(err);
    return;
  }
  
  detections = result;
  
  background(255);
  image(video, 0, 0, 6);
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
      //noseY = nose[j]._y;
      
      if ((noseX <= width/3) && (noseX>=0)) {
        left();
        textSize(20);
        fill(255);
        text("Moving Robot Left", 180, 470);
      } else if ((noseX > width/3) && (noseX <2*width/3)) {
        console.log("stp moving robot");
        stop();
        textSize(20);
        fill(255);
        text("Face is in the centre", 220, 470);
      } else if ((noseX > 2*width/3) && (noseX <width)) {
        right();
        textSize(20);
        fill(255);
        text("Moving Robot Right", 220, 470);
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


let connection;

function onLine(lineString) {
  console.log(lineString.trim());
}

function connect() {
  if (connection) {
    disconnect()
  }
  UART.connect(function(c) {
        if (!c) {
          console.log("Couldn't connect!");
          return;
        }
        connection = c;
        // Handle the data we get back, and call 'onLine'
        // whenever we get a line
        var buf = "";
        connection.on("data", function(d) {
          buf += d;
          var i = buf.indexOf("\n");
          while (i>=0) {
            onLine(buf.substr(0,i));
            buf = buf.substr(i+1);
            i = buf.indexOf("\n");
          }
        });
  });
}

function disconnect() {
  if (connection) {
    connection.close();
    connection = undefined;
  }
}

// Writing the basic 4 functions used by the robot - Forward, Backward, Left and Right

function forward() {
  if (connection) {
    connection.write('forward();\n');
  }
}

function backward() {
  if (connection) {
    connection.write('backward();\n');
      }
}

function left() {
  if (connection) {
    connection.write('left();\n');
  }
}

function right() {
  if (connection) {
    connection.write('right();\n');
  }
}

// function to stop performing the actions 

function stop() {
  if (connection) {
    connection.write("stop();\n");
  }
}
