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

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//ROUTES

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/secret", isLoggedIn, function (req, res) {
    res.render("secret");
})

// AUTH ROUTES

// REGISTER ROUTES
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


// LOGIN ROUTES

app.get("/login", function (req, res) {
    res.render("login");
});

app.post("/login",passport.authenticate("local",{
    successRedirect:"/secret",
    failiureRedirect:"/login"
}) ,function (req, res) {

});

//LOGOUT ROUTE

app.get("/logout", function (req, res) {
    req.logOut();
    res.redirect("/");
});

function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(4000, function () {
    console.log("Auth app is online");
});