import React from 'react';
import ReactDOM from 'react-dom';
import Thumbnails from './components/Photos.jsx';
import { Wrapper } from './styles.js';

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

    if (this.state.previousThumbnailId) {
      document.getElementById(this.state.previousThumbnailId).setAttribute("style", "border-color: none");
      document.getElementById(this.state.previousThumbnailId).setAttribute("style", "box-shadow: none");
    }

    selectedThumbnail.setAttribute("style", "box-shadow: 0 0 3px 2px rgb(228 121 17 / 50%);");

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

      document.getElementById("0").setAttribute("style", "box-shadow: 0 0 3px 2px rgb(228 121 17 / 50%)");
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