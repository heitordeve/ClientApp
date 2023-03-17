import styled from 'styled-components';

export const Container = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  overflow: hidden;
  z-index:10000;

  @media screen and (max-width: 1000px) {
    left: 0;
    right: 0;
  }
`;
