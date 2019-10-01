import React, {Component} from 'react';
import dataFetch from './DataFetch';
import ReactDOM from 'react-dom';
import {ToastContainer, toast} from 'react-toastify';

const style = {
    container: {
        textAlign: 'center'
    },
    title: {
        fontWeight: 'lighter',
        fontSize: '96px'
    }
};

class Register extends Component {
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
        $('#btn').html('Registering');
        var team_name = $('#team_name').val();
        team_name = team_name.trim();
        var pwd = $('#pwd').val();
        pwd = pwd.trim();
        var conf_pwd = $('#conf_pwd').val();
        conf_pwd = conf_pwd.trim();

        if (team_name == '' || pwd == '' || conf_pwd == '') {
            toast.error('Plese enter valid credentials');
            $('#btn').prop('disabled', false);
            return;
        }
        if (pwd != conf_pwd) {
            toast.error('Password did not match');
            $('#btn').prop('disabled', false);
            return;
        }

        var params = {};
        if (window.location.pathname == '/gamelogin' || window.location.pathname == '/register') {
            (params.name = localStorage.admin_name), (params.token = localStorage.admin_token);
        }

        params.team_name = team_name;
        params.password = pwd;

        dataFetch('/api/register', params)
            .then(function(response) {
                if (response.status_code == 200) {
                    toast.success('Team registered successfully');
                    // localStorage.setItem('user_id', response.message['user_id']);
                    // localStorage.setItem('user_email', response.message['user_email']);
                    // localStorage.setItem('isSquadSet', response.message['is_squad_set']);
                    // localStorage.setItem('user_token', response.message['user_token']);
                    console.log(window.location.pathname);

                    $('#btn').prop('disabled', false);
                    $('#team_name').val('');
                    $('#pwd').val('');
                    $('#conf_pwd').val('');

                    $('#btn').text('Register');
                    //window.location = '/register';

                    // if (window.location.pathname == '/gamelogin') window.location = '/game';
                    // else window.location = '/bid';
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
                <ToastContainer />
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
                                <div className="row">
                                    <input
                                        placeholder="Confirm Password"
                                        id="conf_pwd"
                                        type="password"
                                        className="validate"
                                    />
                                </div>
                                <center>
                                    <div className="row">
                                        <button
                                            id="btn"
                                            type="submit"
                                            name="btn_login"
                                            className="col s12 btn btn-large waves-effect blue darken-4">
                                            Register
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

export default Register;
