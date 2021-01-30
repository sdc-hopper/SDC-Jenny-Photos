import React from 'react';
import ReactDOM from 'react-dom';
import Thumbnails from './components/Photos.jsx';
import { Wrapper } from './styles.js';
import { applyPrimaryThumbnailStyle, applyInitialDynamicStyle } from './applyDynamicStyles.js';

class App extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      productId: 1010,
      primaryPhotoUrl: null,
      productPhotosUrls: [],
      previousThumbnailId: "0",
    };
    this.setPrimary = this.setPrimary.bind(this);
  }

  setPrimary(e) {
    let selectedThumbnail = e.target;
    let selectedThumbnailPhotoUrl = e.target.src;
    let previousThumbnail = this.state.previousThumbnailId;

    applyPrimaryThumbnailStyle(previousThumbnail, selectedThumbnail);

    let previousThumbnailId = selectedThumbnail.id;

    this.setState({
      primaryPhotoUrl: selectedThumbnailPhotoUrl,
      previousThumbnailId: previousThumbnailId
    });
  }

  componentDidMount() {
    fetch(`http://localhost:4002/photos/id/${this.state.productId}`)
    .then(res => res.json())
    .then((productPhotos) => {
      this.setState({
        primaryPhotoUrl: productPhotos.primaryUrl,
        productPhotosUrls: productPhotos.productUrls
      });

      let numberOfThumbnailsToStyle = productPhotos.productUrls.length;
      applyInitialDynamicStyle(numberOfThumbnailsToStyle);

    });
  }

  render () {

  return (
    <div>
      <h1>Amazon header</h1>
      <Wrapper>
        <Thumbnails setPrimary={this.setPrimary} photos={this.state.productPhotosUrls}/>
        <img src={this.state.primaryPhotoUrl}></img>
      </Wrapper>
    </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));