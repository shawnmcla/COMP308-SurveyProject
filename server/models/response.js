/**
 * File name: response.js
 * Authors:
 * Shawn McLaughlin <shawnmcdev@gmail.com>
 * Joshua Korovesi <joshua.j.korovesi@gmail.com>
 * Site: https://joshawn-opine.herokuapp.com/
 * Description: Defines mongoose schema for Response documents.
 */

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let responsesSchema = Schema({
    survey: {
        type: mongoose.SchemaTypes.ObjectId,
        required: 'Need target survey',
        index: true
    },
    answers: [{}]
});

exports.Response = mongoose.model('response', responsesSchema);