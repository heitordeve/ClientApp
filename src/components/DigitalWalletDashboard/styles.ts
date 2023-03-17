import styled from 'styled-components';
import { shade } from 'polished';
import { Card } from 'reactstrap';
import bgCreditCard from '../../assets/bgCreditCard.png';
import { Link } from 'react-router-dom';

export const CreditCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 5px 5px;
  max-height: 400px;
  min-height: 200px;
  background-image: url(${bgCreditCard});
  background-repeat: no-repeat;
  background-size: 110% 110%;
  background-position-x: -10px;
  box-shadow: 2.04726px 1.63781px 1.63781px rgba(0, 0, 0, 0.25);
  border-radius: 20px;

  b{
    align-self: center;
    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    text-transform: uppercase;
    color: #FFFFFF;
  }
`;

export const CardHr = styled.hr`
  &.white-hr {
    border-top: #FFFFFF solid 1px;
  }

  &:not(.white-hr) {
    border-top: #C4C4C4 solid 1px;
  }
`;

export const CardSubTitle = styled.div`
  width: 33%;
  display: flex;

  b {
    color: #672ed7;
  }

  p {
    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    color: #727387;
  }
`;

export const DashboardCard = styled(Card)`
  box-shadow: 2.04726px 1.63781px 1.63781px rgba(0, 0, 0, 0.25);
`;

export const ExtractCard = styled.div`
  display: block;
  align-items: center;
  position: relative;
  justify-content: center;
  margin: 5px 0px;
  max-height: 300px;
  min-height: 150px;
  background: #fff;
  box-shadow: 2.04726px 1.63781px 1.63781px rgba(0, 0, 0, 0.25);
  border-radius: 5px;

  .titleCard{
    display: flex;
    justify-content: center;
    align-items: center;
    color: #FFFFFF;
    font-weight: bold;
    text-align: center;
    font-family: 'Source Sans Pro',sans-serif;
    font-size: 16px;
    width: 100%;
    height: 46px;
    background: #15CDF9;
    box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.25);
    border-radius: 5px 5px 0px 0px;
  }

  .contentCard{
    padding: 10px 20px;
    overflow: auto;
  }
`;

export const CardGroupButtons = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  flex-direction: row;

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
  }

  a:hover {
    color: #ffffff;
    text-decoration: none;

    menu:hover {
      border: none;
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
  padding-top: 10px;

  strong {
    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: bold;
    color: #FFFFFF;
  }
`;

export const CardDinheiroPendente = styled.div`

  h5 {
    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: 300;
    font-size: 24px;
    color: #707070;
  }

  b {
    color: rgb(247, 108, 57)
  }

  p {
    color: #D1CED6;
  }
`;

export const CardLabel = styled.label`
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  flex-basis: 1 1 0;
`;

export const CardSmallLabel = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 1rem;
  color: #6b6576;
  text-align: center;
`;

export const CardOptions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: stretch;
  align-content: center;
  & > * {
    margin: 0 5px;
  }
`;

export const CardBox = styled.div`
  border: 2px solid rgba(0, 0, 0, .2);
  border-radius: 10px;
  padding: 10px;
  margin: 5px 0;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  height: fit-content !important;

  & > * {
    margin: 0 0 0 5px;
  }

  & > svg {
    color: #672ED7;
  }
`;

export const CardTitle = styled.div`
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

export const Linha = styled.div`
  height: 60px;
  border-left: 2px solid;
  color: #c4c4c4;
  float: right;
  margin: 0 10px;
  right: 50%;
  position: absolute;
`;

export const HighlightLink = styled(Link)`
  color: #672ED7;

  :hover {
    color: #672ED7;
  }
`;

export const HighlightText = styled.b`
  color: #672ED7;
  white-space: nowrap;
`;

export const ReturnHoder = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;

  &.alert {
    color: #15CDF9;
  }

  &:not(.alert) {
    color: #672ED7;
  }

  display: flex;
  justify-content: left;
  align-content: center;

  & > * {
    cursor: pointer;
  }
`;
