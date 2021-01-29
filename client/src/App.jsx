import React from 'react';
import ReactDOM from 'react-dom';
import Photos from './components/Photos.jsx';
import { Wrapper } from './style.js';

class App extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      productId: 1020,
      primaryPhotoUrl: null,
      productPhotosUrls: []
    };
    this.setPrimary = this.setPrimary.bind(this);
  }

  setPrimary(e) {
    let photoUrl = e.target.src;
    this.setState({
      primaryPhotoUrl: photoUrl
    });
  }

  componentDidMount() {
  //   fetch(`http://localhost:4002/photos/product/${this.state.productId}/primary`)
  //   .then(res => res.text())
  //   .then((primaryPhotoUrl) => this.setState({
  //     primaryPhotoUrl: primaryPhotoUrl
  //   }));

    fetch(`http://localhost:4002/photos/id/${this.state.productId}`)
    .then(res => res.json())
    .then((productPhotos) => {
      this.setState({
        primaryPhotoUrl: productPhotos.primaryUrl,
        productPhotosUrls: productPhotos.productUrls
      });
      // console.log(productPhotos.primaryUrl);
      // console.log(productPhotos.productUrls)
    });

    // fetch(`http://localhost:4002/photos/features/${this.state.productId}`)
    // .then(res => res.json())
    // .then((featuresPhotosUrls) => console.log(featuresPhotosUrls));

    // let itemsToFetch = [1, 5, 6, 99, 100];
    // fetch(`http://localhost:4002/photos/product/primary/multiple`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(itemsToFetch)
    // })
    // .then(res => res.json())
    // .then(data => console.log(data));
  }

  render () {


  return (
    <div>
      <h1>Amazon header</h1>
      <Wrapper>

        <Photos setPrimary={this.setPrimary} photos={this.state.productPhotosUrls}/>
        <img src={this.state.primaryPhotoUrl}></img>
      </Wrapper>
    </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));