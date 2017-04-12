/**
 * File name: polls.js
 * Authors:
 * Shawn McLaughlin <shawnmcdev@gmail.com>
 * Joshua Korovesi <joshua.j.korovesi@gmail.com>
 * Site: https://joshawn-opine.herokuapp.com/
 * Description: Defines polls controller functions.
 */

let express = require('express');
let mongoose = require('mongoose');

let SurveySchema = require('../models/survey');
let Survey = SurveySchema.Survey
let SurveyTypes = SurveySchema.SurveyTypes;
let ResponseSchema = require('../models/response');
let SurveyResponse = ResponseSchema.Response;

exports.getDashboard = (req, res) => {
    res.render('polls/dashboard', {
        title: 'Dashboard',
        userName: req.user.username,
        messages:req.flash('msg'),
        data: null,
    });
}

exports.getBrowsePolls = (req, res) => {
    let today = new Date();
    Survey.find()
        .where('starts')
        .lt(today)
        .where('ends')
        .gt(today)
        .sort({ title: 1 })
        .exec((err, result) => {
            if (err || !result) {
                console.log(err || "Not found");
                res.redirect('/polls/dashboard');
                return;
            } else {
                console.log(result);
                res.render('polls/browse', {
                    title: 'Browse Surveys',
                    userName: req.user ? req.user.username : "Guest",
                    messages:req.flash('msg'),
                    data: { surveys: result },
                });
            }
        });
}

exports.getPollById = (req, res) => {
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
        console.log("Invalid survey ID");
        res.redirect('/polls/dashboard');
        return;
    } else {
        Survey.findById(req.params.id, (err, survey) => {
            let template = "";
            if (err || !survey) {
                console.log("No survey found for id: " + req.params.id);
                res.redirect('/polls/dashboard');
                return;
            } else {
                console.log("FOUND", survey);
                switch (survey.type) {
                    case SurveyTypes.TRUEORFALSE:
                        template = "tfSurvey";
                        break;
                    case SurveyTypes.SHORTANSWERS:
                        template = "saSurvey";
                        break;
                    case SurveyTypes.MULTIPLECHOICE:
                        template = "mcSurvey";
                        break;
                    default:
                        console.log("Invalid survey type!!!");
                        res.redirect('/polls/dashboard');
                        return;
                        break;
                }
                res.render("polls/" + template, {
                    title: survey.title,
                    userName: req.user ? req.user.username : "Guest",
                    messages:req.flash('msg'),
                    data: { survey: survey }
                });
                return;
            }
        });
    }
}

exports.answerPoll = (req, res) => {
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
        console.log("Invalid survey ID");
        res.redirect('/polls/dashboard');
        return;
    } else {
        console.log(req.body);
        Survey.findById(req.params.id, (err, survey) => {
            if (err || !survey) {
                console.log("No such survey");
                res.redirect('/polls/dashboard');
                return;
            } else {
                let response = {
                    "survey": req.params.id,
                    answers: [
                        req.body.q1,
                        req.body.q2,
                        req.body.q3,
                        req.body.q4,
                        req.body.q5
                    ]
                }
                SurveyResponse.create(response, (err, response) => {
                    //TODO: Error page, success page.
                    if (err) {
                        console.log("Error saving response");
                        res.redirect('/polls/dashboard');
                        return;
                    } else {
                        console.log("Successfully saved response.");
                        res.redirect('/polls/dashboard');
                        return;
                    }
                });
            }
        });
    }
}

exports.getNewTF = (req, res) => {
    let date = new Date();
    res.render('polls/newTrueFalse', {
        title: 'New True False Survey',
        userName: req.user.username,
        messages:req.flash('msg'),
        data: {
            date: date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate(),
        },
    });
}

exports.postNewTF = (req, res) => {
    let newSurvey = {
        "title": req.body.title,
        "author": req.user._id,
        "authorName": req.user.username,
        "starts": req.body.starts,
        "type": SurveyTypes.TRUEORFALSE,
        "questions": [
            { question: req.body.q1 },
            { question: req.body.q2 },
            { question: req.body.q3 },
            { question: req.body.q4 },
            { question: req.body.q5 },
        ]
    }
    if (req.body.ends) {
        newSurvey.ends = req.body.ends;
    }

    Survey.create(newSurvey, (err, survey) => {
        if (err) {
            console.log(err);
            res.redirect('./');
            return;
        } else {
            console.log("Success: " + survey);
            res.redirect('/polls/dashboard');
            return;
        }
    });
}

exports.postNewSA = (req, res) => {
    let newSurvey = {
        "title": req.body.title,
        "author": req.user._id,
        "authorName": req.user.username,
        "starts": req.body.starts,
        "type": SurveyTypes.SHORTANSWERS,
        "questions": [
            { question: req.body.q1 },
            { question: req.body.q2 },
            { question: req.body.q3 },
            { question: req.body.q4 },
            { question: req.body.q5 },
        ]
    }
    if (req.body.ends) {
        newSurvey.ends = req.body.ends;
    }

    Survey.create(newSurvey, (err, survey) => {
        if (err) {
            console.log(err);
            res.redirect('./');
            return;
        } else {
            console.log("Success: " + survey);
            res.redirect('/polls/dashboard');
            return;
        }
    });
}

exports.getOwnSurveys = (req, res) => {
    Survey.find()
        .where('author')
        .equals(req.user._id)
        .sort({ title: 1 })
        .exec((err, result) => {
            if (err) {
                console.log(err);
                res.redirect('/polls/dashboard');
                return;
            } else {
                console.log(result);
                res.render('polls/browseMine', {
                    title: 'Browse Surveys',
                    messages:req.flash('msg'),
                    userName: req.user ? req.user.username : "Guest",
                    data: { surveys: result },
                });
            }
        });
}

exports.getNewMC = (req, res) => {
    let date = new Date();
    res.render('polls/mcSurvey', {
        title: 'MultiChoice',
        userName: req.user.username,
        messages:req.flash('msg'),
        data: {
            date: date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate(),
        },
    });
}

exports.getSurveyResponses = (req, res) => {
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
        console.log("Invalid survey ID");
        res.redirect('/polls/dashboard');
        return;
    } else {
        Survey.findById(req.params.id, (err, survey) => {
            if (err || !res) {
                console.log(err || "Not found");
                res.redirect('/polls/dashboard');
                return; //error msg?
            } else {
                if (String(survey.author) == String(req.user._id)) {
                    SurveyResponse.find({ "survey": survey._id }, (err, responses) => {
                        if (err) {
                            console.log(err);
                            res.redirect('/polls/dashboard');
                            return;
                        } else {
                            res.render('polls/responses', {
                                title: 'Survey Responses',
                                messages:req.flash('msg'),
                                userName: req.user ? req.user.username : "Guest",
                                data: {
                                    survey: survey,
                                    responses: responses
                                },
                            });
                        }
                    });
                } else {
                    res.status(403).end("Not authorized to access this survey.");
                    return;
                }
            }
        });
    }
}

exports.getNewSA = (req, res) => {
    let date = new Date();
    res.render('polls/newShortAnswer', {
        title: 'Short Answer',
        messages:req.flash('msg'),
        userName: req.user.username,
        data: {
            date: date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate(),
        },
    });
}
