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
 * POST: Process the account edit attempt
 */
router.get('/account', authController.DisplayRegister)
    .post('/account', authController.ProcessRegister);

// GET /logout - process the logout request
router.get('/logout', authController.ProcessLogout);

module.exports = router;
