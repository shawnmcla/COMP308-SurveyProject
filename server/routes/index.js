/**
 * File name: index.js
 * Authors:
 * Shawn McLaughlin <shawnmcdev@gmail.com>
 * Joshua Korovesi <joshua.j.korovesi@gmail.com>
 * Site: https://joshawn-opine.herokuapp.com/
 * Description: Defines index routes.
 */

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('./polls/dashboard');
  } else {
    return res.render('./index/home', { title: 'Home', userName: "Guest" });
  }
});

module.exports = router;
