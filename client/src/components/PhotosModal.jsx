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

  -webkit-animation: fadein 0.5s;
  -moz-animation: fadein 0.5s;
  -ms-animation: fadein 0.5s;
  -o-animation: fadein 0.5s;
  animation: fadein 0.5s;


  @keyframes fadein {
      from { opacity: 0; }
      to   { opacity: 1; }
  }

  @-moz-keyframes fadein {
      from { opacity: 0; }
      to   { opacity: 1; }
  }

  @-webkit-keyframes fadein {
      from { opacity: 0; }
      to   { opacity: 1; }
  }
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
  @media (max-width: 1400px) {
    max-width: 90%;
  };
`;

const ProductInfoWrapper = styled.div`
  padding-top: 5%;
  align-self: flex-start;
`;
const ProductInfo = styled.div`
`;

const ProductTitle = styled.span`
  display: block;
  font-family: verdana,arial,helvetica,sans-serif;
  font-size: 17px;
  margin-bottom: 2em;
`;

const ProductColorAndConfiguration = styled.span`
  display: block;
  font-family: verdana,arial,helvetica,sans-serif;
  font-size: 12px;
  color: #767676;
  margin-bottom: 1.5em;
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
      <X onClick={() => props.toggleModal()}>x</X>
      <PhotosModalEl>
        <PrimaryPhotoWrapper>
          <PrimaryPhoto
            src={props.primaryPhotoUrl}>
          </PrimaryPhoto>
        </PrimaryPhotoWrapper>
        <ProductInfoWrapper>
          <ProductInfo>
            <ProductTitle>{props.productInfo.name}</ProductTitle>
            <ProductColorAndConfiguration>Color: {props.productInfo.color}</ProductColorAndConfiguration>
            <ProductColorAndConfiguration>Configuration: {props.productInfo.configuration}</ProductColorAndConfiguration>
          </ProductInfo>
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