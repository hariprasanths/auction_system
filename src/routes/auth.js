const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const Op = Sequelize.Op;
const request = require('request');
const querystring = require('querystring');
const md5 = require('md5');
const Sendresponse = require('../sendresponse');
const authCheck = require('../middleware/authCheck');
const models = require(__dirname + '/../../models/');
const event_secret = '463443c3df159cabc2c1c66cc90138a1';
const event_id = 21;

const tokenGenerator = email => {
    let string = 's3kret';
    let user_token = md5(email + string + Date.now());
    return user_token;
};

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

// Define the routes

app.post('/auth/web', function(req, res) {
    try {
        let status_code;
        let message;

        let email = req.body.user_email;
        let password = req.body.password;

        let data = {user_email: email, user_pass: password, event_id: event_id, event_secret: event_secret};

        request.post(
            {
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                url: 'https://api.pragyan.org/event/login',
                body: querystring.stringify(data)
            },
            function(error, response, body) {
                let user_data = JSON.parse(body);
                if (user_data.status_code == 200) {
                    models.user_detail
                        .findOrCreate({where: {email: email}, raw: true, logging: false})
                        .then(function(user) {
                            req.session.user_id = user[0].user_id;
                            console.log(req.session.user_id);
                            status_code = 200;
                            message = 'Authentication Success';
                            Sendresponse(res, status_code, message);
                        })
                        .catch(function(err) {
                            status_code = 500;
                            message = err.message;
                            Sendresponse(res, status_code, message);
                        });
                } else {
                    status_code = 401;
                    message = 'Auth failed';
                    Sendresponse(res, status_code, message);
                }
            }
        );
    } catch (err) {
        status_code = 500;
        message = err.message;
        Sendresponse(res, status_code, message);
    }
});

app.post('/auth/app', function(req, res) {
    try {
        let status_code;
        let message;

        let email = req.body.user_email;
        let password = req.body.password;

        let data = {user_email: email, user_pass: password, event_id: event_id, event_secret: event_secret};

        request.post(
            {
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                url: 'https://api.pragyan.org/event/login',
                body: querystring.stringify(data)
            },
            function(error, response, body) {
                let user_data = JSON.parse(body);
                if (user_data.status_code == 200) {
                    models.user_detail
                        .findOrCreate({where: {email: email}, raw: true, logging: false})
                        .then(function(user) {
                            let user_token = tokenGenerator(email);
                            models.user_detail
                                .update({user_token: user_token}, {where: {email: email}, raw: true, logging: false})
                                .then(function(user) {
                                    status_code = 200;
                                    message = new Object();
                                    message.message = 'Authentication Success';
                                    message.user_token = user_token;
                                    Sendresponse(res, status_code, message);
                                })
                                .catch(function(err) {
                                    status_code = 500;
                                    message = err.message;
                                    Sendresponse(res, status_code, message);
                                });
                        })
                        .catch(function(err) {
                            status_code = 500;
                            message = err.message;
                            Sendresponse(res, status_code, message);
                        });
                } else {
                    status_code = 401;
                    message = 'Auth failed';
                    Sendresponse(res, status_code, message);
                }
            }
        );
    } catch (err) {
        status_code = 500;
        message = err.message;
        Sendresponse(res, status_code, message);
    }
});

app.post('/logout/web', function(req, res) {
    req.session = null;
    Sendresponse(res, 200, 'User logged out');
});

app.post('/logout/app', function(req, res) {
    let user_id = req.body.user_id;
    models.user_detail
        .update({user_token: null}, {where: {user_id: user_id}, raw: true, logging: false})
        .then(function(user) {
            status_code = 200;
            message = 'User logged out';
            Sendresponse(res, status_code, message);
        })
        .catch(function(err) {
            status_code = 500;
            message = err.message;
            Sendresponse(res, status_code, message);
        });
});

module.exports = app;
