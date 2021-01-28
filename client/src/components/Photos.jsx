import React from 'react';

const Photos = (props) => (
  <div>
  {props.photos.map((photo, i) => (
    <img src={photo} key={i}></img>
  ))}
  </div>
);

export default Photos;