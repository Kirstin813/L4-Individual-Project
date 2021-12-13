# Self Driving Robot Using the Browser on a Smartphone 

This is my L4 project for the 2021-22 academic year.

## Project Description 

### Inspiration

This project is inspired on the Amazon Deep Racer (https://aws.amazon.com/deepracer/) this product allows consumers to purchase the Deep Racer and learn about machine learning using the software, algorithms and tutorials provided. It also allows consumers to participate in a racing league to demonstrate knowledge and progress through a virtual circuit.

However, the Deep Racer is extremely expensive for the average consumer, costing between $300-$400+ and would most likely involve dowloading or setting up specialised software that is required for the Deep Racer. On top of this, consumers would need to pay for monthly plans if they wanted to use Amazon Virtual Private Server (VPS). 

### Project Aim

The ultimate aim for this project is to implement a fully self driving robot car (similar to the Deep Racer) and test whether it is possible for it to be self driving using the web browser on an everyday smartphone. 

### Outline 

Using a given robot car, pictured below, the smartphone will be placed on the mount on top of the car which will then be connected to the car using web Bluetooth through UART.js library (http://www.espruino.com/UART.js?print). The code that has already been implemented onto the robot can perform the follow actions; foward, backward, left, right, and stop. 

Using the robots actions, the project will be divded into 4 stages, which increases in difficulty as each stage progresses. 

1. Follow a Coloured Object 

2. Follow a Face

3. Follow a Black Line 

4. Fully Self Driving 

By dividing the sections, there will be opportunity to learn from each stage and gain a better understanding of what needs to be required for the robot to be fully self driving. 

All of these stages will be implemented in a way that it would be compatible to be used on web browsers which means that there is no need to download any external or costly software. The price to assemble this robot car is significantly cheaper than the Deep Racer making it more affordable to all consumers. 