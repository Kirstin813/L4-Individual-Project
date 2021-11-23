let video;
let switchFlag = false;
let switchButton;
let colourMatch;
let tolerance = 15; //allows a tolerance buffer as the colour match will not be exact so as long as the colour falls into the range then its a good colour match 

var options = {
  video: {
    faceingMode: {
      exact: "user"
    }
  }
};

function setup() {
  createCanvas(640, 480); 
  video = createCapture(options); //creates a HTML5 video using the webcam or the camera on a smartphone 
  video.size(640, 480); //resize the video to fit the display width and height 
  video.hide(); //hide the video feed 
  pixelDensity(1);
  noStroke();

  switchButton = createButton('Switch Camera');
  switchButton.position(19, 19);
  switchButton.mousePressed(switchCamera);
  
  colourMatch = color(255, 150, 0);  //initial colour to match 
}

function switchCamera() {
  switchFlag = !switchFlag;
  stopCapture();
  if(switchFlag == true) {
    video.remove();
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

  video = createCapture(options);
}

function stopCatpure() {
  let stream = video.elt.srcObject;
  let tracks = stream.getTracks();

  tracks.forEach(function(track) {
    track.stop();
  });

  video.elt.srcObject = null;
}

function draw() {
  //background(220);
  image(video, 0, 0); //draw the video feed onto the canvas 
  
  let colourPixel = findColour(video, colourMatch, tolerance); // finds the first pixel of the colour that we want to match 
  
  if(colourPixel != undefined) {
    
    // Draws a little circle around the colour to show that it has been matched 
    // and that the colour is being tracked
    fill(colourMatch);
    stroke(255);
    strokeWeight(2);
    circle(colourPixel.x, colourPixel.y, 30);  
    
    move(colourPixel);
  
  }

}

function move(colourPixel) {
      if ( (colourPixel.x<=width/3) && (colourPixel.x>=0) ) {
        left();
      } else if ( (colourPixel.x > width/3) && (colourPixel.x < 2*width/3) ) {
        forward();
      } else if ( (colourPixel.x > 2*width/3) && (colourPixel.x < width)) {
        right();
      }
  
}

// this function allows you to click on any colour on the screen to be set as the colour to be matched.
function mousePressed() {
    loadPixels();
    colourMatch = get(mouseX, mouseY);
}

function findColour(vidInput, colour, tolerance) {
  
  // RGB pixels of the colour to be matched 
  let colourR = colour[0];
  let colourG = colour[1];
  let colourB = colour[2];
  
  vidInput.loadPixels(); // loads all of the pixels from the video 
  for (let y=0; y <vidInput.height; y++){ // iterating through the y-axis 
    for (let x=0; x<vidInput.width; x++) { //iterating through the x-axis 
      
      let index = (y * video.width + x) * 4; 
      
      let r = vidInput.pixels[index];
      let g = vidInput.pixels[index+1];
      let b = vidInput.pixels[index+2];
      
      if (r >= colourR-tolerance && r <= colourR+tolerance &&
          g >= colourG-tolerance && g <= colourG+tolerance &&
          b >= colourB-tolerance && b <= colourB+tolerance) {
          
          return createVector(x, y);
      }
      
    }
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
