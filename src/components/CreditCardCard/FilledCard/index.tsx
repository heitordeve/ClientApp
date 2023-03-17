import React from 'react';
import { Card  } from './styles';

import { CreditCardData } from '../../../hooks/creditCard';

const FilledCard: React.FC<CreditCardData> = (props) => {

  return (
    <Card className="cardCredit">
      <span className="titleCard">{props.NomeCartaoCredito}</span>
      <span className="numCard">**** **** **** {props.UltimosDigitos}</span>
      <div className="vencCardCtn text-left">
        <p className="vencCard">Data de Vencimento</p>
        <p className="dataVencCard text-center">{props.MesCartaoCredito} / {props.AnoCartaoCredito}</p>
      </div>
    </Card>
  )
}


export default FilledCard;
