import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Welcome from './Welcome';
import NotFound from './NotFound';
import Login from './Login';
import Bid from './Bid';
import AdminPanel from './AdminPanel';
import AdminLogin from './AdminLogin';
import Register from './Register';

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact path="/home" component={Welcome} />
            <Route exact path="/home/squad/buy" component={Welcome} />
            <Route exact path="/home/squad" component={Welcome} />
            <Route exact path="/auctionlogin" component={Login} />
            <Route exact path="/bid" component={Bid} />
            <Route exact path="/AdminLogin" component={AdminLogin} />
            <Route exact path="/adminPanel" component={AdminPanel} />
            <Route exact path="/register" component={Register} />
            <Route path="*" component={NotFound} />
        </Switch>
    </BrowserRouter>,
    document.getElementById('content')
);
