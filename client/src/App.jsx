import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import Thumbnails from './components/Photos.jsx';
import Modal from './components/Modal.jsx';

const PhotosWrapper = styled.div`
  display: flex;
  margin-right: -9.3em;
`;

const PrimaryPhotoWrapper = styled.div`
  flex-basis: 65%;;
  min-width: 278px;
`;

const PrimaryPhoto = styled.img`
  max-width: 65%
  height: auto;
`;

class Photos extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      productId: null,
      primaryPhotoUrl: null,
      productPhotosUrls: [],
      modalCordinates: {x: 0, y: 0}
    };
    this.setPrimary = this.setPrimary.bind(this);
    this.setCordinates = this.setCordinates.bind(this);
  }

  setPrimary(e) {
    let selectedThumbnail = e.target;
    let selectedThumbnailPhotoUrl = e.target.src;

    this.setState({
      primaryPhotoUrl: selectedThumbnailPhotoUrl,
    });
  }

  setCordinates(e) {
    let xPos = e.nativeEvent.offsetX
    let ypos = e.nativeEvent.offsetY

    // console.log(e.nativeEvent);
    this.setState({
      modalCordinates: {x: xPos, y: ypos}
    });
  }

  componentDidMount() {
    let url = window.location.href;
    let productId = url.split('/')[3] || 1000;
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
    <div>
      <PhotosWrapper>
        <Thumbnails setPrimary={this.setPrimary} primaryPhotoUrl={this.state.primaryPhotoUrl} photos={this.state.productPhotosUrls}/>
        <PrimaryPhotoWrapper>
          <PrimaryPhoto onMouseMove={(e) => this.setCordinates(e)} style={{maxWidth: "100%", height: "auto"}} src={this.state.primaryPhotoUrl}></PrimaryPhoto>
          <Modal primaryPhotoUrl={this.state.primaryPhotoUrl} cordinates={this.state.modalCordinates}></Modal>
        </PrimaryPhotoWrapper>
      </PhotosWrapper>

    </div>
    );
  }
};

ReactDOM.render(<Photos />, document.getElementById('photos'));