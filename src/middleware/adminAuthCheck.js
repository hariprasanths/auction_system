const Sendresponse = require('../sendresponse');
const Sequelize = require('sequelize');
const models = require(__dirname + '/../../models/');

const adminAuthCheck = (req, res, next) => {
    if (req.session.length) {
        next();
    } else if (req.body.token) {
        let name = req.body.name;
        let token = req.body.token;
        models.admin_detail
            .findOne({where: {name: name, token: token}, raw: true, logging: false})
            .then(function(admin) {
                if (admin) {
                    next();
                } else {
                    Sendresponse(res, 401, 'Unauthorized access12345');
                }
            })
            .catch(function(err) {
                status_code = 500;
                message = err.message;
                Sendresponse(res, status_code, message);
            });
    } else {
        Sendresponse(res, 401, 'Unauthorized access123');
    }
};

module.exports = adminAuthCheck;
