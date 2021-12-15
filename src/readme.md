## Code Structure

Each folder represents each stage of the project with the exception of 'simple' and 'ml5js_faceAPI'. 

- Stage 1 is represented by 'objectTracking'
- Stage 2 is represented by 'followFace'
- Stage 3 is represented by ...
- Stage 4 is represented by ...

### Object Tracking 

Using the [p5.js library](https://p5js.org/libraries/) the object tracking begins by access the camera on the smartphone using [`createCapture()`](https://p5js.org/reference/#/p5/createCapture). Once the camera has been accessed it displays the video feed onto the middle of the webpage. If we wanted to switch which camera we wanted to use on the smartphone then this can be easily done by clicking on the 'Switch Camera' button to switch between front and back camera.

**insert visualisation**

Before the tracking begins, we must connect to the robot by clicking on the 'Connect' button. Once the webpage is connected to the robot we can start utilising the action functions; forward, left, and right. To start the object tracking, we must choose a colour to track, this is done by the mouse click event and is converted into a RGB pixel array. 

**insert visualisation**

To find the chosen colour on the camera feed, the entire canvas is converted into an RGB pixel array using [`.loadPixels()`](https://p5js.org/reference/#/p5/loadPixels) and stores it in `pixels`. Using the `pixels` array, we iterate through all pixels in the video feed (which starts from the top left hand corner) until it reachs a colour pixel that matches the chosen colour. 

**insert visualisation**

Once the colour has been identified on the video feed, the tracking can begin! If the x coordinate of the matched colour is within the left third of the video it will move the robot to the left. This is indicated by the text display on the video feed. If the x coordinate is found within the middle of the feed then the robot moves forward and finally if the x coordinate is in the right third of the feed the it moves the robot to the right. 

**insert visualisation**

We can stop the tracking at anytime by removing the coloured object that we are tracking from the video feed and press the 'stop' button. 

**insert visualisation** 

Below is a demo of this stage working by tracking a red coloured object:

**insert demo**

### Follow a Face

This stage utilises [MediaPipe Solutions](https://google.github.io/mediapipe/solutions/solutions.html). Most of the solutions created by MediaPipe are compatiable through webpages on smartphones. The solution used for this stage is [Face Detection](https://google.github.io/mediapipe/solutions/face_detection#javascript-solution-api). This solution is also able to access the camera on a smartphone by using the `<video>` tag in `index.html`. 

**insert visualisation**

The solution loads the face detection models which can be used to detect a human face. However, in this stage, the face is only detected once the connect between the webpage and the robot has been made. Again, connection to the robot is similar to how the connection is made in the first stage. Once the connection has been made, face detection begins and can now follow the face on the video feed. 

**insert visualisation**

To track the face, it uses the x coordinate of the nose position. The facial feature was choose as the main feature to follow as it is the most recongisable feature and it is the most centre point of the face. If the x coordinate of the nose moves into the left third of the feed then the robot moves left, if it moves into the right it moves to the right. The only different from the first stage is when the x coordinate is in the middle of the feed then the robot stops moving.

**insert visualisation**

Below is a demo of this stage working:

**insert demo**

#### Known Issues 

- The feature to switch cameras for this stage does not currently work

### Follow a Black Line 

*Description of code*

### Fully Self Driving 

*Description of code*
 
## Build instructions

**You must** include the instructions necessary to build and deploy this project successfully. If appropriate, also include 
instructions to run automated tests. 

### Requirements

List the all of the pre-requisites software required to set up your project (e.g. compilers, packages, libraries, OS, hardware)

For example:

* Python 3.7
* Packages: listed in `requirements.txt` 
* Tested on Windows 10

or another example:

* Requires Raspberry Pi 3 
* a Linux host machine with the `arm-none-eabi` toolchain (at least version `x.xx`) installed
* a working LuaJIT installation > 2.1.0

### Build steps

List the steps required to build software. 

Hopefully something simple like `pip install -e .` or `make` or `cd build; cmake ..`. In
some cases you may have much more involved setup required.

### Test steps

List steps needed to show your software works. This might be running a test suite, or just starting the program; but something that could be used to verify your code is working correctly.

Examples:

* Run automated tests by running `pytest`
* Start the software by running `bin/editor.exe` and opening the file `examples/example_01.bin`

