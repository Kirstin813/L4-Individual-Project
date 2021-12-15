# Self Driving Robot Using the Browser on a Smartphone 

This is my L4 project for the 2021-22 academic year.

## Project Description 

### Inspiration

This project is inspired by the [Amazon Deep Racer](https://aws.amazon.com/deepracer/). This product allows consumers to purchase the Deep Racer and learn about machine learning using the software, algorithms, and tutorials. It also allows consumers to participate in a racing league to demonstrate knowledge and progress through a virtual circuit.

However, the Deep Racer is extremely expensive for the average consumer, costing between $300-$400+ and would most likely involve downloading or setting up specialised software that is required for the Deep Racer. On top of this, consumers would need to pay for monthly plans if they wanted to use Amazon Virtual Private Server (VPS). 

### Project Aim

The ultimate aim of this project is to implement a fully self-driving robot car (similar to the Deep Racer) and test whether it can be self-driving using the web browser on a smartphone using current technology. 

### Outline 

Using the given robot car, pictured below, the smartphone will be placed on the mount on top of the car which will then be connected to the car using web Bluetooth through the [UART.js library](http://www.espruino.com/UART.js?print). The code that has already been implemented onto the robot can perform the following actions; forward, backward, left, right, and stop. 

<img src="media/robotCar.gif" width="600" />

Using the robot's actions, the project will be divided into four stages, which increase in difficulty as each stage progresses. 

1. [Follow a Coloured Object](https://kirstin813.github.io/L4-Individual-Project/src/objectTracking/) 

2. [Follow a Face](https://kirstin813.github.io/L4-Individual-Project/src/mediapipe_faceAPI/)

3. Follow a Black Line 

4. Fully Self Driving 

By dividing the sections, there will be an opportunity to learn from each stage and gain a better understanding of what needs to be required for the robot to be fully self-driving. 

All of these stages will be implemented in a way that would be compatible to be used on web browsers which means that there is no need to download any external or costly software. The price to assemble this robot car is significantly cheaper than the Deep Racer making it more affordable to all consumers. 