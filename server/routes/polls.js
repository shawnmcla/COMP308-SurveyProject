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
let reqAuth = authController.RequireAuth;

/* GET dashboard page. */
router.get('/dashboard', reqAuth, function (req, res, next) {
  res.render('polls/dashboard', {
    title: 'Dashboard',
    userName: req.user.username,
    data: null,
  });
});

/* 
GET browse page.
Does not require auth, 
anons can answer surveys
*/
router.get('/browse', function (req, res, next) {
  res.render('polls/browse', {
    title: 'Browse Surveys',
    userName: req.user ? req.user.username : "Guest",
    data: null,
  });
});

/* GET true false page. */
router.get('/new/truefalse', reqAuth, function (req, res, next) {
  let date = new Date();
  res.render('polls/newTrueFalse', {
    title: 'New True False Survey',
    userName: req.user.username,
    data: {
      date: date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate(),
    },
  });
});

/* GET multiple choice page. */
router.get('/new/multiplechoice', reqAuth, function (req, res, next) {
  let date = new Date();
  res.render('polls/mcSurvey', {
    title: 'MultiChoice',
    userName: req.user.username,
    data: {
      date: date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate(),
    },
  });
});

/* GET short answer page. */
router.get('/new/shortanswers', reqAuth, function (req, res, next) {
  let date = new Date();
  res.render('polls/saSurvey', {
    title: 'Short Answer',
    userName: req.user.username,
    data: {
      date: date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate(),
    },
  });
});

module.exports = router;
