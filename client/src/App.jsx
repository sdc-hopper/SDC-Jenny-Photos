import React from 'react';
import ReactDOM from 'react-dom';
import Thumbnails from './components/Photos.jsx';
import styled from 'styled-components';

const PhotosWrapper = styled.div`
  display: flex;

`;

const PrimaryPhotoWrapper = styled.div`
  flex-basis: 65%;
  min-width: 278px;
`;

const PrimaryPhoto = styled.img`
  max-width: 100%;
  height: auto;
`;

class Photos extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      productId: null,
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
    let url = window.location.href;
    let productId = url.split('/')[3] || 1000;
    console.log(productId);
    fetch(`http://localhost:4002/photos/id/${productId}`)
    .then(res => res.json())
    .then((productPhotos) => {
      this.setState({
        productId: productId,
        primaryPhotoUrl: productPhotos.primaryUrl,
        productPhotosUrls: productPhotos.productUrls
      });
    });
  }

  render () {

  return (
      <PhotosWrapper id={"thisOne"}>
        <Thumbnails setPrimary={this.setPrimary} primaryPhotoUrl={this.state.primaryPhotoUrl} photos={this.state.productPhotosUrls}/>
        <PrimaryPhotoWrapper>
          <PrimaryPhoto style={{maxWidth: "100%", height: "auto"}} src={this.state.primaryPhotoUrl}></PrimaryPhoto>
        </PrimaryPhotoWrapper>
      </PhotosWrapper>
    );
  }
}

// export default Photos;

ReactDOM.render(<Photos />, document.getElementById('photos'));