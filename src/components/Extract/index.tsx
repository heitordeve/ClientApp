import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import { useAlert } from '../../hooks/alert';
import { useDigitalWallet } from '../../hooks/digitalWallet';

import { CardSubtitle, Container } from './styles';

import FunctionalityCard, { LabeledHr } from '../FunctionalityCard';

import ExtractItem from './ExtractItem';

import Loading from '../ui/loading';

interface ExtractFormData {
  cartaoMascarado: string;
  descricaoAbreviada: string;
  nomePortador: string;
  valorBRL: string;
  dataOrigem: string;
}

interface ExtractGroupArray {
  dataOrigem: Date;
  extracts: ExtractFormData[];
}

const Extract: React.FC = () => {
  const { user } = useAuth();
  const { addAlert } = useAlert();
  const wallet = useDigitalWallet();

  const [extracts, setExtracts] = useState<ExtractGroupArray[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (wallet) {
      setLoading(true);
      api
        .get(
          `KimMais.Api.Generica/${user.TokenUsuario}/${user.CodigoUsuario}/Banco%2FExtratoContaCorrente`,
        )
        .then(response => {
          if (response.data.Status === 0) {
            if (Array.isArray(response.data.ListaObjeto) && response.data.ListaObjeto.length > 0) {
              let tmpExtracts = (response.data.ListaObjeto[0].content as ExtractFormData[]).reduce(
                (newArray, oldArrayItem) => {
                  let result = newArray;
                  let date = new Date(new Date(oldArrayItem.dataOrigem).toDateString());
                  let i = newArray.findIndex(e => e.dataOrigem.valueOf() === date.valueOf());
                  if (i === -1) {
                    result.push({ extracts: [oldArrayItem], dataOrigem: date });
                  } else {
                    result[i].extracts.push(oldArrayItem);
                  }
                  return result;
                },
                [] as ExtractGroupArray[],
              );
              setExtracts(tmpExtracts.sort(e => e.dataOrigem.valueOf()));
            }
          } else {
            addAlert({
              type: 'error',
              title: 'Error',
              description: 'Erro ao obter extrato',
            });
          }
          setLoading(false);
        });
    }
  }, [wallet, user, addAlert]);

  return (
    <>
      <Loading loading={loading} />
      <FunctionalityCard title="Extratos Carteira KIM" color="#15CDF9">
        <CardSubtitle>Útimas transações</CardSubtitle>
        <Container>
          {extracts.length > 0 ? (
            extracts.map(extractGroup => (
              <>
                <LabeledHr>
                  {extractGroup.dataOrigem.getDate()}{' '}
                  {extractGroup.dataOrigem.toLocaleString('default', { month: 'short' })} /{' '}
                  {extractGroup.dataOrigem.getFullYear()}
                </LabeledHr>
                {extractGroup.extracts.map(e => {
                  let color = '';
                  switch (e.descricaoAbreviada) {
                    case 'Transf entre Contas-Remetente':
                      color = '#672ED7';
                      break;

                    case 'Tarifa Transf Bancaria Enviada':
                      color = '#F76C39';
                      break;

                    case 'Pix Enviado-Conta Transacional':
                      color = '#15CDF9';
                      break;

                    case 'Dev Pix  Env N Proc-Cta Trans':
                      color = '#15CDF9';
                      break;

                    case 'Transf Bancaria Enviada':
                      color = '#F76C39';
                      break;

                    case 'Transf entre Contas-Favorecido':
                      color = '#672ED7';
                      break;
                    default:
                      color = '#0068E1';
                      break;
                  }
                  return (
                    <ExtractItem
                      color={color}
                      laberText={e.descricaoAbreviada}
                      cartao={e.cartaoMascarado}
                      value={new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(parseFloat(e.valorBRL))}
                    />
                  );
                })}
              </>
            ))
          ) : (
            <div className="semExtrato">
              <h1>Você não possui nenhuma transação!</h1>
            </div>
          )}
        </Container>
      </FunctionalityCard>
    </>
  );
};

export default Extract;
