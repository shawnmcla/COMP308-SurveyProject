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
let pollsController = require('../controllers/polls');
// require the auth controller
let authController = require('../controllers/auth');
let reqAuth = authController.RequireAuth;

/* GET dashboard page. */
router.get('/dashboard', reqAuth, pollsController.getDashboard);

/* 
GET browse page.
Does not require auth, 
anons can answer surveys
*/
router.get('/browse', pollsController.getBrowsePolls);

/* GET own surveys */
router.get('/mine', reqAuth, pollsController.getOwnSurveys);

/* GET Survey responses by ID. */
router.get('/:id/details', reqAuth, pollsController.getSurveyResponses);

/* GET Survey by ID.
   POST Survey submission
 */
router.get('/:id', pollsController.getPollById)
  .post('/:id', pollsController.answerPoll);

/* GET true false page. */
router.get('/new/truefalse', reqAuth, pollsController.getNewTF)
  .post('/new/truefalse', reqAuth, pollsController.postNewTF);


/* GET multiple choice page. */
/*
router.get('/new/multiplechoice', reqAuth, function (req, res, next) {
  // TBD
});
*/

/* GET short answer page. */
router.get('/new/shortanswers', reqAuth, pollsController.getNewSA)
  .post('/new/shortanswers', reqAuth, pollsController.postNewSA);

module.exports = router;
