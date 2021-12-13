let faceapi;
let video;
let detections;
let options;

const detectionOptions = {
  withLandmarks: true,
  withDescriptors: false,
};

function setup() {
  var cnv = createCanvas(640, 480);
  
  /* Center the video */
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
  
  /* Default option is front facing camera */
  options = {
    video: {
      faceingMode: {
        exact: "user"
      }
    }
  };

  video = createCapture(options); // Creates a HTML5 video using the webcam or the camera on a smartphone
  video.size(640, 480); // Resize the video to fit the display width and height 
  video.hide(); // Hide the video feed 
  pixelDensity(1);
  noStroke();

  faceapi = ml5.faceApi(video, detectionOptions, modelReady);

  /* Adding a "switch camera" button to be able to switch the camera using createCapture */
  switchButton = createButton('Switch Camera');
  switchButton.position(19, 100);
  switchButton.mousePressed(switchCamera);
}

let switchFlag = false;
let switchButton;

/* Function to switch the camera depending if the switchFlag has been set to true or false*/
function switchCamera() {
  switchFlag = !switchFlag;
  stopCapture(); // Stops the current createCapture
  if(switchFlag == true) {
    video.remove(); // Removes the video currently being captured
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
  pixelDensity(1);
  noStroke();

  faceapi = ml5.faceApi(video, detectionOptions, modelReady); // test to see if this works
}

/* Function to stop the current capture*/
function stopCapture() {
  let stream = video.elt.srcObject;
  let tracks = stream.getTracks();

  tracks.forEach(function(track) {
    track.stop();
  });

  video.elt.srcObject = null;
}

/* Check if the models have been loaded and are ready to use */
function modelReady() {
  console.log("ready!");
  console.log(faceapi);
  faceapi.detect(gotResults);
}

/* Using the results, detect the face and draw landmarks */
function gotResults(err, result) {
  if (err) {
    console.log(err);
    return;
  }
  
  detections = result;
  
  background(255);
  image(video, 0, 0, 640, 480);

  if (detections && connection) {
    if (detections.length > 0) {
      drawBox(detections);
      follow(detections);
    }
  }
  
  faceapi.detect(gotResults);
}

let currentAction;

/* Function to move/update the moving action of the robot */
function move(action) {
  if (action != currentAction) {
    currentAction = action;
    currentAction();
  }
}

let noseX = 0;
let noseY = 0;

/* Follow the face, depending which area of the canvas it is in it will move either left or right */
function follow(detections) {
  for (let i = 0; i < detections.length; i += 1) {
    const nose = detections[i].parts.nose;
    
    drawPart(nose, false); // Draws the nose on the canvas
    
    for (let j = 0; j < nose.length; j += 1) {
      noseX = nose[j]._x; // x coordinate of the nose 
      
      // If the nose is within the left third of the canvas then it turns left 
      if ((noseX <= width/3) && (noseX>=0)) {
        move(left);
        textSize(20);
        fill(255);
        text("Moving Robot Left", 180, 470);
      // If the nose is within the middle of the canvas then the robot stops moving 
      } else if ((noseX > width/3) && (noseX <2*width/3)) {
        move(stop);
        textSize(20);
        fill(255);
        text("Face is in the centre", 220, 470);
      // If the nose is within the right third of the canvas then it turns right
      } else if ((noseX > 2*width/3) && (noseX <width)) {
        move(right);
        textSize(20);
        fill(255);
        text("Moving Robot Right", 220, 470);
      }
    }
    
    
  }
}

/* Draws a bouding box around the indentified face */
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

/* Draws the shape of the landmark on the face i.e. the nose */
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

/**
 * Following functions implement the actions the robot can take 
 *  Forward
 *  Backward
 *  Left
 *  Right
 *  Stop
 */

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

function stop() {
  if (connection) {
    connection.write("stop();\n");
  }
}

