/*********************************************************************************** 
* WEB322 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: ABEL INOCENCIO Student ID: 047 492 095 Date: 5/19/2017
*
*  Online (Heroku) URL: https://web322-abel.herokuapp.com/
*
********************************************************************************/ 


var express = require('express');
var app = express();
var path = require('path');

var port = process.env.PORT || 8080;

app.use(express.static('public'));

app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname + "/views/home.html"))

})


app.get("/about", (req, res) => {

    res.sendFile(path.join(__dirname + "/views/about.html"))
})
app.listen(port, ()=>{

    console.log(`Express http server listening on  ${port}`);
})


