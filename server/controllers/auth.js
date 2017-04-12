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
let winston = require('winston');

// Display the login page
module.exports.DisplayLogin = (req, res) => {
    // check to see if the user is not already logged in
    if (!req.user) {
        // render the login page
        res.render('auth/login', {
            title: "Login",
            messages: req.flash('msg'),
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
            messages: req.flash('msg'),
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
                    req.flash('error', 'Registration Error: User Already Exists');
                }
                return res.render('auth/register', {
                    title: "Register",
                    messages:req.flash('msg'),
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

// Display account settings page
module.exports.DisplaySettings = (req, res) => {
    return res.render('auth/settings', {
        title: "Account Settings",
        messages: req.flash('msg'),
        userName: req.user ? req.user.username : "Guest",
        email: req.user.email
    });
}

// Change the user's email
module.exports.ChangeEmail = (req, res) => {
    let newEmail = req.body.email;
    let userId = req.user._id;

    User.update({ _id: userId }, { email: newEmail }, (err) => {
        if (err) {
            let msg = "Error updating email.";
            winston.error(msg, err);
            req.flash("msg", { type: "error", msg: msg });
            res.redirect('/auth/account');
            return;
        } else {
            let msg = "Email successfully updated.";
            req.flash("msg", { type: "success", msg: msg });
            res.redirect('/auth/account');
            return;
        }
    });
}
// Change the user's password
module.exports.ChangePassword = (req, res) => {
    res.status(500).json({ err: "Not implemented." });
}