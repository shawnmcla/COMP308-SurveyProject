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

/* GET browse page. */
router.get('/browse', function(req, res, next) {
  res.render('polls/browse', { title: 'Browse Surveys' });
});

/* GET true false page. */
router.get('/tfSurvey', function(req, res, next) {
  res.render('polls/tfSurvey', { title: 'TrueFalse' });
});

/* GET multiple choice page. */
router.get('/mcSurvey', function(req, res, next) {
  res.render('polls/mcSurvey', { title: 'MultiChoice' });
});

/* GET short answer page. */
router.get('/saSurvey', function(req, res, next) {
  res.render('polls/saSurvey', { title: 'Short Answer' });
});

module.exports = router;
