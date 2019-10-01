const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const Sendresponse = require('../sendresponse');
const authCheck = require('../middleware/authCheck');
const models = require(__dirname + '/../../models/');
const utils = require('../utils');

//Sample file for all routes other than /auth/web, /auth/app, /logout/web, /logout/app,

// trust first proxy
app.set('trust proxy', 1);

//session
app.use(cookieSession(utils.cookieSessionSecret));

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

app.use(bodyParser.json());

//Middleware to check for authorization
//app.use('/test', authCheck);

//routes
app.post('/test', function(req, res) {
    req.session.match = 1;
    Sendresponse(res, 200, 'HOLA');
});

module.exports = app;
