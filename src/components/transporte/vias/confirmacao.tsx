import React, { useCallback, useEffect, useState } from 'react';

import { Title, Subhead, P } from 'components/ui/typography/v2';
import { AlertCard } from 'components/ui/card';
import { useVias } from './viasHook';
import { Column } from 'components/ui/layout';
import Button from 'components/ui/button';
import { EFormaDeEntrega } from 'enuns/formaDeEntrega';
import { EntregaDto } from 'dtos/Pedidos';
import { CartaoTransporteApi } from 'services/apis';

const Confirmacao: React.FC = () => {
  const { codigoOperadora, postoDeAtendimento, tipoCartao, formaDeEntrega, via, onFinish } =
    useVias();

  const entrega = formaDeEntrega as EntregaDto;
  const entereco = entrega.Endereco ?? postoDeAtendimento.Endereco;
  const isRetirada = formaDeEntrega?.Tipo === EFormaDeEntrega.Retirada;
  const valorVia =
    (via === 1 ? tipoCartao.ValorEmissaoPrimeiraVia : tipoCartao.ValorEmissaoSegundaVia) ?? 0;

  const [mensagem, setMensagem] = useState<string>('');

  const buscarMensagem = useCallback(async () => {
    const idOperadora = codigoOperadora;
    const idPosto = postoDeAtendimento?.Id;
    const isEntrega = formaDeEntrega?.Tipo === EFormaDeEntrega.Entrega;
    const msg = await CartaoTransporteApi.ObterMensagemVias(idOperadora, idPosto, via, isEntrega);
    setMensagem(msg);
  }, [codigoOperadora, postoDeAtendimento, formaDeEntrega, via]);

  useEffect(() => {
    buscarMensagem();
  }, [buscarMensagem]);

  return (
    <Column flex="1" gap="12px">
      <Column flex="1" gap="12px">
        <Title size="SB">Confira as informações abaixo sobre o seu pedido:</Title>
        <Column gap="6px">
          <Subhead size="SB">Dados do pedido</Subhead>
          {tipoCartao && (
            <P>
              Tipo de cartão: {tipoCartao.Descricao} <br />
              <strong>Valor do cartão: {valorVia.toMoneyString()}</strong>
            </P>
          )}
        </Column>
        <Column gap="6px">
          <Subhead size="SB">{isRetirada ? 'Dados da retirada' : 'Dados da entrega'}</Subhead>
          <P>
            {postoDeAtendimento && (
              <>
                Retirada no posto de atendimento <br />
                {postoDeAtendimento.Nome} <br />
              </>
            )}
            {entereco.Logradouro} <br />
            {entereco.Numero} <br />
            {entereco.Bairro} <br />
            {entereco.Cidade}/{entereco.Estado.Sigla}
            <br />
            CEP: {entereco.Cep} <br />
            {entrega.Valor && <strong>Valor da entrega: {entrega.Valor.toMoneyString()}</strong>}
          </P>
        </Column>
        <Column gap="6px">
          <Subhead size="SB">Valor total do pedido</Subhead>
          <P>{((entrega?.Valor ?? 0) + valorVia).toMoneyString()}</P>
        </Column>
      </Column>
      {mensagem && <AlertCard titulo="Atenção" texto={mensagem} />}
      <Button onClick={onFinish}>Adicionar ao carrinho</Button>
    </Column>
  );
};

export default Confirmacao;
