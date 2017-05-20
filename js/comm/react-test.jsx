import React from 'react';
import ReactDOM from 'react-dom';

export default class Hello extends React.Component {
    es6() {
        (() => {
            console.log('from Hello.render')
        })()
    }

    render() {
        // return (<h1>Hello world</h1>);
        return React.createElement('div', null, 'hello')
    }
}

ReactDOM.render(<Hello/>, document.getElementById('app'))