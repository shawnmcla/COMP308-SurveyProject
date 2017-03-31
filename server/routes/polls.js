/**
 * File name: polls.js
 * Authors:
 * Shawn McLaughlin <shawnmcdev@gmail.com>
 * Joshua Korovesi <joshua.j.korovesi@gmail.com>
 * Site: https://joshawn-opine.herokuapp.com/
 * Description: Defines polls routes.
 */

let express = require('express');
let router = express.Router();

// require the polls controller
let gamesController = require('../controllers/polls');
// require the auth controller
let authController = require('../controllers/auth');

// require authentication for all pages
router.use(authController.RequireAuth);

/* GET dashboard page. */
router.get('/dashboard', function(req, res, next) {
  res.render('polls/dashboard', { title: 'Dashboard' });
});

module.exports = router;
