import styled from 'styled-components';

export const DashboardHolder = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items:center;
`;

export const DashboardHeader = styled.h1`
  font-style: normal;
  font-weight: bold;
  font-size: 32px;
  line-height: 94.5%;

  text-align: center;
  width: 100%;
  margin: 30px 0;

  color: #672ed7;
`;

export const ContentCard = styled.div`
display: flex;
justify-content: center;
align-items:center;


  .inputCellphone {
    display: flex;
    flex-direction: row;
  }

  .inputDDD > div {
    max-width: 56px;
    height: 35px;
    margin-right: 0;
    border-right: none;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .inputCell > div {
    max-width: 132px;
    height: 35px;
    margin-left: 0;
    border-top-left-radius: 1px;
    border-bottom-left-radius: 1px;
  }

  .inputOtherValue > div {
    max-width: 190px;
    height: 35px;
    margin: 5px 0;
  }

  section {
    background: #fff;
    border-radius: 9px;
    width: 100%;
    height: 55px;

    border: 2px solid #d1ced6;
    color: #312e38;
  }
`;

export const CardsHolder = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  & > .card {
    margin: 5px;
    width: 330px;
    & > .card-footer {
      height: 120px;
    }
  }
`;

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

export const TitleTerms = styled.p`
  font-style: normal;
  font-weight: bold;
  font-size: 25px;
  color: #672ED7;
  text-align: center;
`;

export const TitleAcceptTerms = styled.p`
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  color: #6B6576;
  text-align: center;
`;

export const DescriptionTerms = styled.p`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  color: #6B6576;
  text-align: left;
  align-self: start;
  padding: 0 25px 0 25px;
`;

export const LinkTerms = styled.p`
  color: ##6B6576;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  color: #672ED7;
  text-align: center;

  margin: 0 0 0 2px;
  b {
    color: #672ED7;
    cursor: pointer;
  }
  b:hover{
    cursor: pointer;
    text-decoration: underline;
    color: #672ED7;
  }
`;

export const ExtratoCardHolder = styled.div`
  display: grid;
  grid-auto-flow: column;
  font-size: 0.6rem;
  grid-template-columns: auto 1fr auto;
  & > svg {
    margin-right: 5px;
  }
  & > div > * {
    display: block;
  }
  & > div:nth-child(3) {
    margin-left: 5px;
    text-align: right;
  }
`;
