import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      productId: 1,
      primaryPhotoUrl: null
    };
  }

  componentDidMount() {
    fetch(`http://localhost:4002/photos/id/${this.state.productId}`)
    .then(res => res.json())
    .then((primaryPhotoUrl) => this.setState({
      primaryPhotoUrl: primaryPhotoUrl
    })
    );
  }

  render () {


    return (
      <div>
        <h1>Here's the product's primary photo</h1>
        <img src={this.state.primaryPhotoUrl}></img>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));