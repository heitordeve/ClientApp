import React, { useEffect, useCallback, useState, useLayoutEffect } from 'react';

import Button from 'components/ui/button';
import { Column } from 'components/ui/layout';

import { useVias } from './viasHook';
import { CartaoTransporteApi, TipoCartaoApi } from 'services/apis';
import { CartaoTransporte } from 'dtos/CartaoTransporte';
import CartaoDeTransporte from '../cartoes/cartao/Card';
import { useLoad, useShoppingBag, useAlert } from 'hooks';
import SegundaViaBloquearCartoes from './segundaViaBloquearCartoes';
import { NoContent } from 'components/ui/main';
import { IlCartoes } from 'components/ui/illustrations';

const LOAD_CARTOES = 'loadCartoesBloqueados';
const SegundaViaCartoesBloqueados: React.FC = () => {
  const { onNext, codigoOperadora, setCartaoTransporte, setTipoCartao } = useVias();
  const { addLoad, removeLoad, hasLoad } = useLoad();
  const { shoppingBag } = useShoppingBag();
  const { addAlert } = useAlert();

  const [cartoes, setCartoes] = useState<CartaoTransporte[]>([]);
  const [bloquear, setBloquear] = useState<boolean>(false);

  const validBag = useCallback(() => {
    if (shoppingBag.length === 0) return true;

    addAlert({ title: 'Carrinho', description: 'Carrinho cheio', type: 'info' });
    return false;
  }, [shoppingBag, addAlert]);

  const onSelect = useCallback(
    async (card: CartaoTransporte) => {
      const LOAD = 'loadValidaVia';
      addLoad(LOAD);
      const validacaoVia = CartaoTransporteApi.ValidarSolicitacaoVias;
      const ok = validBag() && (await validacaoVia(codigoOperadora, card.CodigoTipoCartao, 2));
      if (ok) {
        const tipo = await TipoCartaoApi.Obter(card.CodigoTipoCartao);
        if (tipo) {
          setTipoCartao(tipo);
          setCartaoTransporte(card);
          onNext();
        }
      }
      removeLoad(LOAD);
    },
    [onNext, setCartaoTransporte, validBag, codigoOperadora, addLoad, removeLoad, setTipoCartao],
  );

  const buscarBloquados = useCallback(async () => {
    addLoad(LOAD_CARTOES);
    const tmpCartoes = await CartaoTransporteApi.ListarBloqueados();
    setCartoes(tmpCartoes.filter(c => c.CodigoOperadora === codigoOperadora));
    removeLoad(LOAD_CARTOES);
  }, [setCartoes, codigoOperadora, addLoad, removeLoad]);

  useEffect(() => {
    if (codigoOperadora) {
      buscarBloquados();
    }
  }, [buscarBloquados, codigoOperadora]);

  useLayoutEffect(() => {
    addLoad(LOAD_CARTOES);
  }, [addLoad]);

  return !bloquear ? (
    <Column gap="24px" flex="1">
      <Column align="center" gap="12px" flex="1">
        {cartoes.map(c => (
          <CartaoDeTransporte
            key={c?.Codigo}
            card={c}
            menu={false}
            action="segundaVia"
            onActionClick={onSelect}
          />
        ))}
        {cartoes.length === 0 && !hasLoad(LOAD_CARTOES) && (
          <NoContent
            title="Nenhum cartão de transporte bloqueado"
            legend="Toque no botão abaixo para bloquear um cartão de transporte ativo."
            illustration={IlCartoes}
          />
        )}
      </Column>
      <Button onClick={() => setBloquear(true)}>Bloquear outro cartão</Button>
    </Column>
  ) : (
    <SegundaViaBloquearCartoes
      onBack={() => {
        setBloquear(false);
        buscarBloquados();
      }}
    />
  );
};

export default SegundaViaCartoesBloqueados;
