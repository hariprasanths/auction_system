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
    }

    handleSubmit(event) {
        event.preventDefault();

        $('#btn').prop('disabled', true);
        $('#btn').html('Logging in');
        var admin_name = $('#admin_name').val();
        var pwd = $('#pwd').val();

        if (admin_name == '' || pwd == '') {
            notify.show('Plese enter valid credentials', 'error', 3000);
            $('#btn').prop('disabled', false);
            return;
        }

        dataFetch('/api/vikramthegreat', {admin_name: admin_name, password: pwd})
            .then(function(response) {
                if (response.status_code == 200) {
                    localStorage.setItem('admin_token', response.message.admin_token);
                    localStorage.setItem('admin_name', response.message.admin_name);
                    window.location = '/adminPanel';
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
                        <img id="landing-logo" style={{height: '300px'}} src="/assets/images/deltaLogoGreen.png" />
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
                                    <input placeholder="Team Name" id="admin_name" type="text" className="validate" />
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
