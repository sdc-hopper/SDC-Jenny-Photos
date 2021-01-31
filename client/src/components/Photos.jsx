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

const selectedThumbnailStyle = {
  border: "1px solid #e77600",
  boxShadow: "0 0 3px 2px rgb(228 121 17 / 50%)"
};

const notSelectedThumbnailStyle = {
  border: "1px solid rgba(0, 0, 0, .4)",
  boxShadow: "none"
};

const Thumbnails = (props) => (
  <ThumbnailWrapper >
    {props.photos.map((photo, i) => (
      <Thumbnail
      style = { props.primaryPhotoUrl === photo ? selectedThumbnailStyle : notSelectedThumbnailStyle }
      id={i} onMouseEnter={(e) => props.setPrimary(e)} src={photo} key={i}>
      </Thumbnail>
    ))}
    </ThumbnailWrapper>
);

export default Thumbnails;