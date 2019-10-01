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
//app.use('/getteam', authCheck);

models.player_detail.belongsTo(models.batting_detail, {foreignKey: 'player_id'});
models.player_detail.belongsTo(models.bowling_detail, {foreignKey: 'player_id'});

//routes
app.post('/players', function(req, res) {
    try {
        let status_code;
        let message;

        models.player_detail
            .findAll({
                include: [{model: models.batting_detail}, {model: models.bowling_detail}],
                logging: false
            })
            .then(players => {
                Sendresponse(res, 200, players);
            });
    } catch (err) {
        status_code = 500;
        message = err.message;
        Sendresponse(res, status_code, message);
    }
});

module.exports = app;
