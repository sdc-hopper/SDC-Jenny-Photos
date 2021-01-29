import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
`;

const ThumbnailWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Thumbnail = styled.img`
  width: 40px;
  height: auto;
  margin: 0px 20px 10px 0px;

  border: 1px solid rgba(0, 0, 0, .3);
  border-radius: 3px;
`;

// export default H1;
export {
  Thumbnail,
  ThumbnailWrapper,
  Wrapper
}