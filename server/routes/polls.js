/**
 * File name: polls.js
 * Authors:
 * Shawn McLaughlin <shawnmcdev@gmail.com>
 * Joshua Korovesi <joshua.j.korovesi@gmail.com>
 * Site: https://joshawn-opine.herokuapp.com/
 * Description: Defines polls routes.
 */

var express = require('express');
var router = express.Router();

/* GET dashboard page. */
router.get('/dashboard', function(req, res, next) {
  res.render('polls/dashboard', { title: 'Dashboard' });
});

module.exports = router;
