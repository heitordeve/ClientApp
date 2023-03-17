import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0 10px;
  justify-content: center;
  align-items: center;
  max-width: 720px;
  margin: 50px auto;
`;

export const CardLogoAnchor = styled.a`
  width: 210px;
  height: 110px;
  border-radius: 10px;
  display: flex;
  margin: 10px;
  align-items: center;
  justify-content: center;
  background-color: none;
  border: 1px solid #d1ced6;

  &:hover {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    background-color: #fff;
    border: none;
    cursor: pointer;
  }

  &:not(:hover) {
    -webkit-filter: grayscale(100%);
    filter: grayscale(100%);
  }
`;

export const CardLogoImage = styled.img`
  max-height: 80%;
  max-width: 80%;
`;

export const ModalLogoImage = styled.img`
  max-height: 30%;
  width: 30%;
  margin-bottom: 16px;
`;

export const ModalInside = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  overflow-y: auto;
`;

export const SobreHolder = styled.div`
  overflow-y: auto;
  max-height: 30vh;
  text-align: left;

  ::-webkit-scrollbar {
    width: 6px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

export const CardValueHolder = styled.p`
  font-size: 11px;
  margin-bottom: 0;
  padding-left: 3px;
`;

export const CardRadioHolder = styled.div`
  display: flex;
  align-items: center;
`;

export const RadioContainer = styled.div`
  & > div:first-child {
    border: 1px solid #D1CED6;
    border-radius: 10px;
    justify-content: space-around;
    padding: 20px;
  }
`;
