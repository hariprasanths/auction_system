const Sequelize = require('sequelize');
const models = require(__dirname + '/../../models/');

function openBidForPlayer(adminSocket, data, io, handleBid) {
    //Check if player already bought
    models.squad_detail
        .find({
            attributes: ['user_id'],
            where: {
                player_id: data['player_id']
            },
            raw: true,
            logging: false
        })
        .then(userId => {
            if (userId != null) {
                adminSocket.emit('adminError', {message: 'Player bought by user-id = ' + userId['user_id']});
                return;
            }

            models.player_detail
                .find({
                    attributes: ['player_id', 'player_name', 'player_price', 'image_url'],
                    where: {
                        player_id: data['player_id']
                    },
                    raw: true,
                    logging: false
                })
                .then(dbData => {
                    if (dbData != null) {
                        //Update bidDetails object
                        handleBid.bidDetails.currentPlayerId = dbData.player_id;
                        handleBid.bidDetails.currentPlayerName = dbData.player_name;
                        handleBid.bidDetails.currentBidHolder = '';
                        handleBid.bidDetails.currentBidHolderId = -1;
                        handleBid.bidDetails.currentBidAmount = dbData.player_price;
                        handleBid.bidDetails.isBiddingOpen = true;
                        if (dbData['image_url'] != '_') handleBid.bidDetails.currentPlayerUrl = dbData['image_url'];
                        else handleBid.bidDetails.currentPlayerUrl = '';

                        io.sockets.emit('currentBidStatus', handleBid.bidDetails);
                    } else {
                        adminSocket.emit('adminError', {message: 'No such player id!'});
                    }
                });
        });
}

function closeBidForPlayer(handleConnections, handleBid, io) {
    let bidDetails = handleBid.bidDetails;
    let bidStack = handleBid.bidStack;
    let playerId = bidDetails['currentPlayerId'];
    let previousBidAmount = bidDetails['previousBidAmount'];

    //Close Bidding + emit
    bidDetails['isBiddingOpen'] = false;
    bidDetails['currentPlayerId'] = 0;
    bidDetails['currentPlayerName'] = '';
    bidDetails['currentPlayerName'] = '';
    bidDetails['currentBidHolder'] = '';
    bidDetails['currentBidHolderId'] = 0;
    bidDetails['currentBidAmount'] = 0;
    bidDetails['currentPlayerUrl'] = '';
    bidDetails['previousBidAmount'] = '';

    io.sockets.emit('currentBidStatus', handleBid.bidDetails);

    //Update Winning Client
    targetClientInMap = handleConnections.clientsMap[bidStack[bidStack.length - 1]['teamName']];
    if (targetClientInMap) {
        models.player_detail
            .find({
                attributes: ['player_type'],
                where: {
                    player_id: playerId
                },
                raw: true,
                logging: false
            })
            .then(playerData => {
                targetClientInMap['playerCount']++;
                if (playerData['player_type'] == 'Allrounder') {
                    targetClientInMap['allRounderCount']++;
                } else if (playerData['player_type'] == 'Bowler') {
                    targetClientInMap['bowlerCount']++;
                } else if (playerData['player_type'] == 'Wicketkeeper') {
                    targetClientInMap['wicketkeeperCount']++;
                }

                targetClientInMap['balance'] -= previousBidAmount;

                //Emit to client
                targetClientInMap['socket'].emit('clientStatus', {
                    balance: targetClientInMap['balance'],
                    bowlers: targetClientInMap['bowlerCount'],
                    players: targetClientInMap['playerCount'],
                    allRounders: targetClientInMap['allRounderCount'],
                    wicketKeepers: targetClientInMap['wicketkeeperCount']
                });

                //Clear stack
                handleBid.bidStack.splice(0, handleBid.bidStack.length);
            });
    }
}

module.exports = {openBidForPlayer, closeBidForPlayer};
