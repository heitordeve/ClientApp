import React, { useCallback, useState } from 'react';

import { useParams, useHistory } from 'react-router-dom';
import { BackMain } from 'components/ui/main';
import PrimeiraViaTipo from './primeiraViaTipo';
import { ViasContext } from './viasHook';
import PrimeiraViaAvisoIdentidade from './primeiraViaAvisoIdentidade';
import PrimeiraViaDocumentos from './primeiraViaDocumentos';
import MetodoRecebimento from './metodoRecebimento';
import Confirmacao from './confirmacao';
import { useAlert, useAuth, useShoppingBag } from 'hooks';
import { TipoPedidoEnum } from 'enuns/tipoPedidoEnum';
import { EntregaDto, FormaDeEntrega, RedetiradaDto } from 'dtos/Pedidos';
import { EFormaDeEntrega } from 'enuns/formaDeEntrega';
import MetodoRecebimentoDetalhes from './metodoRecebimentoDetalhes';
import { TipoCartao } from 'dtos/tipoCartao';
import { PostoDeAtendimento } from 'dtos/postoDeAtendimento';
import DadosCompementares from './dadosComplementares';

interface CompraQrCodeParams {
  codigoOperadora: string;
}

const Steps: React.FC[] = [
  PrimeiraViaTipo,
  DadosCompementares,
  PrimeiraViaAvisoIdentidade,
  PrimeiraViaDocumentos,
  MetodoRecebimento,
  MetodoRecebimentoDetalhes,
  Confirmacao,
];

const PrimeiraVia: React.FC = () => {
  const history = useHistory();
  let { codigoOperadora } = useParams<CompraQrCodeParams>();
  const { user } = useAuth();
  const { addShoppingBag } = useShoppingBag();
  const { addAlert } = useAlert();

  const [tipoCartao, setTipoCartao] = useState<TipoCartao>(null);
  const [formaDeEntrega, setFormaDeEntrega] = useState<FormaDeEntrega>(null);
  const [postoDeAtendimento, setPostoDeAtendimento] = useState<PostoDeAtendimento>(null);

  const [step, setStep] = useState<number>(0);

  const onFinish = useCallback(() => {
    const endereco = (formaDeEntrega as EntregaDto).Endereco;
    addShoppingBag({
      Nome: '1ª via cartão',
      Detalhes: tipoCartao.Descricao,
      TipoPedido: TipoPedidoEnum.PrimeiraVia,
      CodigoUsuario: user.CodigoUsuario,
      CodigoUsuarioCartao: null,
      ValorRecarga: tipoCartao.ValorEmissaoPrimeiraVia ?? 0,
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
      CepEntrega: endereco?.Cep?.replace('-', ''),
    });
    addAlert({
      title: 'solicitação adicionada ao carrinho',
      type: 'success',
    });
    history.replace('/');
  }, [codigoOperadora, addShoppingBag, formaDeEntrega, user, tipoCartao, addAlert, history]);

  const temDadosComplementares = useCallback(() => {
    const { NomeMae, SexoUsuario, DataNascimentoUsuario } = user;
    return NomeMae && SexoUsuario && DataNascimentoUsuario;
  }, [user]);

  const onNext = useCallback(() => {
    setStep(prev => {
      const valor = prev + 1;
      if (valor === Steps.length) {
        return prev;
      }
      if (valor === Steps.indexOf(DadosCompementares) && temDadosComplementares()) {
        return valor + 1;
      }
      return valor;
    });
  }, [setStep, temDadosComplementares]);

  const onBack = useCallback(() => {
    if (step === 0) {
      return true;
    }
    setStep(prev => {
      const valor = prev - 1;
      if (valor === Steps.indexOf(DadosCompementares) && temDadosComplementares()) {
        return valor - 1;
      }
      return valor;
    });
    return false;
  }, [step, setStep, temDadosComplementares]);

  const Step = Steps[step];
  return (
    <BackMain title="1ª Via de Cartão" onBack={onBack}>
      <ViasContext.Provider
        value={{
          tipoCartao,
          setTipoCartao,
          formaDeEntrega,
          setFormaDeEntrega,
          postoDeAtendimento,
          setPostoDeAtendimento,
          onNext,
          onFinish,
          via: 1,
          codigoOperadora: Number(codigoOperadora),
        }}
      >
        <Step />
      </ViasContext.Provider>
    </BackMain>
  );
};

export default PrimeiraVia;
