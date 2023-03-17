import styled from 'styled-components';
import bgCreditCard from '../../../assets/bgCreditCard.png';

export const CardHr = styled.hr`
  border-top: #C4C4C4 solid 1px;
`;

export const LeftCard = styled.div`
width: 360px;
  align-items: center;
  position: relative;
  justify-content: center;
  text-align: center;
  background: #fff;
  border-radius: 5px;

  > div {
    padding: 10px;
  }

  h4 {
    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    text-align: center;
    color: #672ED7;
    margin: 30px 0 60px 0;
  }

  .titleCard {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #672ED7;
    font-weight: bold;
    text-align: center;
    font-family: 'Source Sans Pro', sans-serif;
    font-size: 24px;
    width: 100%;
    height: 60px;
    margin-bottom: 10px;
    box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.25);
  }

  .textBetween {
    justify-content: space-between;
    width: 100%;
    margin: 0;
    padding: 0 70px;
    margin-top: 25px;
  }

  .textSaldo{
    h6 {
      font-family: Source Sans Pro;
      font-style: normal;
      font-weight: bold;
      font-size: 14px;
      text-align: center;
      color: #A5A1AD;
    }

   b {
    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    text-align: center;
    color: #707070;
   }
  }

  .buttonsCard{
    margin-top: 130px;
  }
`;

export const CreditCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  position: relative;
  margin: 5px 5px;
  padding: 10px;
  max-height: 400px;
  min-height: 200px;
  background-image: url(${bgCreditCard});
  background-repeat: no-repeat;
  background-size: 110% 110%;
  background-position-x: -10px;
  box-shadow: 2.04726px 1.63781px 1.63781px rgba(0, 0, 0, 0.25);
  border-radius: 20px;

  .nameCard{
    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: bold;
    font-size: 19.6501px;

    color: #FFFFFF;
  }

  .numberCard {
    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: 600;
    font-size: 25.2644px;

    color: #FFFFFF;
  }

  .secondCard {
    display: flex;
    flex-direction: column;

    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: 600;
    font-size: 16.843px;


    color: #FFFFFF;
  }
`;

export const TitleCard = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;

  h6 {
    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    color: #919191;
    margin: 0 !important;
    padding: 0;
  }

  p{
    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    color: #919191;

    margin: 0 !important;
    padding: 0;
  }
`;
