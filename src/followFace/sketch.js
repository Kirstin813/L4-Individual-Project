const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

/* Query Selector for the front and back camera options */
const btnfront = document.querySelector('#btn-front');
const btnback = document.querySelector('#btn-back');

let currentAction;

/** This section allows the camera to be switched.
 * Current Status: NOT WORKING
 */

function setupCamera() {

  const supports = navigator.mediaDevices.getSupportedConstraints();
  if(!supports['facingMode']) {
    alert('Browser is not supported');
  } 

  let stream;

  const capture = async facingMode => {
    const options = {
      audio: false,
      video: {
        facingMode,
      },
    };
  

    try {
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
      stream = await navigator.mediaDevices.getUserMedia(options);
    } catch (e) {
      alert(e);
      return;
    }

    videoElement.srcObject =  null;
    videoElement.srcObject = stream;

    return new Promise((resolve) => {
      videoElement.onloadedmetadata = () => {
        resolve(videoElement);
      };
    });
  }
}

/* Event listeners for the back and front camera buttons 
btnfront.addEventListener('click', () => {
  capture('user');
});

btnback.addEventListener('click', () => {
  capture('environment');
});
*/

/* Uses the results from the API to identify and track the face */
function onResults(results) {
  // Draw the overlays i.e. bouding box and landmarks
  
  canvasCtx.save();
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

/* Function to move/update the moving action of the robot */
function move(action) {
  if (action != currentAction) {
    currentAction = action;
    currentAction();
  }
}

/**
 * Follows the position of the nose 
 * 
 * If it is within the left third of the canvas the robot moves left 
 * If it is within the middle of the canvas the robot stops moving 
 * If it is within the right third of the canvas the robot moves right 
 */
function follow(detections) {
  X = detections[0].landmarks[2].x * canvasElement.width; // this is the nose 

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

/* Sets the parameters for the face dectection i.e. how accurate/confident or the max distance from the camera */
faceDetection.setOptions({
  modelSelection: 0,
  minDetectionConfidence: 0.5
});

faceDetection.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await setupCamera();
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

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}