import styled from 'styled-components';


export const ExtratoCardHolder = styled.div`
  border: 1px solid #D1CED6;
  border-radius: 5px;
  padding: 5px 5px 0 5px;
  margin-bottom: 5px;
  display: grid;
  grid-auto-flow: column;
  font-size: 0.9rem;
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

  & > *:nth-child(2){
    & > *:nth-child(1){
      color: #6B6576;

      margin-bottom: 0;
    }
    & > *:nth-child(2){
      color: #727387;

      margin-bottom: 0;
    }
  }
  & > *:nth-child(3){
    & > *:nth-child(1){
      color: #6B6576;

      font-size: 0.8rem;
      margin-bottom: 0;
    }
  }
`;
