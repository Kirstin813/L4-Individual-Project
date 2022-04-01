let video;
let colourMatch;
let currentAction;

// Allows a tolerance buffer as the colour match will not be exact 
// as long as the colour falls into the range then its a good colour match 
let tolerance = 15;

// Variables used for switching camera 
let switchFlag = false;
let switchButton;
let options;

let canvas;

/**
 * This function sets up the canvas frame and captures the video stream 
 * from the mobile device.
 */

function setup() {
  canvas = createCanvas(500, 360); 


  /* Center the video */
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  canvas.position(x, y-50);


  /* Default option is front facing camera */
  options = {
    video: {
      faceingMode: {
        exact: "user"
      }
    }
  };

  video = createCapture(options); // Creates a HTML5 video using the webcam or the camera on a smartphone 
  video.size(500, 360); // Resize the video to fit the display width and height 
  video.hide(); // Hide the video feed 
  pixelDensity(1);
  noStroke();


  /* Adding a "switch camera" button to be able to switch the camera using createCapture */
  switchButton = createButton('Switch Camera');
  switchButton.position(10, y+15);
  switchButton.style("color: white; padding: 10px 5px; background-color: #4DA167; font-size: 12px; border-radius: 10px; margin: 5px;")
  switchButton.mousePressed(switchCamera);
  
  colourMatch = color(255, 150, 0);  // Initial colour to match 
}

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  canvas.position(x, y);

  //console.log(windowWidth);
}


function windowResized() {
  centerCanvas();
}


/** 
 * Function to switch the camera depending if the switchFlag has been set to true or false 
 */
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

  video = createCapture(options); // Create a new capture using the updated options 
  video.size(640, 480); // Resize the video to fit the display width and height 
  video.hide(); // Hide the video feed 
  pixelDensity(1);
  noStroke();
}

/** 
 * Function to stop the current capture 
 */
function stopCapture() {
  let stream = video.elt.srcObject;
  let tracks = stream.getTracks();

  tracks.forEach(function(track) {
    track.stop();
  });

  video.elt.srcObject = null;
}

/** 
 * Function to move/update the moving action of the robot. 
 */
function move(action) {
  if (action != currentAction) {
    currentAction = action;
    currentAction();
  }
}

/**
 * Function that draws the video stream on to the canvas element.
 * Also identifies and tracks the chosen colour.
 */
function draw() {
  image(video, 0, 0); // Draw the video feed onto the canvas 
  
  let colourPixel = findColour(video, colourMatch, tolerance);
  

  if(colourPixel != undefined) {
    
    // Draws a small circle around the colour to show that it has been matched 
    // and that the colour is being tracked
    fill(colourMatch);
    stroke(255);
    strokeWeight(2);
    circle(colourPixel.x, colourPixel.y, 30);  
    
    followColour(colourPixel);
  
  }

}

/** 
 * Follows the given colour on the canvas 
 */
function followColour(colourPixel) {
      // If the colour is in the left third of the canvas then robot moves left 
      if ( (colourPixel.x<=width/3) && (colourPixel.x>=0) ) {
        move(left)
        textSize(15);
        fill(255);
        text("Moving Robot Left", 10, 350);
      // If the colour is in the middle of the canvas then robot moves forward 
      } else if ( (colourPixel.x > width/3) && (colourPixel.x < 2*width/3) ) {
        move(forward)
        textSize(15);
        fill(255);
        text("Moving Robot Forward", 10, 350);
      // If the colour is in the right third of the canvas then robot moves right 
      } else if ( (colourPixel.x > 2*width/3) && (colourPixel.x < width)) {
        move(right)
        textSize(15);
        fill(255);
        text("Moving Robot Right", 10, 350);
      }
  
}

// Function which allows you to click on any colour on the screen to be set as the colour to be matched.
function mousePressed() {
    loadPixels();
    if (mouseY < height && mouseY > 0) {
      colourMatch = get(mouseX, mouseY);
    }
    
}

/** 
 * Finds the first pixel of the colour that we want to match.
 * Iterates through the pixel data array and uses the tolerance 
 * value to find a rough match to the chosen colour. If the pixel colour 
 * is within the right rangne then it returns its x and y values. 
 * 
 * Inspiration taken from https://editor.p5js.org/shawn/sketches/BkwJ6vP2m on 
 * how to iterate through the pixel data array.
 */
function findColour(vidInput, colour, tolerance) {
  
  // RGB pixels of the colour to be matched 
  let colourR = colour[0];
  let colourG = colour[1];
  let colourB = colour[2];
  
  vidInput.loadPixels(); // Loads all of the pixels from the video 
  for (let y=0; y < vidInput.height; y++){ // Iterating through the y-axis 
    for (let x=0; x< vidInput.width; x++) { // Iterating through the x-axis 
      
      let index = (y * video.width + x) * 4; 
      
      let r = vidInput.pixels[index];
      let g = vidInput.pixels[index+1];
      let b = vidInput.pixels[index+2];
      
      if (r >= colourR-tolerance && r <= colourR+tolerance &&
          g >= colourG-tolerance && g <= colourG+tolerance &&
          b >= colourB-tolerance && b <= colourB+tolerance) {
            /* For testing purposes - uncomment this line */
            // console.log(x + " " + y);
            return createVector(x, y);
      }
      
    }
  }
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
