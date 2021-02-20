import React, { useState } from 'react';
import styled from 'styled-components';
import Thumbnails from './Photos.jsx';

const PhotosModalWrapper = styled.div`
  position: absolute;
  border-color: #D5D9D9;
  box-shadow: 0 0 14px 0 rgba(15,17,17,.5);
  background: white;
  width: 73%;
  height: auto;
  z-index: 1000;
  border-radius: 8px;

  @media (max-width: 1400px) {
    width: 98.5%;
    height: 95%;
  };
`;

const PhotosModalEl = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const PrimaryPhotoWrapper = styled.div`
  margin-bottom: 2.5em;
  height: auto;
`;

const PrimaryPhoto = styled.img`
  max-width: 100%;
  height: auto;
`;

const ProductInfoWrapper = styled.div`

`;
const ProductInfo = styled.div`

`;

const X = styled.span`
  font-family: "Amazon Ember", Arial, sans-serif;
  display: block;
  margin-left: 97%;
  margin-top: 1.5em;
  cursor: pointer;
`;


const PhotosModal = (props) => {
  let [openModal, setModal] = useState(false);
  return (
    <PhotosModalWrapper>
      <X>x</X>
      <PhotosModalEl>
        <PrimaryPhotoWrapper>
          <PrimaryPhoto
            src={props.primaryPhotoUrl}>
          </PrimaryPhoto>
        </PrimaryPhotoWrapper>
        <ProductInfoWrapper>
          <ProductInfo>{props.productInfo.name}</ProductInfo>
          <Thumbnails
            setPrimary={props.setPrimary}
            primaryPhotoUrl={props.primaryPhotoUrl}
            photos={props.photos}
          />
        </ProductInfoWrapper>
      </PhotosModalEl>
    </PhotosModalWrapper>
  )
};


export default PhotosModal;