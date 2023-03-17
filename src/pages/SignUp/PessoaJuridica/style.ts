import styled from 'styled-components';
import { backgroundPrimary, gray6 } from 'styles/consts';

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  background: #ffffff;
`;

export const Background = styled.div`
  width: 50%;
  display: flex;
`;

export const ImageContainer = styled.img`
  height: 100%;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 20px;
  padding-left: 90px;
  > p {
    font-size: 1.25em;
    color: ${gray6};
    font-weight: 700;
    text-align: center;
  }
`;

export const FormContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  span {
    display: flex;
    min-width: 280px;
    color: ${gray6};
  }

  @media screen and (max-width: 800px) {
    #acceptTerms {
      flex-wrap: nowrap;
      flex-direction: row;

      p {
        width: 80%;
      }
    }
  }
`;

export const FormRow = styled.div`
  display: flex;
  min-width: 300px;
  padding-bottom: 5px;

  .inputMargin {
    margin: 0 10px;
  }

  .listPassword {
    margin-left: 20%;
    font-weight: bold;
    font-size: 12px;
    color: #909090;
  }

  .numberCellphone {
    display: flex;
    flex-direction: row;
    div {
      max-width: 152px;
    }
  }

  .inputCell {
    padding-left: 0;
    margin-left: 0;
    border-left: none;

    > div > div {
      border-top-left-radius: 1px;
      border-bottom-left-radius: 1px;
    }
  }

  .inputDDD {
    padding-right: 0;
    margin-right: 0;

    > div > div {
      max-width: 63px;
      border-right: none;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  .selectUF {
    min-width: 211px;
  }

  p {
    font-weight: normal;
    font-size: 12px;
    flex-direction: column;
    text-align: center;

    color: #909090;
  }

  button {
    width: 300px;
    font-weight: bold;
  }
  p > b {
    text-decoration: underline;
    font-weight: normal;
    color: ${backgroundPrimary};
  }
  p > b:hover {
    cursor: pointer;
    text-decoration: underline;
  }

  @media screen and (max-width: 800px) {
    flex-wrap: wrap;
    min-width: auto;
    width: 100%;
    button {
      width: 100%;
      font-weight: bold;
    }
    .numberCellphone {
      div {
        max-width: 100%;
      }
    }
    .inputCell {
      width: 100%;
    }
    #acceptTerms {
      flex-wrap: nowrap !important;
      flex-direction: row;
      color: black;
    }
  }

  & > * {
    width: 100%;
    margin: 0 2.5px;
  }
`;
