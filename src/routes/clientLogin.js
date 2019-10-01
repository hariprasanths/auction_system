const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const Sendresponse = require('../sendresponse');
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

//app.use({})
// app.use('/', adminAuthCheck);

app.post('/', function(req, res) {
    //Authenticate from DB
    console.log(req.body.team_name);
    console.log(req.body.password);

    models.user_detail
        .findOne({
            where: {
                team_name: req.body.team_name
            },
            raw: true,
            logging: false
        })
        .then(user => {
            console.log(user);
            let message = {};
            let userToken = md5(req.body.team_name + Date.now());

            if (md5(req.body.password) == user.password) {
                models.user_detail
                    .update(
                        {user_token: userToken},
                        {
                            where: {
                                team_name: req.body.team_name
                            },
                            raw: true,
                            logging: false
                        }
                    )
                    .then(() => {
                        message['team_name'] = req.body.team_name;
                        message['user_token'] = userToken;
                        message['user_id'] = user.user_id;

                        Sendresponse(res, 200, message);
                    });
            } else {
                Sendresponse(res, 400, 'Invalid Credentials');
            }
        })
        .catch(err => {
            Sendresponse(res, 400, 'Not in table :D');
        });
});

module.exports = app;
