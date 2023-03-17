import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './auth';
import { useAlert } from './alert';

export interface CreditCardData {
  CodigoUsuarioCartaoCredito: number;
  CodigoUsuario: number;
  BandeiraCartaoCredito: string;
  NumeroCartaoCredito: any;
  NomeCartaoCredito: string;
  MesCartaoCredito: string;
  AnoCartaoCredito: string;
  ChaveCartaoCredito: string | null;
  PrimeirosDigitos: string;
  UltimosDigitos: string;
  CodigoSeguranca: any;
  CartaoCriptografado: any;
  PossuiTokenAdyen: boolean;
  PossuiTokenMundiPagg: boolean;
}

interface CreditCardContextData {
  creditCardList?: CreditCardData[];
  tryAgain?: (callback: (status: boolean, errorMessage?: string) => void) => void;
}

const CreditCardContext = createContext<CreditCardContextData>({});

export const CreditCardProvider: React.FC = ({ children }) => {
  const { user } = useAuth();
  const { addAlert } = useAlert();
  const [creditCardList, setCreditCardList] = useState<CreditCardData[]>();

  const tryConnect = useCallback(
    (handleSuccess: (data: CreditCardData[]) => void, handleError: (message: string) => void) => {
      if (user) {
        api
          .get(
            `KimMais.Api.Generica/${user.TokenUsuario}/${user.CodigoUsuario}/CartaoCredito%2FBuscaCartoesPorUsuario`,
          )
          .then(response => {
            if (
              response.data.Status === 0 &&
              Array.isArray(response.data.ListaObjeto) &&
              response.data.ListaObjeto.length > 0
            ) {
              let data = response.data.ListaObjeto[0];
              setCreditCardList(data);
              handleSuccess(data);
            } else {
              handleError('Erro ao buscar cartões. ' + response.data.Mensagem);
            }
          })
          .catch(() => {
            handleError('Erro ao buscar cartões, tente mais tarde');
          });
      }
    },
    [user],
  );

  useEffect(() => {
    tryConnect(
      () => {},
      message => {
        addAlert({
          title: 'Error',
          description: message,
          type: 'error',
        });
      },
    );
  }, [user, addAlert, tryConnect]);

  const tryAgain = useCallback(
    (callback: (status: boolean, errorMessage?: string) => void) => {
      tryConnect(
        () => {
          callback(true);
        },
        message => {
          callback(false, message);
        },
      );
    },
    [tryConnect],
  );

  return (
      <CreditCardContext.Provider
        value={{
          creditCardList: creditCardList,
          tryAgain: tryAgain,
        }}
      >
        {children}
      </CreditCardContext.Provider>
  );
};

export function useCreditCard(): CreditCardContextData {
  const context = useContext(CreditCardContext);

  return context;
}
