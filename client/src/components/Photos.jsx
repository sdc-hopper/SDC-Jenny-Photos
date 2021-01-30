import styled from 'styled-components';

const ThumbnailWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Thumbnail = styled.img`
  width: 40px;
  height: auto;
  margin: 0px 20px 10px 0px;
  border: 1px solid rgba(0, 0, 0, .3);
  border-radius: 2px;
  border-color: ${props => props.selected? "#e77600 " : 'none'};
  box-shadow: ${props => props.selected? "0 0 3px 2px rgb(228 121 17 / 50%)" : 'none'};
  &:hover{
    border-color: #e77600;
  }
`;

const Thumbnails = (props) => (
  <ThumbnailWrapper>
    {props.photos.map((photo, i) => (
      <Thumbnail id={i} onMouseEnter={(e) => props.setPrimary(e)} src={photo} key={i}></Thumbnail>
    ))}
    </ThumbnailWrapper>
);

export default Thumbnails;