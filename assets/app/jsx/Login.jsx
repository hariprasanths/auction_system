import React, {Component} from 'react';
import dataFetch from './DataFetch';
import ReactDOM from 'react-dom';

const style = {
    container: {
        textAlign: 'center'
    },
    title: {
        fontWeight: 'lighter',
        fontSize: '96px'
    }
};

class Login extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        var width = $(window).width();
        if (width > 600) {
            this.width = '40vw';
            this.ml = '25vw';
        } else {
            this.dis = 'none';
            this.width = '100vw';
            this.ml = '10vw';
        }

        dataFetch('/api/test', {})
            .then(function(response) {})
            .catch(function() {});
    }

    handleSubmit(event) {
        event.preventDefault();

        $('#btn').prop('disabled', true);
        $('#btn').html('Logging in');
        var team_name = $('#team_name').val();
        var pwd = $('#pwd').val();

        if (team_name == '' || pwd == '') {
            notify.show('Plese enter valid credentials', 'error', 3000);
            $('#btn').prop('disabled', false);
            return;
        }

        var params = {};
        if (window.location.pathname == '/gamelogin') {
            (params.name = localStorage.admin_name), (params.token = localStorage.admin_token);
        }

        params.team_name = team_name;
        params.password = pwd;

        dataFetch('/login', params)
            .then(function(response) {
                if (response.status_code == 200) {
                    localStorage.setItem('user_token', response.message.user_token);
                    localStorage.setItem('team_name', response.message.team_name.toLowerCase().trim());
                    localStorage.setItem('user_id', response.message.user_id);
                    console.log(window.location.pathname);
                    if (window.location.pathname == '/gamelogin') window.location = '/setteam';
                    else window.location = '/bid';
                } else if (response.status_code == 412) {
                    $('#btn').prop('disabled', false);
                    $('#btn').html('Log in');
                    $('#error').show();
                } else {
                    $('#btn').prop('disabled', false);
                    $('#btn').html('Log in');
                    $('#error').show();
                    ReactDOM.render(<p>{response.message}</p>, document.querySelector('#error'));
                }
            })
            .catch(function() {
                $('#btn').prop('disabled', false);
                ReactDOM.render(<p>Login Failed.</p>, document.querySelector('#error'));
            });
    }

    render() {
        return (
            <div style={style.container}>
                <div className="row center-align">
                    <div
                        id="desk-landing"
                        style={{marginTop: 'calc(50vh - 150px)', display: this.dis}}
                        className="col s12 l6 m6 center-align">
                        <img id="landing-logo" style={{height: '300px'}} src="/assets/images/ppllogo.svg" />
                    </div>
                    <div
                        style={{width: this.width, margin: 'auto', height: '70vh', padding: '30px', marginTop: '15vh'}}
                        className="col s12 l6 m6 center-align valign-wrapper">
                        <div style={{width: this.width}}>
                            <div
                                style={{
                                    backgroundColor: '#d9534f',
                                    padding: '2px',
                                    marginBottom: '50px',
                                    textAlign: 'center',
                                    display: 'none'
                                }}
                                id="error"
                            />
                            <h5>Pragyan Premier League | 2019 Finals</h5>
                            <form className="col s12" onSubmit={this.handleSubmit}>
                                <div className="row">
                                    <input placeholder="Team Name" id="team_name" type="text" className="validate" />
                                </div>
                                <div className="row">
                                    <input placeholder="Password" id="pwd" type="password" className="validate" />
                                </div>
                                <center>
                                    <div className="row">
                                        <button
                                            id="btn"
                                            type="submit"
                                            name="btn_login"
                                            className="col s12 btn btn-large waves-effect blue darken-4">
                                            Sign In
                                        </button>
                                    </div>
                                </center>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
