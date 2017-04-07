/**
 * File name: survey.js
 * Authors:
 * Shawn McLaughlin <shawnmcdev@gmail.com>
 * Joshua Korovesi <joshua.j.korovesi@gmail.com>
 * Site: https://joshawn-opine.herokuapp.com/
 * Description: Defines mongoose schema for Survey documents.
 */

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let SURVEY_TYPES = {
    "TRUEORFALSE": 0,
    "MULTIPLECHOICE": 1,
    "SHORTANSWERS": 2
}

let questionChildSchema = new Schema({
    question: {
        type: String,
        default: '',
        trim: true
    },
    choices: [
        {
            type: String,
            default: '',
            trim: true
        }
    ]
});

//create a model class
let surveysSchema = Schema({
    title: {
        type: String,
        default: '',
        trim: true,
        required: "Survey must have a title."
    },
    author: {
        type: mongoose.SchemaTypes.ObjectId,
        required: "Survey must have an author"
    },
    created: {
        type: Date,
        default: Date.now
    },
    ends: {
        type: Date
    },
    type: {
        type: String,
        required: "Survey type is required."
    },
    questions: [questionChildSchema],
},
    {
        collection: "surveys"
    });

exports.Survey = mongoose.model('survey', surveysSchema);