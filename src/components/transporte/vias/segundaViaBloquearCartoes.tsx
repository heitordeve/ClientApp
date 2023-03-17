import React, { useLayoutEffect, useCallback, useState } from 'react';

import Button from 'components/ui/button';
import { Column } from 'components/ui/layout';

import { useVias } from './viasHook';
import { CartaoTransporteApi } from 'services/apis';
import { CartaoTransporte } from 'dtos/CartaoTransporte';
import CartaoDeTransporte from '../cartoes/cartao/Card';
import { useLoad } from 'hooks';
import { NoContent } from 'components/ui/main';
import { IlCartoes } from 'components/ui/illustrations';

const LOAD_CARTOES = 'loadCartoesBloqueados';
interface SegundaViaBloquearCartoesProps {
  onBack: () => void;
}

const SegundaViaBloquearCartoes: React.FC<SegundaViaBloquearCartoesProps> = ({ onBack }) => {
  const { codigoOperadora } = useVias();
  const { addLoad, removeLoad, hasLoad } = useLoad();

  const [cartoes, setCartoes] = useState<CartaoTransporte[]>([]);

  const buscarBloquados = useCallback(async () => {
    addLoad(LOAD_CARTOES);
    const tmpCartoes = await CartaoTransporteApi.ListarBloqueados();
    setCartoes(tmpCartoes.filter(c => c.CodigoOperadora === codigoOperadora));
    removeLoad(LOAD_CARTOES);
  }, [setCartoes, codigoOperadora, addLoad, removeLoad]);

  useLayoutEffect(() => {
    if (codigoOperadora) {
      buscarBloquados();
    }
  }, [buscarBloquados, codigoOperadora]);

  return (
    <Column gap="24px" flex="1">
      <Column align="center" gap="12px" flex="1">
        {cartoes.map(c => (
          <CartaoDeTransporte
            key={c?.Codigo}
            card={c}
            menu={false}
            action="block"
            onActionClick={() => onBack()}
          />
        ))}
        {cartoes.length === 0 && !hasLoad(LOAD_CARTOES) && (
          <NoContent
            title="Nenhum cartão disponível para bloqueio"
            legend="Você não possui nenhum cartão de transporte disponível para bloqueio no momento."
            illustration={IlCartoes}
          />
        )}
      </Column>
      <Button theme="light" onClick={onBack}>
        Voltar
      </Button>
    </Column>
  );
};

export default SegundaViaBloquearCartoes;
