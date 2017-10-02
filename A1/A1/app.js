/*********************************************************************************** 
* WEB322 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: ABEL INOCENCIO Student ID: 047 492 095 Date: 5/19/2017
*
*  Online (Heroku) URL: https://boiling-savannah-26609.herokuapp.com/
*
********************************************************************************/ 


var express = require('express');
var app = express();

var port = process.env.PORT || 8080;

app.get("/", (req, res) => {

    res.send("<h1>Abel Inocencio: 047-492-095</h1>");

})

app.listen(port, ()=>{

    console.log(`listening to port ${port}`);
})
