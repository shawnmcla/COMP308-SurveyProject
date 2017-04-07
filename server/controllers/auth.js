/**
 * File name: auth.js
 * Authors:
 * Shawn McLaughlin <shawnmcdev@gmail.com>
 * Joshua Korovesi <joshua.j.korovesi@gmail.com>
 * Site: https://joshawn-opine.herokuapp.com/
 * Description: Defines authentication controller methods.
 */

let passport = require('passport');
let User = require('../models/users').User;

// Display the login page
module.exports.DisplayLogin = (req, res) => {
    // check to see if the user is not already logged in
    if (!req.user) {
        // render the login page
        res.render('auth/login', {
            title: "Login",
            messages: req.flash('error'),
            userName: req.user ? req.user.userName : ''
        });
        return;
    } else {
        return res.redirect('/polls/dashboard'); // redirect to dashboard
    }
}

// Processes the login request
module.exports.ProcessLogin = () => {
    return passport.authenticate('local', {
        successRedirect: '/polls/dashboard',
        failureRedirect: '/auth/login',
        failureFlash: true
    });
}

// Display the register page
module.exports.DisplayRegister = (req, res) => {
    // check to see if the user is not already logged in
    if (!req.user) {
        // render the registration page
        res.render('auth/register', {
            title: "Register",
            messages: req.flash('registerMessage'),
            userName: req.user ? req.user.userName : ''
        });
        return;
    } else {
        return res.redirect('/polls/dashboard'); // redirect to dashboard
    }
}

// Processes the registration request
module.exports.ProcessRegister = (req, res) => {
    User.register(
        new User({
            username: req.body.username,
            //password: req.body.password,
            email: req.body.email,
            userName: req.body.userName
        }),
        req.body.password,
        (err) => {
            if (err) {
                console.log('Error inserting new user: ', err);
                if (err.name == "UserExistsError") {
                    req.flash('registerMessage', 'Registration Error: User Already Exists');
                }
                return res.render('auth/register', {
                    title: "Register",
                    messages: req.flash('registerMessage'),
                    userName: req.user ? req.user.userName : ''
                });
            }
            // if registration is successful
            return passport.authenticate('local')(req, res, () => {
                res.redirect('/polls/dashboard');
            });
        });
}

// Processes the logout
module.exports.ProcessLogout = (req, res) => {
    req.logout();
    res.redirect('/'); // redirect to the home page
}

module.exports.RequireAuth = (req, res, next) => {
    if (!req.isAuthenticated()) return res.redirect('/auth/login');
    next();
}