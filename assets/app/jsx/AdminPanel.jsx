import React, {Component} from 'react';
import dataFetch from './DataFetch';
import io from 'socket.io-client';
import {ToastContainer, toast} from 'react-toastify';

const style = {
    container: {
        width: '100vw',
        height: '100vh'
    },
    title: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '15vh',
        fontSize: '5vw',
        textAlign: 'center'
    },
    detailsContainer: {
        minHeight: '80vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    teamStatus: {
        width: '100vw',
        height: '15vh',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderTop: '1px solid'
    },
    bidDetails: {
        width: '25vw',
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center'
        //justifyContent: 'center'
    },
    allbids: {
        width: '25vw',
        maxHeight: '80vh',
        overflowY: 'scroll',
        display: 'flex',
        flexDirection: 'column'
    },
    onebid: {
        width: '25vw',
        height: '50px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: '2vw'
    },
    controlBox: {
        width: '25vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    playerData: {
        width: '25vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    teamBox: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center'
    }
};

let socket;

class AdminPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrayOfBids: [],
            currentPlayerId: -1,
            currentPlayerName: '',
            currentBidHolder: '',
            currentBidAmount: '',
            currentPlayerUrl: '',
            teamsOnline: {}
        };
        this.socketConnect();
    }

    socketConnect() {
        socket = io.connect('/');
    }

    componentWillMount() {
        socket.emit('saveAsAdmin', {
            admin_name: localStorage.getItem('admin_name'),
            admin_token: localStorage.getItem('admin_token')
        });
        socket.on('disconnect', () => {
            toast.error('Token mismatch. Disconnected from server!');
        });

        socket.on(
            'currentBidStatus',
            ({
                currentPlayerId,
                currentPlayerName,
                currentBidHolder,
                previousBidAmount,
                currentBidHolderId,
                currentPlayerUrl
            }) => {
                // currentPlayerId currentPlayerName currentBidHolder currentBidAmount isBiddingOpen
                let currentBidAmount = previousBidAmount;
                if (currentBidHolder && currentBidHolderId != 0) {
                    this.setId.value = currentPlayerId;
                    this.state.arrayOfBids.push({
                        player_id: currentPlayerId,
                        currentPlayerName,
                        currentBidHolder,
                        user_id: currentBidHolderId,
                        bid_price: currentBidAmount
                    });
                    this.setState({
                        arrayOfBids: this.state.arrayOfBids,
                        currentPlayerId: currentPlayerId,
                        currentPlayerName: currentPlayerName,
                        currentBidHolder: currentBidHolder,
                        currentBidAmount: currentBidAmount,
                        currentBidHolderId: currentBidHolderId,
                        currentPlayerUrl: currentPlayerUrl
                    });
                } else if (currentBidHolderId != 0) {
                    this.setId.value = currentPlayerId;
                    this.setState({
                        arrayOfBids: [],
                        currentPlayerId: currentPlayerId,
                        currentPlayerName: currentPlayerName,
                        currentBidHolder: currentBidHolder,
                        currentBidAmount: currentBidAmount,
                        currentBidHolderId: currentBidHolderId,
                        currentPlayerUrl: currentPlayerUrl
                    });
                } else {
                    this.handlePlayerBid(Number(this.setId.value), 1);
                }
            }
        );

        socket.on('allUsers', message => {
            let allTeams = {};
            for (let team of message) {
                allTeams[team] = false;
            }
            this.setState({
                teamsOnline: allTeams
            });
        });

        socket.on('onlineUsers', message => {
            let teamsOnline = this.state.teamsOnline;
            for (let team in teamsOnline) {
                teamsOnline[team] = false;
            }
            for (let team of message) {
                teamsOnline[team] = true;
            }
            this.setState({
                teamsOnline
            });
        });

        socket.on('adminError', ({message}) => {
            toast.error('Error : ' + message);
        });

        if (!localStorage.getItem('playerdetails')) {
            dataFetch('/api/players', {})
                .then(response => {
                    var players = response.message;
                    this.allPlayers = response.message;
                    localStorage.setItem('playerdetails', JSON.stringify(players));
                })
                .catch(function(err) {
                    console.log(err);
                });
        } else {
            console.log('Already fetched!');
            this.allPlayers = JSON.parse(localStorage.getItem('playerdetails'));
        }
    }

    handleCloseBID() {
        let lastPlayer = this.state.arrayOfBids[this.state.arrayOfBids.length - 1];
        dataFetch('/api/bid', {
            all_bids: this.state.arrayOfBids,
            name: localStorage.getItem('admin_name'),
            token: localStorage.getItem('admin_token')
        })
            .then(bidData => {
                if (bidData.status_code == 200) {
                    dataFetch('/api/buyplayer', {
                        user_id: lastPlayer.user_id,
                        player_id: lastPlayer.player_id,
                        player_price: lastPlayer.bid_price,
                        name: localStorage.getItem('admin_name'),
                        token: localStorage.getItem('admin_token')
                    })
                        .then(playerData => {
                            if (playerData.status_code == 200) {
                                this.allPlayers[lastPlayer.player_id - 1] = null;
                                localStorage.setItem('playerdetails', JSON.stringify(this.allPlayers));
                                socket.emit('closeBid', 'pannu da vikram');
                            } else if (playerData.status_code == 400) {
                                toast.alert(playerData.message);
                            } else {
                                console.log(playerData.message);
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    handleSetId(node) {
        socket.emit('openBidForPlayer', {
            player_id: node.value
        });
    }

    handlePlayerBid(currentPlayerId, step) {
        for (let idx = currentPlayerId + step - 1; idx < this.allPlayers.length && idx >= 0; idx += step) {
            if (this.allPlayers[idx]) {
                socket.emit('openBidForPlayer', {
                    player_id: idx + 1
                });
                return;
            }
        }
        toast.error('all players bought!');
    }

    getLakhs = number => {
        return number / 100000 + ' L';
    };

    render() {
        return (
            <div style={style.container}>
                <ToastContainer />
                {/* title */}
                {/* details container */}
                <div style={style.detailsContainer}>
                    {/* bid_details left */}
                    <div style={style.bidDetails}>
                        <ul id="bid_stack" class="collection" style={style.allbids}>
                            {Array.from(this.state.arrayOfBids)
                                .reverse()
                                .map((item, index) => (
                                    <li key={index} class="collection-item" style={{borderBottom: '1px solid'}}>
                                        <div style={style.onebid}>
                                            <div style={{flex: 1}}>{item.currentBidHolder}</div>
                                            <div style={{flex: 1}}>₹ {this.getLakhs(item.bid_price)}</div>
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    </div>
                    {/* input & control buttons */}
                    <div style={style.controlBox}>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: '50px'
                            }}>
                            <input
                                style={{width: '15vw', fontSize: '1vw', textAlign: 'center'}}
                                type="number"
                                name="setId"
                                ref={node => (this.setId = node)}
                                placeholder="type player Id"
                            />
                            <button
                                style={{width: '10vw', fontSize: '1vw'}}
                                class="waves-effect waves-light btn"
                                type="button"
                                onClick={() => this.handleSetId(this.setId)}>
                                Set bid
                            </button>
                        </div>
                        <div class="row">
                            <button
                                class="waves-effect waves-light btn-small"
                                type="button"
                                onClick={() => this.handlePlayerBid(this.state.currentPlayerId, -1)}>
                                <i class="material-icons">chevron_left</i>
                            </button>
                            <button
                                class="waves-effect waves-light btn-small"
                                type="button"
                                onClick={() => this.handlePlayerBid(this.state.currentPlayerId, 1)}>
                                <i class="material-icons">chevron_right</i>
                            </button>
                        </div>
                    </div>

                    {/* player details */}
                    <div style={style.playerData}>
                        <div class="card">
                            <div class="card-image">
                                <img
                                    src={
                                        this.state.currentPlayerUrl ||
                                        'https://sharperedge.net/wp-content/uploads/2013/07/profile-default.jpg'
                                    }
                                    style={{width: '20vw', height: '20vw'}}
                                />
                            </div>
                            <div class="card-content">
                                <span style={{fontWeight: '500', fontSize: '2vw'}}>
                                    ID: {this.state.currentPlayerId}
                                </span>
                                <br />
                                <span style={{fontWeight: '500', fontSize: '2vw'}}>{this.state.currentPlayerName}</span>
                            </div>
                        </div>

                        <button
                            class="waves-effect waves-light btn"
                            type="button"
                            onClick={() => this.handleCloseBID()}>
                            Close bid
                        </button>
                    </div>
                </div>
                {/* all teams socket status */}
                <div style={style.teamStatus}>
                    <div style={style.teamBox}>
                        {Object.keys(this.state.teamsOnline).map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    width: '22vw',
                                    height: '3vh',
                                    marginLeft: '1vw'
                                }}>
                                <span style={{display: 'flex', flex: 0.5, textAlign: 'center', alignItems: 'center'}}>
                                    {item}{' '}
                                </span>
                                <i
                                    style={
                                        this.state.teamsOnline[item]
                                            ? {
                                                  display: 'flex',
                                                  flex: 1,
                                                  color: '#90ee90',
                                                  fontSize: '15px',
                                                  textAlign: 'left',
                                                  alignItems: 'center'
                                              }
                                            : {
                                                  display: 'flex',
                                                  flex: 1,
                                                  color: 'red',
                                                  alignItems: 'center',
                                                  fontSize: '15px',
                                                  textAlign: 'left'
                                              }
                                    }
                                    class="large material-icons">
                                    account_circle
                                </i>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default AdminPanel;
