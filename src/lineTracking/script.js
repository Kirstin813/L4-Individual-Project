(function () {
    if (
      !"mediaDevices" in navigator ||
      !"getUserMedia" in navigator.mediaDevices
    ) {
      alert("Camera API is not available in your browser");
      return;
    }
  
    // get page elements
    const video = document.querySelector("#video");
    const btnChangeCamera = document.querySelector("#btnChangeCamera");
    const btnGreyscale = document.querySelector("#btnGreyscale");
    const btnConnect = document.querySelector('#btnConnect');
    const btnDisconnect = document.querySelector('#btnDisconnect');
    const canvas = document.getElementById("canvas");
    const devicesSelect = document.getElementById("#devicesSelect");
    var context = canvas.getContext('2d');

    let currentAction;
  
    // video constraints
    const constraints = {
      video: {
        width: 540, 
        height: 380
      },
    };
  

    // use front face camera
    let useFrontCamera = true;
  
    // current video stream
    let videoStream;
  
    // switch camera
    btnChangeCamera.addEventListener("click", function () {
      useFrontCamera = !useFrontCamera;
  
      initializeCamera();
    });

    btnGreyscale.addEventListener("click", function() {
      video.play();
    
      drawFrame(video);

    });

    btnConnect.addEventListener("click", function() {
      connect();
    });

    btnDisconnect.addEventListener("click", function() {
      disconnect();
    });

    /* Function to move/update the moving action of the robot */
    function move(action) {
      if (action != currentAction) {
        currentAction = action;
        currentAction();
      }
    }
    
    function moveRobot(centreSensor, leftSensor, rightSensor) {

      if (centreSensor[0] < 60) {
        //console.log("robot moving straight");
        move(forward);
      } else if (leftSensor[0] < 60) {
        //console.log("robot moving left");
        move(left);
      } else if (rightSensor[0] < 60) {
        //console.log("robot moving right");
        move(right);
      }
    }

    function drawFrame(video) {

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.filter = 'grayscale(1)';

      context.drawImage(video, 0, 0);
      
      // need to make these adjustable so that it can be a similar scale on a mobile device 
      var centre = context.getImageData((canvas.width / 2) - 25, (canvas.height / 2) - 25, 25, 25);
      context.beginPath();
      context.arc((canvas.width / 2) - 25, (canvas.height / 2) - 25, 50, 0, 2 * Math.PI);
      context.stroke();
      
      var left = context.getImageData((canvas.width / 4) - 25, (canvas.height / 2) - 25, 25, 25);
      context.beginPath();
      context.arc((canvas.width / 4) - 25, (canvas.height / 2) - 25, 50, 0, 2 * Math.PI);
      context.stroke();

      var right = context.getImageData(((canvas.width / 2) + canvas.width / 4) - 25, (canvas.height / 2) - 25, 25 , 25);
      context.beginPath();
      context.arc(((canvas.width / 2) + canvas.width / 4) - 25, (canvas.height / 2) - 25, 50, 0, 2 * Math.PI);
      context.stroke();

      
      moveRobot(centre.data, left.data, right.data);

      setTimeout(function () {
        drawFrame(video);
      }, 10);
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
    
    // stop video stream
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
      constraints.video.facingMode = useFrontCamera ? "user" : "environment";
  
      try {
        videoStream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = videoStream;
      } catch (err) {
        alert("Could not access the camera");
      }
    }
  
    initializeCamera();
  })();