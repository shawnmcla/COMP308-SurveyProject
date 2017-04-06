/**
 * File name: db.js
 * Authors:
 * Shawn McLaughlin <shawnmcdev@gmail.com>
 * Joshua Korovesi <joshua.j.korovesi@gmail.com>
 * Site: https://joshawn-opine.herokuapp.com/
 * Description: Defines mongoose DB connection
 */

let mongoose = require('mongoose');

//Local environment URI.
let URI = "mongodb://localhost/surveyapp";

//Use environment var URI for production
mongoose.connect(process.env.URI || URI);

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log("Connected to MongoDB instance.");
});
