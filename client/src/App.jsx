import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import request from './request.js';
import Thumbnails from './components/Photos.jsx';
import ZoomPopover from './components/ZoomPopover.jsx';
import PhotosModal from './components/PhotosModal.jsx';

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
  &:hover {
    cursor: pointer;
  }
`;

class Photos extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      productId: null,
      primaryPhotoUrl: null,
      productPhotosUrls: [],
      productInfo: {},
      zoomModalCoordinates: {x: 0, y: 0},
      zoom: false,
      modal: false
    };
    this.setPrimary = this.setPrimary.bind(this);
    this.setCoordinates = this.setCoordinates.bind(this);
    this.toggleZoom = this.toggleZoom.bind(this);
  }

  setPrimary(e) {
    let selectedThumbnail = e.target;
    let selectedThumbnailPhotoUrl = e.target.src;

    this.setState({
      primaryPhotoUrl: selectedThumbnailPhotoUrl,
    });
  }

  setCoordinates(e) {
    let xPos = e.nativeEvent.offsetX
    let ypos = e.nativeEvent.offsetY

    this.setState({
      zoomModalCoordinates: {x: xPos, y: ypos}
    });
  }

  toggleZoom() {
    this.setState({
      zoom: !this.state.zoom
    });
  }

  async componentDidMount() {
    let url = window.location.href;
    let productId = url.split('/')[3] || 1000;
    const productPhotos = await request.photos(productId);
    const productInfo = await request.productInfo(productId);
    this.setState({
      productId: productId,
      primaryPhotoUrl: productPhotos.primaryUrl,
      productPhotosUrls: productPhotos.productUrls,
      productInfo: productInfo
    });
    console.log(productInfo);
  }


  render () {

    const isHovering = this.state.zoom;
    let popover;
    if (isHovering) {
      popover = <ZoomPopover primaryPhotoUrl={this.state.primaryPhotoUrl} coordinates={this.state.zoomModalCoordinates}></ZoomPopover>
    } else {
      popover = null;
    }

  return (
    <div>
      <PhotosModal
        productId={this.state.productId}
        primaryPhotoUrl={this.state.primaryPhotoUrl}
        productInfo={this.state.productInfo}
        setPrimary={this.setPrimary}
        photos={this.state.productPhotosUrls}
      />
      <PhotosWrapper>
        <Thumbnails
          flexDirection={"column"}
          setPrimary={this.setPrimary}
          primaryPhotoUrl={this.state.primaryPhotoUrl}
          photos={this.state.productPhotosUrls}
        />
        <PrimaryPhotoWrapper>
          <PrimaryPhoto
            onMouseEnter={() => this.toggleZoom()}
            onMouseLeave={() => this.toggleZoom()}
            onMouseMove={(e) => this.setCoordinates(e)}
            style={{maxWidth: "100%", height: "auto"}} src={this.state.primaryPhotoUrl}>
          </PrimaryPhoto>
          {popover}
        </PrimaryPhotoWrapper>
      </PhotosWrapper>
    </div>
    );
  }
};

ReactDOM.render(<Photos />, document.getElementById('photos'));