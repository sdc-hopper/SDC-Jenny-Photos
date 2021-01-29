import React from 'react';
import { Thumbnail, ThumbnailWrapper } from '../style.js';



const Photos = (props) => (
  <ThumbnailWrapper>
  {props.photos.map((photo, i) => (
    <Thumbnail onMouseEnter={(e) => props.setPrimary(e)} src={photo} key={i}></Thumbnail>
  ))}
  </ThumbnailWrapper>
);

export default Photos;