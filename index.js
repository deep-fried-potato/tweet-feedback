const express = require('express');
const app = express()
const PORT = 3000
const mongoose = require('mongoose');
var bodyParser = require('body-parser')
var Twig = require("twig")
app.use(bodyParser.urlencoded({ extended: false }))

mongoose.connect('mongodb://localhost/tweetfeedback');
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("DB connected")
});



var tweetfeedback = require('./tweetfeedback')
app.set("twig options", {
    allow_async: true, // Allow asynchronous compiling
    strict_variables: false
});


app.use('/',tweetfeedback)


app.listen(PORT,()=>{console.log("Listening on port " + PORT)})
