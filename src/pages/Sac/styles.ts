import styled from 'styled-components';

export const Container = styled.div`
  width: 600px;
  margin: 30px auto;
  padding: 20px;
  border-radius: 10px;
  background-color: #fff;
  display: flex;
  justify-content: center;

  iframe {
    width: 90%;
    min-height: 690px;
    border: none;
  }

  @media screen and (max-width: 1000px){
    width: 100%;
    height: 150vh;

    iframe {
      min-height: 0;
      border: none;
    }
  }
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  margin-bottom: 20px;
`;

export const HeaderLinkHolder = styled.div`
  margin-bottom: 5px;
`;