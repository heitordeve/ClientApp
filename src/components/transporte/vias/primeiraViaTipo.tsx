import React, { useEffect, useState, useCallback } from 'react';

import { Small, Title } from 'components/ui/typography';
import { ItemCard } from 'components/ui/card';
import { TipoCartaoApi, CartaoTransporteApi } from 'services/apis';
import { TipoCartao } from 'dtos/tipoCartao';
import { useVias } from './viasHook';
import { useAlert, useLoad, useShoppingBag } from 'hooks';

const LOAD = 'tipoPrimeiraVia';
const PrimeiraViaTipo: React.FC = () => {
  const [tiposCartoes, setTiposCartoes] = useState<TipoCartao[]>([]);
  const { onNext, setTipoCartao, codigoOperadora } = useVias();
  const { addLoad, removeLoad } = useLoad();
  const { addAlert } = useAlert();
  const { shoppingBag } = useShoppingBag();
  const validBag = useCallback(() => {
    if (shoppingBag.length === 0) return true;

    addAlert({ title: 'Carrinho', description: 'Carrinho cheio', type: 'info' });
    return false;
  }, [shoppingBag, addAlert]);

  const onSelect = useCallback(
    async (tipo: TipoCartao) => {
      const ok =
        validBag() &&
        (await CartaoTransporteApi.ValidarSolicitacaoVias(codigoOperadora, tipo.Codigo, 1));
      if (ok) {
        setTipoCartao(tipo);
        onNext();
      }
    },
    [setTipoCartao, onNext, validBag, codigoOperadora],
  );

  useEffect(() => {
    if (codigoOperadora) {
      (async () => {
        addLoad(LOAD);
        let tmpTiposCartoes = await TipoCartaoApi.primeiraVia(codigoOperadora);
        setTiposCartoes(tmpTiposCartoes);
        removeLoad(LOAD);
      })();
    }
  }, [codigoOperadora, addLoad, removeLoad]);

  return (
    <>
      <Title>Selecione o tipo do cartão que deseja solicitar a 1ª via:</Title>
      {tiposCartoes?.map(t => (
        <ItemCard key={t.Codigo} onClick={() => onSelect(t)}>
          <Title color="primary">{t.Descricao}</Title>
          <Small>{t.DetalheOperacao}</Small>
          <Small>Valor da emissão: {t.ValorEmissaoPrimeiraVia.toMoneyString()}</Small>
        </ItemCard>
      ))}
    </>
  );
};

export default PrimeiraViaTipo;
