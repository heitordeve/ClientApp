import styled from 'styled-components';

export const Card = styled.div`
  display: block;
  align-items: center;
  height: 100%;

  .vCreditCard1 {
    display: block;
    position: absolute;
    height: 100%;
    width: 70%;
  }
  .vCreditCard2 {
    display: block;
    position: absolute;
    height: 100%;
    left: 20%;
    width: 70%;
  }


  .titleCard{
    font-weight: bold;
    font-size: 24px;
    color: white;
    position: absolute;
    left: 20px;
    top: 60px;

  }

  .numCard{

    font-weight: 300;
    font-size: 30px;
    color: white;
    position: absolute;
    left: 20px;
    top: 90px;
  }

  .vencCardCtn{
    font-weight: 300;
    font-size: 24px;
    color: white;
    position: absolute;
    left: 20px;
    top: 150px;

  }

  .vencCard{
    font-size:16px;
    font-weight: 200;
  }

  .dataVencCard{

    font-size:20px;
    font-weight: 700;
  }

  }
  .btnRecharge {
    height: 40px;
    width: 250px;
    margin: auto;
    position: absolute;
    bottom: 10px;
    left: 20%;
  }

  img {
    display: block;
    position: absolute;
    width: 75px;
  }

  img {
    position: absolute;
    margin: 1px;
    left: 0;
    top: 0;
  }
`;

export const TextValues = styled.p`
    font-family: Roboto, Helvetica, Arial, sans-serif;
    font-weight: 400;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.54);
`;

export const Section = styled.div`
    background: #fff;
    border-radius: 9px;
    width: 100%;
    min-height: 55px;
    display: flex;
    justify-content: center;
    border: 2px solid #d1ced6;
    color: #312e38;
    padding-top: 5px;
    margin: 30px 0;
    > div{
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;

      > div {
      justify-content: center;
      align-items: center;
      margin-right: 6px;
      }
      label {
        margin:0;
      }
    }

`;

export const ButtonRecharge = styled.button`
  height: 40px;
  width: 250px;
  margin: 0 35px 0 35px;
`;
