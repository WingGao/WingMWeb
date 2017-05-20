import React from 'react';
import ReactDOM from 'react-dom';

export default class Hello extends React.Component {
    es6() {
        (() => {
            console.log('from Hello.render')
        })()
    }
    componentDidMount(){
        this.es6()
    }

    render() {
        // debugger
        return (<h1>Hello world</h1>);
        // return React.createElement('div', null, 'hello3')
    }
}

ReactDOM.render(<Hello/>, document.getElementById('app'))