import React, { useEffect, useState, createContext, useContext } from 'react';

import { CodCanalVenda } from '../services/consts';
import api from '../services/api';

import { useAuth } from './auth';
import { useAlert } from './alert';
import { StatusContaEnum } from '../dtos/usuarios';

export interface DigitalWalletContextData {
  codigoConta: number;
  saldoDisponivelGlobal: number;
  valorRenda: number;
  nome: string;
}

const DigitalWalletContext = createContext<DigitalWalletContextData>({
  codigoConta: 0,
  saldoDisponivelGlobal: 0,
  valorRenda: 0,
  nome: '',
});

const DigitalWalletProvider: React.FC = ({ children }) => {
  const { user } = useAuth();
  const { addAlert } = useAlert();

  const [wallet, setWallet] = useState<DigitalWalletContextData>();

  useEffect(() => {
    if (user?.StatusConta === StatusContaEnum.ContaAtiva) {
      let cod = user.CodigoConta;
      if (typeof cod === 'number') {
        api
          .get(
            `/KimMais.Api.BuscarSaldoConta/${user.TokenUsuario}/${user.CodigoUsuario}?saldoConta=${cod}`,
          )
          .then(responseBS => {
            if (
              responseBS.data.Status === 0 &&
              Array.isArray(responseBS.data.ListaObjeto) &&
              responseBS.data.ListaObjeto.length > 0
            ) {
              setWallet({
                codigoConta: cod,
                ...responseBS.data.ListaObjeto[0],
              });
            } else {
              addAlert({
                title: 'Erro',
                description: 'Erro ao buscar saldo da conta. ' + responseBS.data.Mensagem,
                type: 'error',
              });
            }
          })
          .catch(() => {
            addAlert({
              title: 'Erro',
              description: 'Erro ao buscar saldo da conta, tente novamente mais tarde',
              type: 'error',
            });
          });
      } else {
        addAlert({
          title: 'Erro',
          description: 'Nenhuma carteira encontrada!',
          type: 'error',
        });
      }
    } else {
      setWallet(undefined);
    }
  }, [user, addAlert]);

  return <DigitalWalletContext.Provider value={wallet}>{children}</DigitalWalletContext.Provider>;
};

function useDigitalWallet() {
  const context = useContext(DigitalWalletContext);

  return context;
}

export { DigitalWalletProvider, useDigitalWallet };
