import React, { useEffect, useState, createContext, useContext, useCallback } from 'react';

import { OperadoraTranspote } from '../dtos/operadorasTrasporte';
import OperadoraTranspoteApi from '../services/apis/operadoraTranspoteApi';
import CartaoTransporteApi from '../services/apis/cartaoTransporteApi';
import { CartaoTransporte } from '../dtos/CartaoTransporte';
import CartaoQrCodeApi from '../services/apis/cartaoQrCodeApi';
import { useAuth } from 'hooks';
import { QrCode } from 'dtos/cartaoQrcode';
import { QrcodeStorage } from 'storage';
import { useLoad } from './loadHook';

export interface TransporteContextData {
  operadorasTranspote: OperadoraTranspote[];
  getOperadora?: (codigo: number) => OperadoraTranspote;
  getCartao?: (codigo: number) => CartaoTransporte;
  getCartoes?: (codOperadora?: number) => CartaoTransporte[];
  updateOperadora?: (operadora: OperadoraTranspote) => void;
  setCartaoQrcode?: (codOperadora: number) => Promise<void>;
  setQrcodes?: (qrCode: QrCode[]) => void;
  getQrcodes?: () => QrCode[];
}
const defaltValue: TransporteContextData = {
  operadorasTranspote: [],
};

const TransporteContext = createContext<TransporteContextData>(defaltValue);

const TransporteProvider: React.FC = ({ children }) => {
  const { user } = useAuth();
  const { addLoad, removeLoad } = useLoad();
  const [operadoras, setOperadoras] = useState<OperadoraTranspote[]>([]);
  const [_qrcode, _setQrcode] = useState<QrCode[]>([]);

  const busarOperadora = useCallback(async () => {
    if (user) {
      addLoad('Operadoras');
      const tmpOperadoras = await OperadoraTranspoteApi.Listar(0, 0);
      const cartoes = await CartaoTransporteApi.Listar();
      tmpOperadoras.forEach(o => {
        o.CartoesUsuario = cartoes.filter(c => c.CodigoOperadora === o.Codigo);
      });
      const tempContext = [...tmpOperadoras];
      setOperadoras(tempContext);
      removeLoad('Operadoras');
    } else {
      setOperadoras([]);
    }
  }, [user, addLoad, removeLoad]);

  useEffect(() => {
    busarOperadora();
  }, [user, busarOperadora]);

  const updateOperadora = useCallback(
    (operadora: OperadoraTranspote) => {
      const tmpOperadoras = [...operadoras].remove(o => o.Codigo === operadora.Codigo);
      tmpOperadoras.push(operadora);
      setOperadoras(tmpOperadoras);
    },
    [operadoras],
  );
  const getOperadora = useCallback(
    (codigo: number) => {
      return operadoras.find(o => o.Codigo === codigo);
    },
    [operadoras],
  );
  const setCartaoQrcode = useCallback(
    async (codOperadora: number) => {
      addLoad('cartaoQRcode');
      const result = await CartaoQrCodeApi.ObterPorOperadora(codOperadora);
      if (result) {
        const tmpOperadora = { ...getOperadora(codOperadora) };
        tmpOperadora.CartaoQrcode = result;
        updateOperadora(tmpOperadora);
      }
      removeLoad('cartaoQRcode');
    },
    [getOperadora, updateOperadora, addLoad, removeLoad],
  );

  const getCartao = useCallback(
    (codigo: number) => {
      return operadoras
        .find(o => o.CartoesUsuario?.some(c => c.Codigo === codigo))
        .CartoesUsuario.find(c => c.Codigo === codigo);
    },
    [operadoras],
  );
  const getCartoes = useCallback(
    (codOperadora?: number) => {
      return operadoras
        .filter(op => !codOperadora || op.Codigo === codOperadora)
        .reduce((arr: CartaoTransporte[], o) => arr.concat(o.CartoesUsuario), []);
    },
    [operadoras],
  );
  const setQrcodes = useCallback(
    (qrCode: QrCode[]) => {
      _setQrcode(qrCode);
      QrcodeStorage.set(qrCode);
    },
    [_setQrcode],
  );
  const getQrcodes = useCallback(() => {
    return _qrcode.length > 0 ? _qrcode : QrcodeStorage.get();
  }, [_qrcode]);
  return (
    <TransporteContext.Provider
      value={{
        operadorasTranspote: operadoras,
        updateOperadora,
        setCartaoQrcode,
        getOperadora,
        getCartao,
        getCartoes,
        setQrcodes,
        getQrcodes,
      }}
    >
      {children}
    </TransporteContext.Provider>
  );
};

function useTransporte() {
  return useContext(TransporteContext);
}

export { TransporteProvider, useTransporte };
