import styled from 'styled-components';
import { Card, CardHeader, CardBody, CardFooter } from 'reactstrap';
import { AiOutlineClose, AiOutlineQuestionCircle } from 'react-icons/ai';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { cssIf } from 'styles';

export const FunctionalityOptionsHolder = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  margin: 12px 10px 0 0;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const FunctionalityQuestionButton = styled(AiOutlineQuestionCircle)`
  font-size: 20px;

  &:hover {
    cursor: pointer;
  }
`;

export const FunctionalityCancelButton = styled(AiOutlineClose)`
  font-size: 25px;

  display: flex;
  justify-content: center;
  align-items: center;

  &:hover{
    cursor: pointer;
  }

`;

export const FunctionalityOptionsButton = styled(BsThreeDotsVertical)`
  font-size: 20px;

  &:hover {
    cursor: pointer;
  }
`;

export const FunctionalityHeader = styled(CardHeader)`
  color: #FFFFFF;
  font-weight: bold;
  text-align: center;

  position: relative;
`;

export const FunctionalityBody = styled(CardBody)`
  background-color: transparent;
  overflow-y: auto;

  & > * {
    opacity: 1;
    transition: opacity 0.5s linear;
  }
`;

export const FunctionalityFooter = styled(CardFooter)`
  height: 120px;
  text-align: center;
  background-color: transparent;
`;

export const ProgressBarHolder = styled.div`
  width: 100%;
  text-align: center;
`;

export const CardHr = styled.hr`
  border-top: #6B6576 solid 1px;
`;

export const LabeledCardHrHolder = styled.div`
  display: flex;
  justify-content: space-between;
  color: #6B6576;
  & > * {
    margin: auto 0;
  }
  & > hr {
    flex-grow: 1;
  }
  & > *:not(hr) {
    padding: 0 5px;
  }
`;

export const CardSubtitle = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 1rem;
  color: #6B6576;
  text-align: center;
`;
interface FunctionalityCardHolderProps {
  minHeight: string
}


export const FunctionalityCardHolder = styled(Card) <FunctionalityCardHolderProps>`
  border: none;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.1);

  background-size: 100% 200%;
  background-image: linear-gradient(to bottom, white 50%, #672ED7 50%) !important;
  transition: background-position 0.5s;

  ${({ minHeight }) => cssIf('min-height', minHeight)}

  & > *:not(.card-header) {
    background-color: transparent !important;
  }

  &.dashbord-alert {
    background-position: 0 -100%;
  }
`;

export const CardsHolder = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  & > .card {
    margin: 5px;
    width: 230px;
    & > .card-footer {
        height: 120px;
    }
  }
`;
