const express = require('express');
const app = express();

const auth = require('./routes/auth');
const sample = require('./routes/sample');
const login = require('./routes/clientLogin');
const bid = require('./routes/bid');
const buyplayer = require('./routes/buyplayer');
const register = require('./routes/clientRegistration');
const adminLogin = require('./routes/adminLogin');
const getsquad = require('./routes/getsquad');
const allPlayers = require('./routes/allPlayers');
const skillAndPrice = require('./routes/skillandprice');
const adminAuthCheck = require('./middleware/adminAuthCheck');

app.use('/api', auth);
app.use('/api', sample);
app.use('/api', bid);
app.use('/api', buyplayer);
app.use('/api', getsquad);

app.use('/login', login);
app.use('/api', register);
app.use('/api', adminLogin);
app.use('/api', allPlayers);
app.use('/api', skillAndPrice);

module.exports = app;
