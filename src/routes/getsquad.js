const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const Sendresponse = require('../sendresponse');
const authCheck = require('../middleware/authCheck');
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
app.use('/getsquad', authCheck);

//associations
models.squad_detail.belongsTo(models.player_detail, {foreignKey: 'player_id'});
models.squad_detail.belongsTo(models.batting_detail, {foreignKey: 'player_id'});
models.squad_detail.belongsTo(models.bowling_detail, {foreignKey: 'player_id'});
models.squad_detail.belongsTo(models.user_detail, {foreignKey: 'user_id'});

//routes
app.post('/getsquad', function(req, res) {
    try {
        let status_code;
        let message;

        let user_id = req.body.user_id;

        //get user squad from squad details
        models.squad_detail
            .findAll({
                where: {
                    user_id: user_id
                },
                include: [
                    {model: models.player_detail},
                    {model: models.batting_detail},
                    {model: models.bowling_detail},
                    {model: models.user_detail}
                ]
            })
            .then(function(squad) {
                status_code = 200;
                message = squad;
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
