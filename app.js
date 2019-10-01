const fs = require('fs');
const express = require('express');
const app = express();
const session = require('cookie-session');
const cookieParser = require('cookie-parser');

//routes
const routes = require('./src/routes');

app.use(cookieParser());

//assets
app.use('/assets', express.static('assets'));
app.use('/build', express.static('public/build'));
app.use('/bower_components', express.static('bower_components'));

//
const WEBPACK_ASSETS_URL = 'http://localhost:8080';

if (app.get('env') != 'development') {
    var assets_names = JSON.parse(fs.readFileSync(__dirname + '/assets/webpack-assets.json', 'utf8'));
    var scripts = [assets_names.commonChunk.js, assets_names.app.js];
} else {
    var scripts = [WEBPACK_ASSETS_URL + '/build/app.js'];
}

//Set view engine
app.set('view engine', 'ejs');

//use routes with /api
app.use('/', routes);

//redirect to /home on /
app.get('/', function(req, res) {
    res.redirect('/home');
});

//Allow react router to handle the get requests
app.get('/*', function(req, res) {
    res.render('index', {scripts: scripts});
});

//
let server = app.listen(3000, function() {
    console.log('App listening on port 3000!');
});

//Socket server
const io = require('socket.io')(server, {wsEngine: 'ws'});

const handleConnections = require('./src/socketRoutes/connectionManager');
const handleBid = require('./src/socketRoutes/bidManager');
const adminOperations = require('./src/socketRoutes/adminOperationsManager');

function checkIfAdmin(socket) {
    if (socket == handleConnections.adminSocket.socket) {
        return true;
    }
    return false;
}

// const gameEngine = require('./src/socketRoutes/gameEngine');
// io.on('connection', socket => {
//     temp(io);
// });

// gameEngine(io);

io.on('connection', socket => {
    handleConnections.newConnection(socket);

    socket.on('saveAsAdmin', data => {
        handleConnections.saveAdminSocket(socket, data);
    });

    socket.on('saveAsClient', data => {
        handleConnections.saveClientSocket(socket, data, handleBid);
    });

    socket.on('clientBid', data => {
        handleBid.placeBid(data, io, handleConnections);
    });

    socket.on('openBidForPlayer', data => {
        //Admin auth
        if (!checkIfAdmin(socket)) {
            return;
        }
        adminOperations.openBidForPlayer(socket, data, io, handleBid);
    });

    socket.on('closeBid', () => {
        //Admin auth
        if (!checkIfAdmin(socket)) {
            return;
        }
        adminOperations.closeBidForPlayer(handleConnections, handleBid, io);
    });

    socket.on('disconnect', () => {
        handleConnections.handleDisconnection(socket, handleBid);
    });
});
