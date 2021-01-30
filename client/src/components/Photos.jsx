import React from 'react';
import styled from 'styled-components';

const ThumbnailWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Thumbnail = styled.img`
  width: 40px;
  height: auto;
  margin: 0px 20px 10px 0px;
  border-radius: 2px;
`;

const Thumbnails = (props) => (
  <ThumbnailWrapper >
    {props.photos.map((photo, i) => (
      <Thumbnail id={i} onMouseEnter={(e) => props.setPrimary(e)} src={photo} key={i}></Thumbnail>
    ))}
    </ThumbnailWrapper>
);

export default Thumbnails;