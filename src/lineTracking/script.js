(() => {
  const videoElm = document.querySelector('#video');
  const btnFront = document.querySelector('#btn-front');
  const btnBack = document.querySelector('#btn-back');
  const canvas = document.getElementById("canvas");
  var context = canvas.getContext('2d');
  let currentAction;

  const supports = navigator.mediaDevices.getSupportedConstraints();
  if (!supports['facingMode']) {
    alert('Browser Not supported!');
    return;
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
    videoElm.srcObject = null;
    videoElm.srcObject = stream;
    videoElm.play();
  }

  btnBack.addEventListener('click', () => {
    capture('environment');

    draw(videoElm);
  });

  btnFront.addEventListener('click', () => {
    capture('user');

    draw(videoElm);
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
  function move(action) {
    if (action != currentAction) {
      currentAction = action;
      currentAction();
    }
  }
      
  /* Conditionals for each sensor signalling which direction to move the robot */
  function moveRobot(centreSensor, leftSensor, rightSensor) {
  
    //console.log(centreSensor);
    if (centreSensor < 90) {
      console.log("robot moving forward");
      move(forward);
    } else if (leftSensor < 90) {
      console.log("robot moving left");
      move(left);
    } else if (rightSensor < 90) {
      console.log("robot moving right");
      move(right);
    }
  }

   // Function returning the average integer of the pixel array 
   function getAverage(pixels) {

    const pixelArr = [];
    const average = arr => arr.reduce((a,b) => a + b, 0) / arr.length;

    for (let i = 0; i < pixels.data.length; i = i+4) {
      pixelArr.push(pixels.data[i])
    }

    // returns average integer to 2 decimal places
    return average(pixelArr).toFixed(2);

  }

  /** 
   * Draws video stream onto canvas and adds greyscale filter.
   * Divides the bottom portion of the screen into three sections to act as sensors.
   */
  function draw(videoElm) {

    canvas.width = videoElm.videoWidth;
    canvas.height = videoElm.videoHeight;


    // converting the canvas into greyscale filter 
    context.filter = 'grayscale(1)';

    context.drawImage(videoElm, 0, 0);

    if (canvas.height > 0) {
      var left = getAverage(context.getImageData(0, canvas.height - 50, (canvas.width / 3), 50));
      var centre = getAverage(context.getImageData((canvas.width / 3), canvas.height - 50, (canvas.width / 3), 50));
      var right = getAverage(context.getImageData(2 * (canvas.width / 3), canvas.height - 50, (canvas.width / 3), 50));

      /* Outline the sensors in a white rectangle border */
      context.strokeStyle = 'white';
      context.lineWidth = 1;
      context.strokeRect(0, canvas.height - 50, (canvas.width / 3), 50);
      context.strokeRect((canvas.width / 3), canvas.height - 50, (canvas.width / 3), 50);
      context.strokeRect(2 * (canvas.width / 3), canvas.height - 50, (canvas.width / 3) , 50);
      

      // Calling function to start moving the robot using the retrieved sensors 
      moveRobot(centre, left, right);
    }

    setTimeout(function () {
      draw(videoElm);
    }, 10);
  }

  /**
   * Using the connection setup in https://editor.p5js.org/jgrizou/sketches/osAAXLUtL 
   * which uses UART.js to communicate with the robot https://github.com/espruino/Espruino
   */

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

  /**
   * Modal variables for Instruction popup.
   * 
   * Let's the user know how to interact with the web-page.
   * 
   * Taken from https://www.w3schools.com/howto/howto_css_modals.asp and 
   * adapted for this project.
   */
  
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
})();