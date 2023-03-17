import React from 'react';
import { OpenButton, ShoppingBagCounterHolder } from './styles';
import { RiShoppingCartLine } from 'react-icons/ri';

interface BagIconPropos {
  onClick: () => void,
  itensCount:number
}
const BagIcon: React.FC<BagIconPropos> = ({ onClick,itensCount }) => {
  return (
    <OpenButton id="shoppingBagToggleButton" onClick={() => onClick()}>
      {itensCount > 0 && (
        <ShoppingBagCounterHolder>
          {itensCount > 9 ? '9+' : itensCount}
        </ShoppingBagCounterHolder>
      )}
      <RiShoppingCartLine size={22} />
      <p>Carrinho</p>
    </OpenButton>
  );
};

export default BagIcon;
