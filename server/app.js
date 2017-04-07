/**
 * File name: app.js
 * Authors:
 * Shawn McLaughlin <shawnmcdev@gmail.com>
 * Joshua Korovesi <joshua.j.korovesi@gmail.com>
 * Site: https://joshawn-opine.herokuapp.com/
 * Description: Web app entry point. Initializes modules.
 */

//express middleware
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//auth modules
let session = require('express-session');
let passport = require('passport');
let passportlocal = require('passport-local');
let LocalStrategy = passportlocal.Strategy;
let flash = require('connect-flash'); //display errors/login messages

let mongoose = require('mongoose');
let dbConfig = require('./config/db');

let indexRoutes = require('./routes/index');
let authRoutes = require('./routes/auth');
let pollRoutes = require('./routes/polls');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'client')));

// setup session
app.use(session({
  secret: "SomeSecret",
  saveUninitialized: true,
  resave: true
}));

// initialize passport and flash
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// setup routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/polls', pollRoutes);

// Passport User Configuration
let UserModel = require('./models/users');
let User = UserModel.User; // alias for the User Model - User object
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Handle 404 Errors
app.use(function (req, res) {
  res.status(400);
  res.render('errors/404', {
    title: '404: File Not Found',
    userName: "Guest"
  });
});

// Handle 500 Errors
app.use(function (error, req, res, next) {
  res.status(500);
  res.render('errors/500', {
    title: '500: Internal Server Error',
    userName: "Guest",
    error: error,
  });
});

console.log("\n\n\n*** APP STARTED ***\n\n\n");
module.exports = app;
