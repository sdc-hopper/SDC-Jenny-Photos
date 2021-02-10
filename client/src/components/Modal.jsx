import React from 'react';
import styled from 'styled-components';

const ModalWrapper = styled.div`
  width: 27%;
  height: 45em;
  margin-left: 0.7em;
  border: 1px solid black;
  position: absolute;
  display: inline;
  z-index: 1001;
  background-repeat: no-repeat;
  background-size: 1400px 1400px;
  /* width:350px;
	height:500px; */
`;

const ModalImage = styled.img`

`;


const Modal = (props) => {


  return <ModalWrapper style={{backgroundImage: `url(${props.primaryPhotoUrl})`, backgroundPosition: `${(-props.cordinates.x * 2)}px ${(-props.cordinates.y * 1.5)}px`}}>
    {/* <ModalImage src={props.primaryPhotoUrl}></ModalImage>
     */}
     <h2>{`${props.cordinates.x}, ${props.cordinates.y}`}</h2>
  </ModalWrapper>

};

export default Modal;