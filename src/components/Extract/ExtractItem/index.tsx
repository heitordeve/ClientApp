import React from 'react';

import { RiMoneyDollarCircleLine } from 'react-icons/ri';

import Label from '../../ui/label';

import { ExtratoCardHolder } from './styles';

interface ExtratoCardProps {
  laberText: string;
  cartao: string;
  color: string;
  value: string;
}

const ExtractItem: React.FC<ExtratoCardProps> = ({ laberText, cartao, color, value }) => {
  return (
    <ExtratoCardHolder>
      <RiMoneyDollarCircleLine size={30} color={color} />
      <div>
        <Label>
          <b>{laberText}</b>
        </Label>
      </div>
      <div>
        <Label>KIM</Label>
        <Label style={{ color }}>
          <b>{value}</b>
        </Label>
      </div>
    </ExtratoCardHolder>
  );
};

export default ExtractItem;
