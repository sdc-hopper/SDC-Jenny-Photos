import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  constructor (props) {
    super (props);
    this.state = {};
  }

  componentDidMount() {
    fetch('http://localhost:4002/photo')
    .then(result => console.log('hello-client'));
  }

  render () {



    return (
      <h1>Goodbye World!</h1>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));