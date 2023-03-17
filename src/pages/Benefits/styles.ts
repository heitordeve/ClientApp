import styled from 'styled-components';
import cardBeneficios1 from '../../assets/cardBeneficios1.png';
import cardBeneficios2 from '../../assets/cardBeneficios2.png';
import { shade } from 'polished';

export const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;

flex-direction: column;

width: 100%;
height: 100%;


padding: 50px;
`;

export const ContainerModal = styled.div`
display: flex;
justify-content: center;
align-items: center;

flex-direction: column;

width: 100%;
height: 100%;


padding: 50px;
`;


export const ContentCardNull = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-bottom: 50px;
    padding: 10px 0;

    .infoOrders{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        text-align: center;

        margin: 10px 0;

        max-width: 60%;

        p {
        font-style: normal;

        font-weight: 700;
        font-size: 14px;
        line-height: 18px;

        color: #707070;
        }
    }
    p{
    font-style: normal;
    font-weight: 700;
    font-size: 14px;

    margin-bottom: 0;

    color: #707070;
    }

    hr{
      border: 0.531661px solid rgba(107, 101, 118, 0.2);
    border-radius: 10px;

    margin: 20px 0;

    width: 350px;
    }

    width: 100%;
`;


export const ContentContainer = styled.div`
display: flex;
min-width: 50vh;
min-height: 50vh;

flex-direction: column;

border-radius: 10px;

background: #FFF;

padding: 50px;


.link-card {
  border: 1.71824px solid #d1ced6;
  border-radius: 10px;
  background: #D1CED6;
  width: 100px;
  cursor: pointer;
}

.link-card:hover {
  color: #ffffff;
  background: ${shade(0.2, '#D1CED6')};
  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border: 1.71824px solid #d1ced600;

  a {
    text-decoration: none;
  }
}

`;


export const CardMenu = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: start;
  flex-direction: column;
  text-align: center;
  padding-top: 20px;

  strong {
    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: bold;
    font-size: 11px;

    color: #FFFFFF;
  }
`;

export const CardItem1 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;

  position: relative;
  margin: 5px 10px;

  padding-left: 40px;

  height: 230px;
  width: 400px;

  background-image: url(${cardBeneficios1});
  background-repeat: no-repeat;
  border-radius: 20px;

  p{
    margin: 0;
    padding: 0;
  }
  hr{
    width: 193px;
    margin-top: 0;

    border: 0.531661px solid #FFFFFF;
  }

  .kmNumber{
    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: bold;
    font-size: 36px;


    color: #B7B3FF;
  }

  .kimLometros{
    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: bold;
    font-size: 22px;

    color: #FFFFFF;
  }

  .expirationKm{
    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;

    color: #FFFFFF;
  }
`;

export const CardItem2 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;

  position: relative;
  margin: 5px 10px;

  padding-left: 40px;

  height: 230px;
  width: 400px;

  background-image: url(${cardBeneficios2});
  background-repeat: no-repeat;

  border-radius: 20px;

  cursor: pointer;

  p{
    margin: 0;
    padding: 0;
  }

  hr{
    width: 193px;
    margin-top: 0;

    border: 0.531661px solid #FFFFFF;
  }

  .kmBenefits{
    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: bold;
    font-size: 24px;


    color: #FFF;
  }

  .kmDescription{
    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;

    color: #FFFFFF;
  }

  .kmWarning{
    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;

    margin-top: 15px;

    text-transform: uppercase;

    color: #FFFFFF;
  }

  &:hover {
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.6);
  }

`;


export const CardItem3 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;

  position: relative;
  margin: 5px 10px;

  padding-left: 40px;

  height: 230px;
  width: 400px;

  background: #FFF;
  border-radius: 20px;

  box-shadow: 0 0 4px rgba(0, 0, 0, 0.6);

  h2{
    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: bold;
    font-size: 24px;
    text-align: center;

    color: #432184;
  }

  .titleNumCard{
    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    text-align: center;

    margin-bottom: 0;
    margin-top: 10px;

    color: #432184;
  }

  .numberCard{
    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    text-align: center;

    color: #707070;
  }


`;


