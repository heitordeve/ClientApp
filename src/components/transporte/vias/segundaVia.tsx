import React, { useCallback, useState } from 'react';

import { useParams, useHistory } from 'react-router-dom';

import { BackMain } from 'components/ui/main';
import { EFormaDeEntrega } from 'enuns/formaDeEntrega';
import { TipoPedidoEnum } from 'enuns/tipoPedidoEnum';
import { EntregaDto, FormaDeEntrega, RedetiradaDto } from 'dtos/Pedidos';
import { PostoDeAtendimento } from 'dtos/postoDeAtendimento';
import { TipoCartao } from 'dtos/tipoCartao';
import { useAlert, useAuth, useShoppingBag } from 'hooks';

import Confirmacao from './confirmacao';
import MetodoRecebimento from './metodoRecebimento';
import MetodoRecebimentoDetalhes from './metodoRecebimentoDetalhes';
import { ViasContext } from './viasHook';
import SegundaViaAvisoBloqueio from './segundaViaAvisoBloqueio';
import SegundaViaCartoesBloqueados from './segundaViaCartoesBloqueados';
import { CartaoTransporte } from 'dtos/CartaoTransporte';

interface CompraQrCodeParams {
  codigoOperadora: string;
}

const Steps: React.FC[] = [
  SegundaViaAvisoBloqueio,
  SegundaViaCartoesBloqueados,
  MetodoRecebimento,
  MetodoRecebimentoDetalhes,
  Confirmacao,
];

const SegundaVia: React.FC = () => {
  const history = useHistory();
  let { codigoOperadora } = useParams<CompraQrCodeParams>();
  const { user } = useAuth();
  const { addShoppingBag } = useShoppingBag();
  const { addAlert } = useAlert();

  const [tipoCartao, setTipoCartao] = useState<TipoCartao>(null);
  const [formaDeEntrega, setFormaDeEntrega] = useState<FormaDeEntrega>(null);
  const [postoDeAtendimento, setPostoDeAtendimento] = useState<PostoDeAtendimento>(null);
  const [cartaoTransporte, setCartaoTransporte] = useState<CartaoTransporte>(null);

  const [step, setStep] = useState<number>(0);

  const onFinish = useCallback(() => {
    const endereco = (formaDeEntrega as EntregaDto).Endereco;
    addShoppingBag({
      Nome: '2ª via cartão',
      Detalhes: tipoCartao.Descricao,
      TipoPedido: TipoPedidoEnum.SegundaVia,
      CodigoUsuario: user.CodigoUsuario,
      CodigoUsuarioCartao: cartaoTransporte.Codigo,
      ValorRecarga: tipoCartao.ValorEmissaoSegundaVia,
      ValorEntrega: (formaDeEntrega as EntregaDto).Valor ?? 0,
      CodigoAssinante: '',
      CodigoTipoCartao: tipoCartao.Codigo,
      CodigoOperadora: Number(codigoOperadora),
      IsRetirada: formaDeEntrega.Tipo === EFormaDeEntrega.Retirada,
      CodPosto: (formaDeEntrega as RedetiradaDto).IdPosto,
      LogradouroEntrega: endereco?.Logradouro,
      NumLogradouroEntrega: endereco?.Numero,
      CompEntrega: endereco?.Complemento,
      BairroEntrega: endereco?.Bairro,
      MunicipioEntrega: endereco?.Cidade,
      CodUFEntrega: endereco?.Estado?.Id,
      CepEntrega: endereco?.Cep?.replace('-',''),
    });
    addAlert({
      title: 'solicitação adicionada ao carrinho',
      type: 'success',
    });
    history.replace('/');
  }, [
    codigoOperadora,
    addShoppingBag,
    formaDeEntrega,
    user,
    tipoCartao,
    addAlert,
    history,
    cartaoTransporte,
  ]);

  const onNext = useCallback(() => {
    setStep(prev => {
      const valor = prev + 1;
      if (valor === Steps.length) {
        return prev;
      }
      return valor;
    });
  }, [setStep]);

  const onBack = useCallback(() => {
    if (step === 0) {
      return true;
    }
    setStep(prev => prev - 1);
    return false;
  }, [step, setStep]);

  const Step = Steps[step];
  return (
    <BackMain title="2ª Via de Cartão" onBack={onBack}>
      <ViasContext.Provider
        value={{
          tipoCartao,
          setTipoCartao,
          formaDeEntrega,
          setFormaDeEntrega,
          postoDeAtendimento,
          setPostoDeAtendimento,
          cartaoTransporte,
          setCartaoTransporte,
          onNext,
          onFinish,
          via: 2,
          codigoOperadora: Number(codigoOperadora),
        }}
      >
        <Step />
      </ViasContext.Provider>
    </BackMain>
  );
};

export default SegundaVia;
