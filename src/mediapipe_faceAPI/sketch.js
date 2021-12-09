const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
let currentAction;

function onResults(results) {
  // Draw the overlays.
  canvasCtx.save();
  console.log(results);
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);

  if (results.detections.length > 0 && connection) {
    follow(results.detections);
    drawRectangle(
        canvasCtx, results.detections[0].boundingBox,
        {color: 'blue', lineWidth: 4, fillColor: '#00000000'});

    drawLandmarks(canvasCtx, results.detections[0].landmarks, {
      color: 'red',
      radius: 5,
    });
  }

  canvasCtx.restore();
 
}

function move(action) {
  if (action != currentAction) {
    currentAction = action;
    currentAction();
  }
}

function follow(detections) {
  X = detections[0].landmarks[2].x * canvasElement.width; // this is the nose 

  console.log(X);

  if ((X <= canvasElement.width/3) && (X>=0)) {
    move(left);
  } else if ((X > canvasElement.width/3) && (X <2*canvasElement.width/3)) {
    move(stop);
  } else if ((X > 2*canvasElement.width/3) && (X <canvasElement.width)) {
    move(right);
  }
}


const faceDetection = new FaceDetection({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@0.3/${file}`;
}});

faceDetection.setOptions({
  modelSelection: 0,
  minDetectionConfidence: 0.5
});

faceDetection.onResults(onResults);


const camera = new Camera(videoElement, {
  onFrame: async () => {
    await faceDetection.send({image: videoElement});
  },
  width: 640,
  height: 480
});
camera.start();


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
