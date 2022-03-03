(function () {

  /* Checking if the media devices is suitable for the camera api */
    if (
      !"mediaDevices" in navigator ||
      !"getUserMedia" in navigator.mediaDevices
    ) {
      alert("Camera API is not available in your browser");
      return;
    }
  
    // Canvas and Video elements
    const video = document.querySelector("#video");
    const startCamera = document.querySelector("#startCamera");
    const btnConnect = document.querySelector('#btnConnect');
    const btnDisconnect = document.querySelector('#btnDisconnect');
    const btnStop = document.querySelector('#btnStop');
    const canvas = document.getElementById("canvas");
    var context = canvas.getContext('2d');

    // Variable for the current action the robot is taking 
    let currentAction;
  
    // video constraints
    const constraints = {
      video: {
        width: 500, 
        height: 360
      },
    };
  

    // default true (front facing camera), false (back facing camera)
    let useFrontCamera = true;
  
    // current video stream
    let videoStream;
  
    // displaying the canvas feed 
    startCamera.addEventListener("click", function() {
      video.play();
    
      drawFrame(video);

    });

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

    /* Function to move/update the moving action of the robot */


    function drawFrame(video) {

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // converting the canvas into greyscale filter 
      context.drawImage(video, 0, 0);

      setTimeout(function () {
        drawFrame(video);
      }, 10);
      
    }


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
/*
    const drawingUtils = window;
    const mpObjectron = window;
    const objectron = new Objectron({locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/objectron@0.3.1627447724/${file}`;
    }});
    objectron.setOptions({
      modelName: 'Cup',
      maxNumObjects: 3,
    });

    objectron.onResults(onResults);

    function onResults(results) {
      context.save();
      context.drawImage(
          results.image, 0, 0, canvas.width, canvas.height);
      if (!!results.objectDetections) {
        for (const detectedObject of results.objectDetections) {
          // Reformat keypoint information as landmarks, for easy drawing.
          const landmarks = detectedObject.keypoints.map(x => x.point2d);
          // 3d - console.log(detectedObject.keypoints.map(x => x.point3d));
          // Draw bounding box
          drawingUtils.drawConnectors(context, landmarks,
            mpObjectron.BOX_CONNECTIONS, {color: '#FF0000'});
          // Draw centroid.
          drawingUtils.drawLandmarks(context, [landmarks[0]], {color: '#FFFFFF'});
        }
      }
      context.restore();
    }
*/
    // Function to stop the video stream
    function stopVideoStream() {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    }
      
    // initialize
    async function initializeCamera() {
      stopVideoStream();
      constraints.video.facingMode = "environment";
      
      try {
        videoStream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = videoStream;
        //await this.objectron.send({image: videoElement})
      } catch (err) {
        alert("Could not access the camera");
      }
    }
      
    initializeCamera();
  })();






