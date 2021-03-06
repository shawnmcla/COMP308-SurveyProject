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
        messages: req.flash('msg'),
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
                    messages: req.flash('msg'),
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
                if (new Date(survey.ends) < Date.now()) {
                    req.flash('msg', { type: 'info', msg: 'This survey has ended.' });
                }
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
                    messages: req.flash('msg'),
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
                req.flash('msg', { type: "info", msg: "Invalid survey ID" });
                let redir = '/polls/dashboard';
                if (!req.user)
                    redir = '/polls/browse';
                res.redirect(redir);
                return;
            } else {
                if (new Date(survey.ends) < Date.now()) {
                    req.flash('msg', { type: 'error', msg: 'Survey has ended.' });
                    res.redirect('/polls/' + req.params.id);
                    return;
                }
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
                    let msg = "Error submitting survey. Notify site owners.";
                    let redir = "/polls/" + req.params.id;
                    if (err) {
                        req.flash('msg', { type: "error", msg: msg });
                    } else {
                        msg = "Successfully submitted survey.";
                        req.flash('msg', { type: "success", msg: msg });
                        if (req.user) // Go to dashboard if logged in
                            redir = "/polls/dashboard";
                        else
                            redir = "/polls/browse";
                    }
                    res.redirect(redir);
                    return;
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
        messages: req.flash('msg'),
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
        let redir = "/polls/new/truefalse";
        let msg = "Error creating new survey.";
        if (err) {
            req.flash('msg', { type: "error", msg: msg });
        } else {
            msg = "Successfully created survey.";
            req.flash('msg', { type: "success", msg: msg });
            redir = "/polls/" + survey._id;
        }
        res.redirect(redir);
        return;
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
        let redir = "/polls/new/shortanswers";
        let msg = "Error creating new survey.";
        if (err) {
            req.flash('msg', { type: "error", msg: msg });
        } else {
            msg = "Successfully created survey.";
            req.flash('msg', { type: "success", msg: msg });
            redir = "/polls/" + survey._id;
        }
        res.redirect(redir);
        return;
    });
}

exports.getOwnSurveys = (req, res) => {
    Survey.find()
        .where('author')
        .equals(req.user._id)
        .sort({ created: -1 })
        .exec((err, result) => {
            if (err) {
                console.log(err);
                res.redirect('/polls/dashboard');
                return;
            } else {
                console.log(result);
                res.render('polls/browseMine', {
                    title: 'Browse Surveys',
                    messages: req.flash('msg'),
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
        messages: req.flash('msg'),
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
                                messages: req.flash('msg'),
                                userName: req.user ? req.user.username : "Guest",
                                data: {
                                    survey: survey,
                                    responses: responses,
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

exports.getSurveyExport = (req, res) => {
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
                            let exportData = "";
                            responses.forEach((response) => {
                                let line = "";
                                response.answers.forEach((answer) => {
                                    line += answer + ",";
                                });
                                line += "\n";
                                exportData += line;
                            });
                            console.log(exportData);
                            res.type("text/csv").send(exportData);
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
        messages: req.flash('msg'),
        userName: req.user.username,
        data: {
            date: date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate(),
        },
    });
}
