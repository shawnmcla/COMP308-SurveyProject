/**
 * File name: polls.js
 * Authors:
 * Shawn McLaughlin <shawnmcdev@gmail.com>
 * Joshua Korovesi <joshua.j.korovesi@gmail.com>
 * Site: https://joshawn-opine.herokuapp.com/
 * Description: Defines polls controller functions.
 */

let express = require('express');

let SurveySchema = require('../models/survey');
let Survey = SurveySchema.Survey
let SurveyTypes = SurveySchema.SurveyTypes;

exports.getDashboard = (req, res) => {
    res.render('polls/dashboard', {
        title: 'Dashboard',
        userName: req.user.username,
        data: null,
    });
}

exports.getBrowsePolls = (req, res) => {
    res.render('polls/browse', {
        title: 'Browse Surveys',
        userName: req.user ? req.user.username : "Guest",
        data: null,
    });
}

exports.getNewTF = (req, res) => {
    let date = new Date();
    res.render('polls/newTrueFalse', {
        title: 'New True False Survey',
        userName: req.user.username,
        data: {
            date: date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate(),
        },
    });
}

exports.postNewTF = (req, res) => {
    let newSurvey = {
        "title": req.body.title,
        "author": req.user._id,
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
    })
}

exports.getOwnSurveys = (req, res) =>{
    res.end();
    return; //todo
}

exports.getNewMC = (req, res) => {
    let date = new Date();
    res.render('polls/mcSurvey', {
        title: 'MultiChoice',
        userName: req.user.username,
        data: {
            date: date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate(),
        },
    });
}

exports.getNewSA = (req, res) => {
    let date = new Date();
    res.render('polls/saSurvey', {
        title: 'Short Answer',
        userName: req.user.username,
        data: {
            date: date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate(),
        },
    });
}
