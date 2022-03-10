# _Self Driving Robot Using Web Bluetooth on a Smartphone_
##### Level 4 Project Academic Year 2021-22

### Project Description 

##### Inspiration

This project is inspired by the [Amazon Deep Racer](https://aws.amazon.com/deepracer/) which is an integrated learning system which provides an understanding of reinforcement learning through creating your own self-driving robot. This product allows consumers to purchase the Deep Racer and learn about machine learning using the software, algorithms, and tutorials all specially catered to the racer. It also allows consumers to participate in a racing league to demonstrate knowledge and progress through a virtual circuit or their own physical circuit.

However, the Deep Racer is extremely expensive for the average student or advanced individual, costing between $300-$400+ and would most likely involve downloading or setting up specialized software that is required for the Deep Racer. On top of this, the individuals would need to pay for monthly plans if they wanted to use Amazon Virtual Private Server (VPS). 

##### Project Aim

The ultimate aim of this project is to investigate ways to create our own self-driving robot by only using a smartphone's camera and web browser to connect to the robot and perform tasks. Our investigation will also look at different frameworks and pre-trained models that are suitted to a web browser on a mobile device and whether these frameworks will be useful for our development when working towards creating a fully self driving car. 

##### Outline 

Using a given robotic car, pictured below, the smartphone will be placed on the mount on top of the car which will then be connected to the car using Web Bluetooth through the [UART.js library](http://www.espruino.com/UART.js?print). The [code](https://github.com/jgrizou/phonebot/blob/main/espruino/dev.js) that has already been implemented onto the robot can perform the following actions; forward, backward, left, right, and stop.

<p align="center" width="100%">
    <img width="33%" src="media/robotCar.png">
</p>

Using the robot's actions, the project will be divided into four stages, which increase in difficulty as each stage progresses. 

1. [Follow a Coloured Object](https://kirstin813.github.io/L4-Individual-Project/src/objectTracking/) 
    <p align="center" width="100%">
        <img width="33%" src="media/followobject.gif">
    </p>

2. [Follow a Face](https://kirstin813.github.io/L4-Individual-Project/src/followFace/)
    <p align="center" width="100%">
        <img width="75%" src="media/followface.gif">
    </p>

3. [Follow a Black Line](https://kirstin813.github.io/L4-Individual-Project/src/lineTracking/) 
4. [Fully Self Driving](https://kirstin813.github.io/L4-Individual-Project/src/selfDriving/) 

By dividing the sections, there will be an opportunity to learn from each stage and gain a better understanding of what needs to be required for the robot to be fully self-driving. 

All of these stages will be implemented in a way that would be compatible to be used on web browsers on a smartphone which means that there is no need to download any external or costly software. The price to assemble this robot car is significantly cheaper than the Deep Racer making it more affordable to all students and individuals. 