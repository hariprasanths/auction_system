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

class NotFound extends Component {
    render() {
        return (
            <div style={style.container}>
                <div style={style.title}>404</div>
            </div>
        );
    }
}

export default NotFound;
