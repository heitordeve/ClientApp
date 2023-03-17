import React, { useCallback, useEffect, useState } from 'react';

import Modal from 'react-modal';

import EmptyCard from './EmptyCard';
import FilledCard from './FilledCard';
import DeleteCard from './DeleteCard';
import { CardItem, DeleteButton } from './styles';
import { RiDeleteBin2Line } from 'react-icons/ri';

import EloLogo from '../../assets/elo.svg';
import HiperCardLogo from '../../assets/hipercard.png';
import MaestroLogo from '../../assets/maestro.svg';
import MasterCardLogo from '../../assets/mastercard.svg';
import VisaLogo from '../../assets/visa.svg';

import { CreditCardData } from '../../hooks/creditCard';

Modal.setAppElement('#root');

export enum CreditCardState {
  Empty,
  Filled,
  Delete
}

export interface CreditCardProps {
  state: CreditCardState;
  card?: CreditCardData;
}

export const getBrandLogo = (brand: string) => {
  switch (brand) {
    case 'visa':
      return <img src={VisaLogo} alt="Visa Logo" />
    case 'mastercard':
      return <img src={MasterCardLogo} alt="MasterCard Logo" />
    case 'mc':
      return <img src={MasterCardLogo} alt="MasterCard Logo" />
    case 'elo':
      return <img src={EloLogo} alt="Elo Logo" />
    case 'hipercard':
      return <img src={HiperCardLogo} alt="HiperCard Logo" />
    case 'maestro':
      return <img src={MaestroLogo} alt="Maestro Logo" />
    default:
      return null
  }
}

const CreditCardCard: React.FC<CreditCardProps> = (props) => {
  const [cardState, setCardState] = useState<CreditCardState>(CreditCardState.Empty);

  useEffect(() => {
    setCardState(props.state);
  }, [props]);

  const openDelete = useCallback(() => {
    setCardState(CreditCardState.Delete);
  }, []);

  const openFilled = useCallback(() => {
    setCardState(CreditCardState.Filled);
  }, []);

  const renderCard = useCallback(() => {
    let result: React.ReactNode = <></>;
    switch (+cardState) {
      case CreditCardState.Empty:
        result = <EmptyCard {...props.card} />;
        break;
      case CreditCardState.Filled:
        result = <FilledCard {...props.card} />;
        break;
      case CreditCardState.Delete:
        result = <DeleteCard creditCardData={props.card} onClose={openFilled} />;
        break;
    }
    return result;
  }, [props, cardState, openFilled]);

  return (
    <CardItem >
      {renderCard()}
      {cardState === CreditCardState.Filled &&
        <DeleteButton className="btnRecharge mt-3 font-weight-bold secondary-colors" onClick={openDelete}>
          <RiDeleteBin2Line size={25} onClick={() => { }} /> Excluir
        </DeleteButton>
      }
    </CardItem >
  );
};

export default CreditCardCard;
