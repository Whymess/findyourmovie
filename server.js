var express = require("express");
var app = express();
var port = 3000;
var fs = require("fs");
var bodyParser = require('body-parser');
var path = require("path");
var logger = require("morgan");
var usersfavorites = require('./routes/favorites');


app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', usersfavorites);


 var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
