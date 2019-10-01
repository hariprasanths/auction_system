const Sequelize = require('sequelize');
const models = require(__dirname + '/../../models/');

let clientsMap = {};
let adminSocket = {socket: null};

function newConnection(socket) {
    console.log('New connection!');
}

function saveAdminSocket(socket, data) {
    //Authenticate Admin with DB
    models.admin_detail
        .find({
            attributes: ['token'],
            where: {
                name: data['admin_name']
            },
            raw: true,
            logging: false
        })
        .then(dbData => {
            if (dbData != null && dbData['token'] != data['admin_token']) {
                console.log('Admin Refused!');
                socket.disconnect(true);
                return;
            }
            adminSocket.socket = socket;
            console.log('Admin Saved');

            models.user_detail
                .findAll({
                    attributes: ['team_name'],
                    raw: true,
                    logging: false
                })
                .then(teamNames => {
                    let teamNameArray = [];
                    teamNames.forEach(teamNameObj => {
                        teamNameArray.push(teamNameObj['team_name']);
                    });

                    adminSocket['socket'].emit('allUsers', teamNameArray);
                });
        })
        .catch(err => {
            console.log(err);
        });
}

function saveClientSocket(socket, data, bidManager) {
    //Authenticate Client with Db
    models.user_detail
        .find({
            attributes: ['user_token', 'balance', 'user_id'],
            where: {
                team_name: data['team_name']
            },
            raw: true,
            logging: false
        })
        .then(dbData => {
            if (dbData != null && dbData['user_token'] == data['user_token']) {
                //Check if client socket already present => Disconnect prev socket
                if (clientsMap[data['team_name']]) {
                    clientsMap[data['team_name']]['socket'].disconnect(true);
                }

                //Get client's squad counts
                models.sequelize
                    .query(
                        'SELECT player_details.player_type,count(*) as count FROM squad_details,player_details ' +
                            'WHERE player_details.player_id=squad_details.player_id and user_id=' +
                            dbData['user_id'] +
                            ' group by player_details.player_type',
                        {type: models.sequelize.QueryTypes.SELECT}
                    )
                    .then(squadData => {
                        clientsMap[data['team_name']] = {
                            socket: socket,
                            balance: dbData['balance'],
                            userId: dbData['user_id'],
                            playerCount: 0,
                            wicketkeeperCount: 0,
                            bowlerCount: 0,
                            allRounderCount: 0
                        };

                        for (let element of squadData) {
                            if (element['player_type'] == 'Allrounder') {
                                clientsMap[data['team_name']]['allRounderCount'] = element['count'];
                            } else if (element['player_type'] == 'Bowler') {
                                clientsMap[data['team_name']]['bowlerCount'] = element['count'];
                            } else if (element['player_type'] == 'Wicketkeeper') {
                                clientsMap[data['team_name']]['wicketkeeperCount'] = element['count'];
                            }
                            clientsMap[data['team_name']]['playerCount'] += element['count'];
                        }

                        //Update client
                        socket.emit('currentBidStatus', bidManager.bidDetails);
                        socket.emit('clientStatus', {
                            balance: dbData['balance'],
                            bowlers: clientsMap[data['team_name']]['bowlerCount'],
                            players: clientsMap[data['team_name']]['playerCount'],
                            allRounders: clientsMap[data['team_name']]['allRounderCount'],
                            wicketKeepers: clientsMap[data['team_name']]['wicketkeeperCount']
                        });

                        //Inform admin
                        if (adminSocket['socket']) {
                            adminSocket['socket'].emit('onlineUsers', Object.keys(clientsMap));
                            console.log(Object.keys(clientsMap));
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } else {
                console.log('Client Refused!');
                socket.disconnect(true);
            }
        })
        .catch(err => {
            console.log(err);
        });
}

function handleDisconnection(socket, handleBid) {
    if (socket == adminSocket['socket']) {
        //Admin socket disconnected => Disconnect all clients
        for (var teamName in clientsMap) {
            clientsMap[teamName].socket.disconnect(true);
            delete clientsMap[teamName];
        }

        //Flush global Vars
        handleBid.bidStack.splice(0, handleBid.bidStack.length);

        handleBid.bidDetails['isBiddingOpen'] = false;
        handleBid.bidDetails['currentPlayerId'] = 0;
        handleBid.bidDetails['currentPlayerName'] = '';
        handleBid.bidDetails['currentPlayerName'] = '';
        handleBid.bidDetails['currentBidHolder'] = '';
        handleBid.bidDetails['currentBidHolderId'] = 0;
        handleBid.bidDetails['currentBidAmount'] = 0;
    } else {
        //Client Disconnected => Remove from clientsList + Inform Admin
        for (var teamName in clientsMap) {
            if (clientsMap[teamName].socket == socket) {
                if (adminSocket['socket']) {
                    adminSocket['socket'].emit('adminError', {message: 'Client Disconnected. Team Name - ' + teamName});
                }
                delete clientsMap[teamName];
                break;
            }
        }
        if (adminSocket['socket']) {
            adminSocket['socket'].emit('onlineUsers', Object.keys(clientsMap));
            console.log(Object.keys(clientsMap));
        }
    }
}

module.exports = {newConnection, saveAdminSocket, saveClientSocket, clientsMap, adminSocket, handleDisconnection};
