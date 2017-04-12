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
module.exports.ProcessLogin = (req, res, next) => {
    passport.authenticate('local', function (err, user, info) {
        if (err) { return next(err); }
        if (!user) {
            req.flash('msg', { type: 'error', msg: "Invalid username or password." });
            return res.redirect('/auth/login');
        }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            return res.redirect('/polls/dashboard');
        });
    })(req, res, next);
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
                    req.flash('msg', { type: "error", msg: 'Registration Error: User Already Exists' });
                } else {
                    req.flash('msg', { type: "error", msg: "Error processing registration. Contact site owner." });
                }
                return res.render('auth/register', {
                    title: "Register",
                    messages: req.flash('msg'),
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
    /*
    User.findByUsername(req.user.userName, false, (err, user) => {
        if (err || !user) {
            let msg = "Error updating password.";
            winston.error(msg, err);
            req.flash("msg", { type: "error", msg: msg });
            res.redirect('/auth/account');
            return;
        } else {
            let msg = "Password successfully updated";
            req.flash("msg", { type: "success", msg: msg });
            res.redirect('/auth/account');
            return;
        }
    });
    */
    User.findById(req.user._id, (err, user) => {
        console.log("Changing password to " + req.body.password);
        if (err || !user) {
            let msg = "Error updating password.";
            winston.error(msg, err);
            req.flash("msg", { type: "error", msg: msg });
            res.redirect('/auth/account');
            return;
        } else {
            user.setPassword(req.body.password, (err, result) => {
                if (err) {
                    let msg = "Error updating password.";
                    winston.error(msg, err);
                    req.flash("msg", { type: "error", msg: msg });
                    res.redirect('/auth/account');
                    return;
                } else {
                    user.save();
                    let msg = "Password successfully updated";
                    req.flash("msg", { type: "success", msg: msg });
                    res.redirect('/auth/account');
                    return;
                }
            });
        }
    });
}