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
app.use('/buyplayer', adminAuthCheck);

//routes
app.post('/buyplayer', function(req, res) {
    try {
        let status_code;
        let message;

        let user_id = req.body.user_id;
        let player_id = req.body.player_id;
        let player_price = req.body.player_price;

        //check & update user budzet
        models.user_detail
            .findById(user_id)
            .then(function(user) {
                let updated_balance = Number(user.balance) - Number(player_price);
                if (updated_balance >= 0) {
                    user.update({balance: updated_balance})
                        .then(function() {
                            //add player into user's squad
                            models.squad_detail
                                .create({
                                    user_id: user_id,
                                    player_id: player_id,
                                    player_stamina: 75,
                                    player_confidence: 75,
                                    player_form: 75,
                                    is_injured: 0
                                })
                                .then(function() {
                                    status_code = 200;
                                    message = 'Player added to squad successfully.';
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
                    status_code = 400;
                    message = "You don't have sufficient budzet";
                    Sendresponse(res, status_code, message);
                }
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
