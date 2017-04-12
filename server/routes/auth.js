/**
 * File name: auth.js
 * Authors:
 * Shawn McLaughlin <shawnmcdev@gmail.com>
 * Joshua Korovesi <joshua.j.korovesi@gmail.com>
 * Site: https://joshawn-opine.herokuapp.com/
 * Description: Defines authentication routes.
 */

// modules required for routing
let express = require('express');
let router = express.Router();

// require the auth controller
let authController = require('../controllers/auth');
let reqAuth = authController.RequireAuth;
/**
 * GET: Display the login page
 * POST: Process the login attempt
 */
router.get('/login', authController.DisplayLogin)
    .post('/login', authController.ProcessLogin());

/**
 * GET: Display the register page
 * POST: Process the registration attempt
 */
router.get('/register', authController.DisplayRegister)
    .post('/register', authController.ProcessRegister);

/**
 * GET: Display the settings page
 */
router.get('/account', reqAuth, authController.DisplaySettings);

// Update the user's email address
router.post('/account/updateemail', reqAuth, authController.ChangeEmail);

// Update the user's password
router.post('/account/updatepassword', reqAuth, authController.ChangePassword);

// GET /logout - process the logout request
router.get('/logout', authController.ProcessLogout);

module.exports = router;
