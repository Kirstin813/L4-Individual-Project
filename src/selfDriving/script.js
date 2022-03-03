const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

const btnConnect = document.querySelector('#btnConnect');
const btnDisconnect = document.querySelector('#btnDisconnect');
const btnStop = document.querySelector('#btnStop');


// connecting to the robot
btnConnect.addEventListener("click", function() {
  connect();
});

// disconnecting from the robot 
btnDisconnect.addEventListener("click", function() {
  disconnect();
});

// stop the robot moving 
btnStop.addEventListener("click", function() {
  stop();
});
// connection variable to store the state of the connection
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

const drawingUtils = window;
const mpObjectron = window;

function onResults(results) {
  canvasCtx.save();
  canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);
  if (!!results.objectDetections) {
    for (const detectedObject of results.objectDetections) {
      // Reformat keypoint information as landmarks, for easy drawing.
      const landmarks = detectedObject.keypoints.map(x => x.point2d);
      console.log(detectedObject.keypoints.map(x => x.point3d));
      // Draw bounding box.

      //console.log(landmarks);
      drawingUtils.drawConnectors(canvasCtx, landmarks,
          mpObjectron.BOX_CONNECTIONS, {color: '#FF0000'});
      // Draw centroid.
      drawingUtils.drawLandmarks(canvasCtx, [landmarks[0]], {color: '#FFFFFF'});
    }
  }
  canvasCtx.restore();
}

const objectron = new Objectron({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/objectron@0.3.1627447724/${file}`;
}});
objectron.setOptions({
  modelName: 'Cup',
  maxNumObjects: 3,
});
objectron.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await objectron.send({image: videoElement});
  },
  width: 500,
  height: 360
});
camera.start();