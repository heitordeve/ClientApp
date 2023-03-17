import React from 'react';

import { useVias } from './viasHook';
import MetodoEntrega from './metodoEntrega';
import MetodoRetirada from './metodoRetirada';
import { EFormaDeEntrega } from 'enuns/formaDeEntrega';

const MetodoRecebimentoDetalhes: React.FC = () => {
  const { formaDeEntrega } = useVias();
  const metodo = formaDeEntrega.Tipo;
  return (
    <>
      {metodo === EFormaDeEntrega.Retirada && <MetodoRetirada />}
      {metodo === EFormaDeEntrega.Entrega && <MetodoEntrega />}
    </>
  );
};

export default MetodoRecebimentoDetalhes;
