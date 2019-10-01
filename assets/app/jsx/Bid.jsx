import React, {Component} from 'react';
import io from 'socket.io-client';
import {ToastContainer, toast} from 'react-toastify';
import CircularProgressBar from 'react-circular-progressbar';

const style = {
    container: {
        textAlign: 'center',
        backgroundColor: '#FFFACD',
        height: '100%',
        overflowY: 'scroll'
    },
    title: {
        fontWeight: 'lighter',
        fontSize: '25px'
    },
    greenButton: {
        backgroundColor: 'green'
    },
    redButton: {
        backgroundColor: 'red'
    },
    rowlayout: {
        flexDirection: 'row',
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    columnLayout: {
        flexDirection: 'column',
        display: 'flex',
        flex: 1,
        alignSelf: 'center',
        margin: '10px',
        alignItems: 'center'
    },
    constraintType: {
        flex: 1,
        margin: '5px'
    },
    constraintValue: {
        width: '75px',
        textAlign: 'center'
    },
    currentPlayer: {
        fontWeight: 900,
        fontSize: '35px',
        margin: '10px'
    }
};

let socket;

const constants = {
    'min-bowlers': 3,
    'min-players': 11,
    'min-wicketKeepers': 1,
    'min-allrounders': 1,
    balance: '8000 L'
};

class Bid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentBid: 0,
            playerId: 0,
            playerName: '',
            balance: 0,
            currentHolder: '',
            isBiddingOpen: false,
            players: 0,
            bowlers: 0,
            wicketKeepers: 0,
            allRounders: 0,
            previousBidAmount: 0
        };
        this.socketConnect();
    }

    componentDidMount() {
        socket.on('disconnect', () => {
            toast.error('Disconnected from server. Pls contact the event managers!');
        });
        socket.on('currentBidStatus', message => {
            console.log(message);
            if (!message.isBiddingOpen) toast.error('Please wait for bidding to open!');
            this.setState({
                playerId: message.currentPlayerId,
                playerName: message.currentPlayerName,
                currentBid: message.currentBidAmount,
                currentHolder: message.currentBidHolder,
                isBiddingOpen: message.isBiddingOpen,
                previousBidAmount: message.previousBidAmount
            });
        });
        socket.on('clientStatus', message => {
            this.setState({
                balance: message.balance,
                bowlers: message.bowlers,
                players: message.players,
                allRounders: message.allRounders,
                wicketKeepers: message.wicketKeepers
            });
        });
    }

    socketConnect() {
        socket = io.connect('/');
    }

    componentWillMount() {
        this.team_name = localStorage.getItem('team_name');
        this.user_token = localStorage.getItem('user_token');
        socket.emit('saveAsClient', {
            team_name: this.team_name,
            user_token: this.user_token
        });
    }

    handleBid() {
        if (this.state.currentBid <= this.state.balance) {
            socket.emit('clientBid', {
                team_name: this.team_name,
                amount: this.state.currentBid
            });
        } else {
            toast.error('Not enough balance!!');
        }
    }

    getLakhs = number => {
        return number / 100000 + ' L';
    };

    getPrencent = (numerator, denominator) => {
        return (numerator / denominator) * 100;
    };

    checkBalance = () => {
        return this.state.currentBid > this.state.balance;
    };

    isDisabled = () => {
        return this.state.currentHolder == this.team_name || !this.state.isBiddingOpen || this.checkBalance();
    };

    render() {
        return (
            <div style={style.container}>
                <ToastContainer />
                <div style={style.title}>BID</div>

                <div>
                    Balance: {this.getLakhs(this.state.balance)} / {constants['balance']}
                </div>

                <div style={style.rowlayout}>
                    <div style={style.columnLayout}>
                        <div style={style.constraintType}>Players</div>
                        <div style={style.constraintValue}>
                            <CircularProgressBar
                                percentage={this.getPrencent(this.state.players, constants['min-players'])}
                                text={`${this.state.players}/${constants['min-players']}`}
                            />
                        </div>
                    </div>
                    <div style={style.columnLayout}>
                        <div style={style.constraintType}>Bowlers</div>
                        <div style={style.constraintValue}>
                            <CircularProgressBar
                                percentage={this.getPrencent(this.state.bowlers, constants['min-bowlers'])}
                                text={this.state.bowlers + '/' + constants['min-bowlers']}
                            />
                        </div>
                    </div>
                </div>

                <div style={style.rowlayout}>
                    <div style={style.columnLayout}>
                        <div style={style.constraintType}>WicketKeepers</div>
                        <div style={style.constraintValue}>
                            <CircularProgressBar
                                percentage={this.getPrencent(this.state.wicketKeepers, constants['min-wicketKeepers'])}
                                text={this.state.wicketKeepers + '/' + constants['min-wicketKeepers']}
                            />
                        </div>
                    </div>
                    <div style={style.columnLayout}>
                        <div style={style.constraintType}>All-rounders</div>
                        <div style={style.constraintValue}>
                            <CircularProgressBar
                                percentage={this.getPrencent(this.state.allRounders, constants['min-allrounders'])}
                                text={this.state.allRounders + '/' + constants['min-allrounders']}
                            />
                        </div>
                    </div>
                </div>

                <div style={style.columnLayout}>
                    <div>Current Player</div>
                    <div style={style.currentPlayer}>
                        ({this.state.playerId}) {this.state.playerName}
                    </div>
                </div>
                <div style={style.columnLayout}>
                    <div>Current Bid</div>
                    <div style={style.currentPlayer}>
                        {this.state.currentHolder +
                            (this.state.currentHolder === this.team_name
                                ? ' (you) ' + this.getLakhs(this.state.previousBidAmount)
                                : ' ' + this.getLakhs(this.state.previousBidAmount))}
                    </div>
                </div>
                <button
                    id="btn"
                    type="button"
                    name="btn_login"
                    onClick={() => this.handleBid()}
                    disabled={this.isDisabled()}
                    className="col s12 btn btn-large waves-effect green darken-4">
                    BID for {this.getLakhs(this.state.currentBid)}
                </button>
            </div>
        );
    }
}

export default Bid;
