const models = require(__dirname + '/../../models/');

let bidDetails = {
    isBiddingOpen: false,
    currentPlayerId: 0,
    currentPlayerName: '',
    currentBidHolder: '', //Team name of bid holder
    currentBidHolderId: 0,
    currentBidAmount: 0,
    previousBidAmount: 0,
    currentPlayerUrl: ''
};

let bidStack = [];

function placeBid(data, io, connectionManager) {
    console.log('..........................bidManager', data);
    if (
        bidDetails['isBiddingOpen'] &&
        bidDetails['currentBidAmount'] <= data['amount'] &&
        data['amount'] <= connectionManager.clientsMap[data['team_name']]['balance']
    ) {
        bidDetails['currentBidHolder'] = data['team_name'];
        bidDetails['currentBidHolderId'] = connectionManager.clientsMap[data['team_name']]['userId'];
        bidStack.push({
            bidPrice: data['amount'],
            playerId: bidDetails['currentPlayerId'],
            teamName: data['team_name'],
            userId: connectionManager.clientsMap[data['team_name']]['userId']
        });
        bidDetails['previousBidAmount'] = bidDetails['currentBidAmount'];
        console.log('..................updating bid amount.....................');
        //Increment currentBidAmount
        if (2000000 <= bidDetails['currentBidAmount'] && bidDetails['currentBidAmount'] < 3000000) {
            bidDetails['currentBidAmount'] += 100000;
        } else if (3000000 <= bidDetails['currentBidAmount'] && bidDetails['currentBidAmount'] < 5000000) {
            bidDetails['currentBidAmount'] += 100000;
        } else if (5000000 <= bidDetails['currentBidAmount'] && bidDetails['currentBidAmount'] < 10000000) {
            bidDetails['currentBidAmount'] += 200000;
        } else if (10000000 <= bidDetails['currentBidAmount'] && bidDetails['currentBidAmount'] < 20000000) {
            bidDetails['currentBidAmount'] += 5000000;
        } else if (20000000 <= bidDetails['currentBidAmount'] && bidDetails['currentBidAmount'] < 40000000) {
            bidDetails['currentBidAmount'] += 1000000;
        } else if (40000000 <= bidDetails['currentBidAmount'] && bidDetails['currentBidAmount'] < 100000000) {
            bidDetails['currentBidAmount'] += 2000000;
        } else if (100000000 <= bidDetails['currentBidAmount']) {
            bidDetails['currentBidAmount'] += 10000000;
        }
        io.sockets.emit('currentBidStatus', bidDetails);
    }
}

module.exports = {bidDetails, bidStack, placeBid};
