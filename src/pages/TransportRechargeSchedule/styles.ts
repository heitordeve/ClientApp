import styled from 'styled-components';

//#region Card Style
import { TiPlus } from 'react-icons/ti';
import { MdCreditCard } from 'react-icons/md';
import { Form } from '@unform/web';

export const ButtonsContainer = styled.div`
    display: flex;
    justify-content: space-between;
  `;

export const EmptyContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    width: calc(100% + 2.5rem);
    height: calc(100% + 2.5rem);

    margin: -1.25rem; 

    background: #E7E5E5;

    cursor: pointer;
  `;

export const EmptyPlusIcon = styled(TiPlus)`
    font-size: 80px;
    color: #FFF;
  `;

export const ScheduleCardForm = styled(Form)`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    & > * {
      flex-grow: 1;
      margin: 0 5px;
    }

    & > *:first-child {
      width: 100%;
    }
  `;

export const DropdownButton = styled.button`
    border: 0;
    text-decoration: none;
    outline: none;
    background: none;

    &:focus {
      border: none;
      outline: none;
    }
  `;

export const ViewContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: start;
    height: 100%;
  `;

export const CreditCardContainer = styled.div`
    display: flex;
    flex-direction: column;
    border: solid 1px rgba(0, 0, 0, 0.125);
    border-radius: 0.25rem;
    padding: 10px;
    width: 50%;
  `;

export const CreditCardIcon = styled(MdCreditCard)`
    font-size: 2rem;
    color: #672ED7;
  `;

export const AboutContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
    width: 50%;
    height: max-content;
    text-align: center;
  `;

export const AlertContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;

    & > svg {
      font-size: 5rem;
    }
  `;

export const AlertHolder = styled.div`
    height: 3rem;
  `;

export const InnerHeaderOne = styled.h1`
    font-weight: bold;
    font-size: 1.25rem;
    color: #707070;

    margin: 5px;

    display: flex;
    align-items: center;
  `;

export const InnerHeaderTwo = styled.h2`
    font-weight: 600;
    font-size: 1rem;
    color: #6B6576;

    margin: 0;

    display: flex;
    align-items: center;
  `;

export const InnerLabel = styled.label`
    color: #919191;
    font-weight: lighter;
  `;

export const InnerParagraph = styled.p`
    margin: 5px 0 0 10px;
  `

//#endregion

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 25px 25px 0 25px;
`;

export const ShedulesHolder = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: stretch;

  width: 100%;
  padding: 0 10vw;
  min-height: 300px;

  & > * {
      bottom: 10px;
      margin: 10px;
  }

  @media only screen and (max-width: 1000px) {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 0;

    & > * {
      width: 100%;
    }

    .card{
      height: fit-content;
    }
  }

  @media only screen and (min-width: 1100px) {
    & > * {
      width: 700px;
    }
  }
`;

export const RouterHeader = styled.div`
  margin-top: 25px;
  margin-bottom: 25px;
`;

export const InputLabel = styled.label`
  color: #727387;
  font-weight: lighter;
  margin-bottom: 1rem;
`;
