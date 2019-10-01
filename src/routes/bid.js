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

//Sample file for all routes other than /auth/web, /auth/app, /logout/web, /logout/app,

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

//Middleware to check for authorization
app.use('/bid', adminAuthCheck);

//routes
app.post('/bid', function(req, res) {
    try {
        let status_code;
        let message;

        let all_bids = req.body.all_bids;

        models.bid_detail
            .bulkCreate(all_bids)
            .then(function() {
                status_code = 200;
                message = 'Bid added successfully';
                Sendresponse(res, status_code, message);
            })
            .catch(function(err) {
                status_code = 500;
                message = err.message;
                Sendresponse(res, status_code, message);
            });
    } catch (err) {
        status_code = 500;
        message = err.message;
        Sendresponse(res, status_code, message);
    }
});

module.exports = app;
