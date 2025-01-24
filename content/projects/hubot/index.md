---
title: "hubot"
date: "2022-11-10"
tags: [interactive]
location: san francisco, ca 
draft: True
---

**location**: GitHub Universe Conference 2022

<!-- TODO -->
{{< vimeo 313934146 >}}

## research

dr. charlton mcilwain, associate dean for faculty development & diversity, associate professor of media, culture, and communication at nyu. his work focuses on the intersections of race, digital media, and racial justice activism. his research reveals how internet’s categorizations create opportunities for inequality and more importantly how it has implications on the real world. he was also recently featured in the atlantic’s the internet may be segregated as a city.

## background

this exhibit playfully communicates serious research about internet segregation by dr.charlton mcllwainthe current architecture of the web encourages categorization. however, this categorization can negatively affect real-world outcomes. in our exhibit piece, we examine the pre-existing, technical, & emergent bias of web traffic segregation. search divides us is an exploration of systemic racial bias through machine learning & tactile interaction.

## exhibit goals

- encourage visitors to criticize the mainstream view of the internet being equitable.
- feel unfairly forced into an outcome.
- confront the scale of internet segregation beyond individual choice.

## ideation

our interviews with the researcher had a strong take away that the researcher compares web pathways to highways and internet segregation to discrimination in a city. so we wanted our project to have a ‘city ‘element in it while talking about differences. we ideated a bunch of concepts and presented it to a few of our friends and classmates to see what they interpret out of it and to see if the message was clear. in the initial concepts, we abstracted privilege with shapes and the goal is to find the most diverse neighborhood to live in.

{{< image/hero src="sdu-ideation.png" alt="search divides us - ideation splay" >}}

## iterations

after user testing, we found that abstracting inequality wasn’t communicating the message of discrimination and segregation. moreover, it did not make them question about the internet. some of the questions we asked while reiterating the concept are: 

- how do we force comparison? 
- how to design it so that users are willing to interact more than once? 
- how to make it clear that different profiles end up in different places?

## low & hi fidelity prototypes

we decided to go with direct filters (income, race, and education) on the physical interface that decides where the user should be living on the fictional map. special attention was given to the color palette and iconography of the map to depict good and bad neighborhoods.

{{< image/hero src="sdu-prototyping.png" alt="search divides us - prototyping" >}}

## technology

there are two tech components to this interactive exhibit - tangible and digital. the tangible kiosk acts as an input and the visuals on the screen are the output. we used rotary encoders, buttons and a limit switch as inputs to the master mkr1000 which then communicates with the slave arduino uno which is connected to the neopixels. we used a master and slave arduinos merely because of insufficient pins on the mkr1000. visuals are created on p5.js using a p5 scene library that talks to the browser using node. these visuals are projected on a custom map cut on a cnc using projection mapping.

{{< image/hero src="sdu-system-diagram.png" alt="search divides us - system diagram" >}}

## interaction design
feedback of user action is given in the form of visuals and sound. neo pixels on the physical interface are used to illustrate the user’s selection from the rotary encoder. each parameter(‘race’, ‘education’, ‘income’, ‘search’ and ‘refresh’) are color-coded on the physical and digital interfaces for easy recognition. the angled design of the console is inviting and giant sized buttons enable multiple users to interact with the system at the same time encouraging them to discuss. timings of the interaction have been refined after multiple user tests.

## team

asha veeraswamy\
kathy wu\
keerthana pareddy\
anthony bui
