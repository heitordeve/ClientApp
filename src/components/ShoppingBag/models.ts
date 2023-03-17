import React from 'react';
import { NovoPedidoResponse } from '../../dtos/Pedidos';
import { PaymentTypeEnum } from '../../utils/resources';


export interface ShoppingBagResume {
  totalTaxas?: number;
  valorEntrega?:number;
  total: number;
  cardDescription?: React.ReactNode;
  novoPedidoData?: NovoPedidoResponse;
}

export interface PaymentLabelProps {
  icon: React.ReactNode;
  name: string;
}

export interface ObterCarrinhoKimMaisResponse {
  CodigoFormaPagamento: number;
  ValorTaxas: number[];
  Desconto: number;
  CodigoUsuarioCupom: number;
  VlTaxaDesconto: number;
  HasElegible: boolean;
  VlCashBack: number;
}
export interface PaymentOption {
  formaPagamento: PaymentTypeEnum;
  label: PaymentLabelProps;
  apiResponse: ObterCarrinhoKimMaisResponse;
}
export interface ObterListaCupomDescontoResponse {
  CodigoUsuarioCupom: number;
  CodigoCupomDesconto: number;
  CodigoUsuario: number;
  DataCadastro: string;
  Cupom: {
    CodigoCupom: number;
    Cupom: string;
    CupomDescricao: string;
    DataCadastro: string;
    DataValidade: string;
    DataValidadeFormated: string;
    PercentualDesconto: number;
    CupomUsuario: string | null;
  }
}
