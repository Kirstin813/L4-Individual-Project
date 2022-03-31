/**
 * Using the connection setup in https://editor.p5js.org/jgrizou/sketches/osAAXLUtL 
 * which uses UART.js to communicate with the robot https://github.com/espruino/Espruino
 */

var connection;

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