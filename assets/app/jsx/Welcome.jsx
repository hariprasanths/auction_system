import React, {Component} from 'react';

const style = {
    container: {
        textAlign: 'center'
    },
    title: {
        fontWeight: 'lighter',
        fontSize: '96px'
    }
};

class Welcome extends Component {
    render() {
        window.location = '/auctionlogin';
        return (
            <div style={style.container}>
                <div style={style.title}>PPL 2019</div>
            </div>
        );
    }
}

export default Welcome;
