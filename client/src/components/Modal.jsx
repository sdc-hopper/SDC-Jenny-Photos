import React from 'react';
import styled from 'styled-components';

const ModalWrapper = styled.div`
  /* width: 55%;
  height: 45em; */
  margin-left: 1em;
  border: 1px solid black;
  position: absolute;
  display: inline;
  z-index: 1001;
  background-repeat: no-repeat;
  width:350px;
	height:500px;
`;

const ModalImage = styled.img`

`;


const Modal = (props) => {


  return <ModalWrapper style={{backgroundImage: `url(${props.primaryPhotoUrl})`, backgroundPosition: `${props.cordinates.x}px ${props.cordinates.y}px`}}>
    {/* <ModalImage src={props.primaryPhotoUrl}></ModalImage>
     */}
     <h2>{`${props.cordinates.x}, ${props.cordinates.y}`}</h2>
  </ModalWrapper>

};

export default Modal;