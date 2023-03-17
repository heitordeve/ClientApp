import styled from 'styled-components';

export const Card = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  justify-content: center;

  height: 100%;
  width: 100%;

  background: #ffffff;
  box-shadow: 2.04726px 1.63781px 1.63781px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
`;

export const ModalContainer = styled.div`
  display: flex;
  justify-content: start;
  align-items: start;
  flex-direction: column;

  > h3 {
    align-self: center;
  }

  .textCVV {
    align-self: start;

    font-family: Source Sans Pro;
    font-weight: bold;
    font-size: 14px;

    color: #672ed7;

    margin: 0;

    &: hover{
      text-decoration: underline;
      cursor: pointer;
    }
  }

  .labelText {
    align-self: start;

    font-family: Source Sans Pro;
    font-weight: bold;
    font-size: 14px;
    text-align: center;

    color: #707070;
  }

  @media screen and (max-width: 1000px){
    justify-content: center;
    align-items: center;
  }
`;
