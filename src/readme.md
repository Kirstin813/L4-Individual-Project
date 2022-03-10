## Build Instructions

### Build steps - TODO
List the steps required to build software. 
Hopefully something simple like `pip install -e .` or `make` or `cd build; cmake ..`. In
some cases you may have much more involved setup required.
### Test steps - TODO
List steps needed to show your software works. This might be running a test suite, or just starting the program; but something that could be used to verify your code is working correctly.
Examples:
* Run automated tests by running `pytest`
* Start the software by running `bin/editor.exe` and opening the file `examples/example_01.bin`

#### Requirements
For the Web Bluetooth to work, your device needs Bluetooth 4.0-capable adaptor for it to work correctly. Almost all new computers/devices come with this, if not then you will need an external Bluetooth LE dongle if your computer or device:
* Is an Apple Mac made before 2012
* Is a Windows PC with a Windows version before 10
* Is a Desktop PC - it may not have any wireless support at all
* Is running Linux - it does work to an extent but would be better if an external USB adaptors was used

For more information on if your device is compatible with Web Bluetooth visit: https://www.espruino.com/Quick+Start+BLE

Note: If you are using iOS, Web Bluetooth only works when you have downloaded [this app](https://apps.apple.com/us/app/webble/id1193531073). Furthermore, for this project, the app will only work for the simple controller as it does not support `getUserMedia`.

This project has been development using Javascript and Visual Studio Code.

## Instructions for use

#### Connecting to Robot 

Once everything is set up, make sure that Bluetooth is enabled on both your device and the robot itself. The connection can be made by clicking on the `connect` button on the webpage. The `connect` is at the same place on every webpage. When the pop displays, you next want to choose `Web Bluetooth` which will then display all enabled Bluetooth devices nearby. Finally, click on the name of the robots Bluetooth and that is you connected. 

<p align="center" width="100%">
    <img width="33%" height="50%" src="../media/connection.gif">
</p>
    
To disconnect from the robot, simply click on the `disconnect` button.

#### Object Tracking 

To work with object tracking visit [here](https://kirstin813.github.io/L4-Individual-Project/src/objectTracking/). To connect to the robot check out the above subsection or alternatively follow this [link](https://github.com/Kirstin813/L4-Individual-Project/tree/main/src#connecting-to-robot). 

Now that we have connected to the robot, place your smartphone on the mount of the robot and switch the camera orientation to access the back facing camera. To do this, simple click on the `Switch Camera` and  we can now begin with our colour tracking. Choose an object with an idenfiying colour. **Make sure that the colour of the object does not match with the colour of the background on your video**. We find that colours such as red, blue, green and yellow work best. 

Once you have found an object, position the object in front of the smartphoone so that it is visible from the displayed video. For the colour tracking to begin, click on the object displayed on the video feed and a small colour tracking circle should pop up as below. 

<p align="center" width="100%">
    <img src="../media/clickobject.gif">
</p>

Once the object colour has been identified, the robot will begin to move forward as long as you have the object placed in the middle of the video. To allow the robot to move left or right, position the object accordingly in either the left or right sections of the video as seen below. 

<p align="center" width="100%">
    <img width="50%" src="../media/text.png">
</p>

Congratulations, your robot is now following a coloured object. To stop the robot from tracking the object and stop moving, remove the visiblity of the object from the video feed and then disconnect from the robot. 

To watch a demo of this stage in action check out: https://youtu.be/LbqPyVP_ZSk

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

### Self Driving 

*Description of code*

