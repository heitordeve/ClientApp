import React, { createContext, useContext } from 'react';

import { FormaDeEntrega } from 'dtos/Pedidos';
import { PostoDeAtendimento } from 'dtos/postoDeAtendimento';
import { TipoCartao } from 'dtos/tipoCartao';
import { CartaoTransporte } from 'dtos/CartaoTransporte';

type Seter<T> = React.Dispatch<React.SetStateAction<T>>;
export interface ViasContextData {
  codigoOperadora?: number;
  tipoCartao?: TipoCartao;
  setTipoCartao?: Seter<TipoCartao>;
  formaDeEntrega?: FormaDeEntrega;
  setFormaDeEntrega?: Seter<FormaDeEntrega>;
  postoDeAtendimento?: PostoDeAtendimento;
  setPostoDeAtendimento?: Seter<PostoDeAtendimento>;
  cartaoTransporte?: CartaoTransporte;
  setCartaoTransporte?: Seter<CartaoTransporte>;
  via?: number;
  onNext?: () => void;
  onFinish?: () => void;
}
const defaltValue: ViasContextData = {};

const ViasContext = createContext<ViasContextData>(defaltValue);

const useVias = () => useContext(ViasContext);

export { ViasContext, useVias };
