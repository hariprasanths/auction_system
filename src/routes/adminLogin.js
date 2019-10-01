const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const Sendresponse = require('../sendresponse');
const authCheck = require('../middleware/authCheck');
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

app.post('/vikramthegreat', function(req, res) {
    //Authenticate from DB
    models.admin_detail
        .find({
            attributes: ['password'],
            where: {
                name: req.body.admin_name
            },
            raw: true,
            logging: false
        })
        .then(({password}) => {
            let message = {};
            let adminToken = md5(req.body.admin_name + Date.now());

            if (md5(req.body.password) == password) {
                models.admin_detail
                    .update(
                        {token: adminToken},
                        {
                            where: {
                                name: req.body.admin_name
                            },
                            raw: true,
                            logging: false
                        }
                    )
                    .then(() => {
                        message['admin_name'] = req.body.admin_name;
                        message['admin_token'] = adminToken;

                        Sendresponse(res, 200, message);
                    });
            } else {
                Sendresponse(res, 400, 'Invalid Credentials');
            }
        })
        .catch(err => {
            console.log(err);
            Sendresponse(res, 400, 'Not in table :D');
        });
});

module.exports = app;
