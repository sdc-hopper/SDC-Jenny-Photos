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
    // fetch(`http://localhost:4002/photos/id/${this.state.productId}`)
    // .then(res => res.json())
    // .then((primaryPhotoUrl) => this.setState({
    //   primaryPhotoUrl: primaryPhotoUrl
    // })
    // );

    // fetch(`http://localhost:4002/photos/id/${this.state.productId}`)
    // .then(res => res.json())
    // .then((primaryPhotoUrl) => this.setState({
    //   primaryPhotoUrl: primaryPhotoUrl
    // })
    // );

    let itemsToFetch = [1, 5, 6, 99, 100];
    fetch(`http://localhost:4002/photos/id/primary/multiple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(itemsToFetch)
    })
    .then(res => res.json())
    .then(data => console.log(data));
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