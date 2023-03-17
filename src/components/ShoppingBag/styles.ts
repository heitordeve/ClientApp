import styled from 'styled-components';
import { FiX } from 'react-icons/fi';
import { Form } from '@unform/web';
import { Link } from 'react-router-dom';
import { danger } from 'styles/consts';

export const ShoppingBagCounterHolder = styled.span`
  position: absolute;
  right: 0;
  top: -15px;

  font-size: 15px;
  font-weight: bold;
  text-align: center;

  color: #ffffff;
  background: #ff5f00;

  border-radius: 50%;
  margin: 5px;
  width: 22px;
  height: 22px;
`;

export const CloseButton = styled(FiX)`
  margin-right: -30px;
  cursor: pointer;
  color: #ffffff;

  @media screen and (max-width: 1000px) {
    position: absolute;
    margin-right: 0px;
    right: 0px;
  }
`;

export const OpenButton = styled.span`
  color: #672ed7;
  cursor: pointer;
  position: relative;
`;

export const Container = styled(Form)`
  display: flex;
  flex-wrap: wrap;
  color: #6b6576;

  .highlight {
    font-weight: bold;
    color: #672ed7;
  }

  .highlight-secondary {
    font-weight: bold;
    color: #15cdf9;
  }

  p,
  label {
    margin: 0;
  }

  & > * {
    margin: 5px;
    width: max-content;
    max-height: 100vh;
  }

  & > *:nth-child(1) {
    min-width: 50vw;
    flex-basis: 2 2 0;
  }

  & > *:nth-child(2) {
    min-width: 25vw;
    flex-basis: 1 1 0;
  }

  @media screen and (max-width: 1000px) {
    & > * {
      margin: 0;
      height: max-content;
      width: 100vw;
    }
  }
`;

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ScrollBox = styled.div`
  overflow-y: auto;
  padding-right: 5px;
  max-height: 50vh;

  ::-webkit-scrollbar {
    width: 6px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

export const InnerParagraph = styled.p`
  margin: 0;
  line-height: 1.2;
  &.justify{
    text-align: justify;
  }
`;

export const InnerTiltle = styled.h2`
  margin: 0;
  font-weight: bold;
  font-size: 18px;
  white-space: nowrap;

  .cardDescription {
    > img {
      max-width: 55px;
    }
  }

  @media screen and (max-width: 1000px) {
    text-align: center;
    white-space: normal;
  }
`;

export const InnerTiltleLink = styled(Link)`
  margin: 0;
  font-weight: bold;
  font-size: 18px;
  white-space: nowrap;

  :hover {
    text-decoration: none;
  }
`;

export const InnerSmallLabel = styled.label`
  font-size: 14px;
  @media screen and (max-width: 1000px) {
    max-width: 33vw;
  }
`;

export const InnerHr = styled.hr`
  border-top: 1px solid rgba(0, 0, 0, 0.125);
`;

export const CardBox = styled.div`
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 10px;
  margin: 5px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: fit-content !important;
  background-color: ${props =>
    props.theme.disabled ? 'rgba(0, 0, 0, .2)' : 'inherit'};

  & > *:not(:last-child) {
    margin-right: 10px;
  }

  @media screen and (max-width: 1000px) {
    flex-wrap: wrap;
    &.responsive {
      justify-content: center;
    }
  }
`;

export const InnerThumbnail = styled.div`
  background-color: ${props => props.color};
  display: flex;
  justify-content: center;
  align-items: center;
  width: 68px;
  height: 68px;
  position: relative;
  color: #ffffff;
  border-radius: 8.4px;

  & > * {
    max-width: 110%;
  }
`;

export const InnerIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;

  padding: 5px;

  & > svg,
  img {
    width: 30px;
    height: 30px;
    color: #6b6576;
    border-radius: 20%;
  }
`;

export const ProductLabel = styled.div`
  display: flex;
  flex-direction: column;
  align-self: flex-end;

  & > *:nth-child(3) {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  & > * {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 20vw;

    @media screen and (max-width: 1000px) {
    max-width: 80vw;
  }
  }
`;

export const ProductAction = styled.button`
  background-color: transparent;
  border: none;
  display: flex;
  text-decoration: none;
  align-items: center;
  font-size: 12px;
  color: ${danger};
  cursor: pointer;
`;

export const CardBoxTail = styled.div`
  margin-left: auto;
  display: flex;
  flex-direction: column;
  justify-content: right;
  align-content: center;
  text-align: right;

  &.responsive {
    @media screen and (max-width: 1000px) {
      margin-left: 0px !important;
    }
  }
`;

export const PaymentHeader = styled.div`
  display: flex;
  align-items: center;
`;

export const ReturnIconHolder = styled.span`
  color: #672ed7;
  :hover {
    cursor: pointer;
  }
  & > * {
    font-size: 2rem;
  }
`;

export const SucessBody = styled.div`
  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  & > * {
    margin: 0.1rem auto;
  }

  .highlight {
    font-weight: bold;
    color: #15cdf9 !important;
  }

  .textInformation {
    font-size: 16px;
    margin-top: 10px;
  }

  @media screen and (max-width: 1000px) {
    flex-wrap: wrap;
    width: 90vmin;
    margin: auto;
  }
`;

export const SuccessImg = styled.img`
  max-width: 180px;
  &.small-img {
    max-width: 80px;
  }
`;

export const QrCode = styled.img`
  max-width: 250px;
  border-radius: 10px;
`;

export const Linha = styled.div`
  height: 130px;
  border-left: 2px solid;
  color: #c4c4c4;
  float: right;
  margin: 0 5px;

  @media screen and (max-width: 1000px) {
    display: none;
  }
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
`;

export const ResumeCardBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: start;

  border: 2px solid #ffffff;
  border-radius: 10px;
  padding: 10px;
  margin: 5px 0;
  width: 515px;
  overflow: auto;

  .detailsOrder {
    padding: 5px;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  @media screen and (max-width: 1000px) {
    width: 100%;
    justify-content: left !important;
    flex-wrap: wrap;
  }
`;


