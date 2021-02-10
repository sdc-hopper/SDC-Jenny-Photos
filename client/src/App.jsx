import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import Thumbnails from './components/Photos.jsx';
import ZoomPopover from './components/ZoomPopover.jsx';

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
      modalCordinates: {x: 0, y: 0},
      zoom: false
    };
    this.setPrimary = this.setPrimary.bind(this);
    this.setCordinates = this.setCordinates.bind(this);
    this.toggleZoom = this.toggleZoom.bind(this);
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

    this.setState({
      modalCordinates: {x: xPos, y: ypos}
    });
  }

  toggleZoom() {
    this.setState({
      zoom: !this.state.zoom
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

    const isHovering = this.state.zoom;
    let popover;
    if (isHovering) {
      popover = <ZoomPopover primaryPhotoUrl={this.state.primaryPhotoUrl} cordinates={this.state.modalCordinates}></ZoomPopover>
    } else {
      popover = null;
    }

  return (
    <div>
      <PhotosWrapper>
        <Thumbnails setPrimary={this.setPrimary} primaryPhotoUrl={this.state.primaryPhotoUrl} photos={this.state.productPhotosUrls}/>
        <PrimaryPhotoWrapper>
          <PrimaryPhoto
            onMouseEnter={() => this.toggleZoom()}
            onMouseLeave={() => this.toggleZoom()}
            onMouseMove={(e) => this.setCordinates(e)}
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