const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const Sendresponse = require('../sendresponse');
const authCheck = require('../middleware/authCheck');
const adminAuthCheck = require('../middleware/adminAuthCheck');
const models = require(__dirname + '/../../models/');
const md5 = require('md5');

// trust first proxy
app.set('trust proxy', 1);

app.use(
    cookieSession({
        name: 'session',
        keys: ['key1', 'key2']
    })
);

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

app.use(bodyParser.json());

app.use('/register', adminAuthCheck);

app.post('/register', function(req, res) {
    let balance;

    models.constant
        .findOne()
        .then(constants => {
            balance = constants.balance;

            //Add to DB
            models.user_detail
                .build({
                    team_name: req.body.team_name.toLowerCase().trim(),
                    password: md5(req.body.password),
                    balance: balance
                })
                .save()
                .then(response => {
                    Sendresponse(res, 200, 'User Registered Successfully');
                })
                .catch(err => {
                    console.log(err);
                    Sendresponse(res, 400, 'Error registering user');
                });
        })
        .catch(err => {
            console.log(err);
            Sendresponse(res, 400, 'Error registering user');
        });
});

module.exports = app;
