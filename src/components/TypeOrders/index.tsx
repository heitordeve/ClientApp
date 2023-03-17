import React, { useState } from 'react';
import {
  Content,
  HeaderLink,
  FakeHeaderLink,
  TitleHeaderLink,
  Section,
} from './styles';

import { Column } from '../ui/layout';
import OrdersList from './ordersList';
import OrderDetails from './orderDetails';

const TypeOrders: React.FC = () => {
  const [pedido, setPedido] = useState<number>(null);
  return (
    <Column flex="1">
      <TitleHeaderLink>
        <HeaderLink to="dashboard">Home/</HeaderLink>
        <FakeHeaderLink className="highlight">Pedidos</FakeHeaderLink>
      </TitleHeaderLink>
      <Section>
        <Content>
          {!pedido && (
            <OrdersList
              onOpen={(id: number) => {
                setPedido(id);
              }}
            />
          )}
          {pedido && (
            <OrderDetails numPedido={pedido} voltar={() => setPedido(null)} />
          )}
        </Content>
      </Section>
    </Column>
  );
};

export default TypeOrders;
