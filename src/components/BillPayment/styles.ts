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
  text-align: center;


  .textBill > div {
    height: 150px;
    max-width: 100%;
    flex-wrap: wrap;
    margin-top:10px;
  }

  .inputBill > div {
    height: 41px;
    padding: 0 auto;
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

  .contentInfoBill{
    text-align: left;
    overflow: auto;
    max-height: 357px;

    ::-webkit-scrollbar {
      width: 3px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
      background: #888;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  }

  .textInfoBill{
    margin-bottom: 8px;

    p {
      font-style: normal;
      font-weight: bold;
      font-size: 13px;

      text-transform: capitalize;

      color: #707070;

      padding: 0;
      margin: 0;
    }
  }
`;
