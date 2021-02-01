import React from 'react';
import ReactDOM from 'react-dom';
import Thumbnails from './components/Photos.jsx';
import { PhotosWrapper, PrimaryPhoto } from './styles.js';

class Photos extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      productId: 1010,
      primaryPhotoUrl: null,
      productPhotosUrls: [],
    };
    this.setPrimary = this.setPrimary.bind(this);
  }

  setPrimary(e) {
    let selectedThumbnail = e.target;
    let selectedThumbnailPhotoUrl = e.target.src;

    this.setState({
      primaryPhotoUrl: selectedThumbnailPhotoUrl,
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
    });
  }

  render () {

  return (
      <PhotosWrapper>
        <Thumbnails setPrimary={this.setPrimary} primaryPhotoUrl={this.state.primaryPhotoUrl} photos={this.state.productPhotosUrls}/>
        <PrimaryPhoto src={this.state.primaryPhotoUrl}></PrimaryPhoto>
      </PhotosWrapper>
    );
  }
}

ReactDOM.render(<Photos />, document.getElementById('photos'));