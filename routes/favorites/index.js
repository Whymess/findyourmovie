"use strict";

var express = require("express");
var router = express.Router();
var fs = require("fs");
var path = require("path");

router.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

router.get("/favorites", function(req, res) {
  fs.readFile("./data.json", "utf-8", function(err, data) {
    if (err) throw err;
    var arrayOfObjects = JSON.parse(data);
    res.send(data);
  });
});

router.post("/favorites", function(req, res, next) {
  if (!req.body) {
    return res.send();
    return false;
  }

  fs.readFile("./data.json", "utf-8", function(err, data) {
    if (err) throw err;

    var arrayOfObjects = JSON.parse(data);

    var doesMoiveAlreadyExist = arrayOfObjects.movies.find(function(el, i) {
      return el["title"] === req.body.title;
    });

    if (doesMoiveAlreadyExist) {
      res.status(404).send("No duplicates");
    } else {
      arrayOfObjects.movies.push(req.body);

      fs.writeFile(
        "./data.json",
        JSON.stringify(arrayOfObjects),
        "utf-8",
        function(err) {
          if (err) throw err;
          console.log("Done!");
        }
      );

      res.sendStatus(200);
    }
  });
});

module.exports = router;
