import styled from 'styled-components';

export const CardHr = styled.hr`
  border-top: #6b6576 solid 1px;
`;

export const CardSubtitle = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 1rem;
  color: #6b6576;
  text-align: center;
`;

export const ContentCard = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  width: 100%;

  .inputCellphone {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    width: 100%;
    & > *:nth-child(1) {
      height: 41px;
      margin-top: 10px;
      margin-right: 0;
      border-right: none;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      width: 30%;
    }
    & > *:nth-child(2) {
      margin-top: 10px;
      height: 41px;
      margin-left: 0;
      border-top-left-radius: 1px;
      border-bottom-left-radius: 1px;
      width: 70%;
    }
  }
    .inputOtherValue > div {
      max-width: 190px;
      height: 35px;
      margin: 5px 0;
    }
    .selectOperadoras {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
      margin-top: 5px;
    }
    .selectOperadoras{
      width: 100%;
      > div {
        height: 41px;
      }
    } 
    .borderText {
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: 50px;
      width: 90px;
      border: 2px solid #d1ced6;
      border-radius: 9px;
      background: #fff;
      h5 {
        display: flex;
        color: #672ed7;
        font-weight: bold;
        font-size: 18px;
      }
    }
    section {
      background: #fff;
      border-radius: 9px;
      width: 100%;
      min-height: 55px;
      display: flex;
      justify-content: center;
      border: 2px solid #d1ced6;
      color: #312e38;
      div > label {
        padding: 2px;
        color: #6b6576;
      }
      div > label > span {
        padding: 4px;
      }
      .textValues label {
        color: #6b6576;
      }
      .textValues span {
        font-size: 13px;
      }
    }
    .radioAlign {
      display: flex;
      justify-content: center;
      align-items: center;
      >div {
        display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      }
      >div > div{
        justify-content: center;
        align-items: center;
        padding-right: 3px;
      }
      >div > div> input{
        margin-bottom: 8px;
      }
    }

    h5 {
      color: #672ed7;
      font-weight: bold;
      font-size: 18px;
      margin: 0;
      padding: 5px;
    }
    .noHover {
      pointer-events: none;
      text-align: center;
      margin-bottom: 20px;
      border-color: #d1ced6;
      border-radius: 9px;
    }
`;
