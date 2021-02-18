import React from 'react';
import styled from 'styled-components';

const PhotosModalWrapper = styled.div`
  position: absolute;
  border-color: #D5D9D9;
  box-shadow: 0 0 14px 0 rgba(15,17,17,.5);
  background: white;
  width: 73%;
  height: 90%;
  z-index: 1000;
  border-radius: 8px;

  @media (max-width: 1400px) {
    width: 98.5%;
    height: 95%;
  }
`;

const PrimaryPhoto = styled.img`
  margin: 0;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  max-width: 100%;
  height: auto;
  padding-left: 10%;
  &:hover {
    cursor: pointer;
  }
`;

const X = styled.span`
  font-family: "Amazon Ember", Arial, sans-serif;
  display: block;
  margin-left: 97%;
  margin-top: 1.5em;
  cursor: pointer;
`;

const PhotosModal = (props) => (
  <PhotosModalWrapper>
    <X>x</X>
    <PrimaryPhoto src={props.primaryPhotoUrl}></PrimaryPhoto>
  </PhotosModalWrapper>
);


export default PhotosModal;