"use strict";
var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    User                  = require("./models/user"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/auth_demo");

var app= express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.use(require("express-session")({
    secret:"This is my secret better beware",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//ROUTES

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/secret", function (req, res) {
    res.render("secret");
})

// AUTH ROUTES

app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register", function (req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function (err, user) {
        if(err){
            console.log(err);
            return res.render("register");
        }else{
            passport.authenticate("local")(req,res,function () {
                res.redirect("secret");
            });
        }
    });
});


app.listen(4000, function () {
    console.log("Auth app is online");
});