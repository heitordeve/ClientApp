import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  useCallback,
} from 'react';

import { OperadoraTranspote } from '../../../dtos/operadorasTrasporte';
import OperadoraTranspoteApi from '../../../services/apis/operadoraTranspoteApi';
import CartaoTransporteApi from '../../../services/apis/cartaoTransporteApi';
import { CartaoTransporte } from '../../../dtos/CartaoTransporte';
import Loading from '../../ui/loading';
import CartaoQrCodeApi from '../../../services/apis/cartaoQrCodeApi';

export interface TransporteContextData {
  operadora?: OperadoraTranspote;
  cartao?: CartaoTransporte;
}
const defaltValue: TransporteContextData = {};

const CartaoQrCodeContext = createContext<TransporteContextData>(defaltValue);

interface providerProps{
  children: React.ReactNode,
  codigoOperadora: number;
}

const CartaoQrCodeProvider: React.FC<providerProps> = ({ codigoOperadora, children }) => {
  const [context, setContext] = useState<TransporteContextData>(defaltValue);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      setLoading(true);
      const operadoreas = await OperadoraTranspoteApi.Listar(0, 0);
      const cartoes = await CartaoTransporteApi.Listar();
      const tempContext = {
        ...context,
        operadorasTranspote: operadoreas,
        cartoesTransUsuario: cartoes,
      };
      setContext(tempContext);
      setLoading(false);
    })();
  }, []);



  return (
    <CartaoQrCodeContext.Provider
      value={{ ...context }}
    >
      <Loading loading={loading} />
      {children}
    </CartaoQrCodeContext.Provider>
  );
};

function useTransporte() {
  const context = useContext(CartaoQrCodeContext);

  return context;
}

export { CartaoQrCodeProvider, useTransporte };
