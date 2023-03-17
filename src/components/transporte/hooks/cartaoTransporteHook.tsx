import {
  createContext,
  useContext,
} from 'react';

import { CartaoTransporte } from '../../../dtos/CartaoTransporte';
import { Cidade } from '../../../dtos/cidades';

export interface TransporteContextData {
  cidades: Cidade[];
  requestOpenMPE(card: CartaoTransporte): void;
}

const defaltValue: TransporteContextData = {
  cidades: [],
  requestOpenMPE: () => {},
};
const TransporteContext = createContext<TransporteContextData>(defaltValue);

function useCartaoTransporte() {
  return useContext(TransporteContext);
}

export { TransporteContext, useCartaoTransporte };
