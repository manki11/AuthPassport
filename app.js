"use strict";
var express= require("express");
var mongoose= require("mongoose");

mongoose.connect("mongodb://localhost/auth_demo");
var app= express();

app.set("view engine", "ejs");


app.get("/", function (req, res) {
    res.render("home");
});

app.get("/secret", function (req, res) {
    res.render("secret");
})


app.listen(4000, function () {
    console.log("Auth app is online");
});