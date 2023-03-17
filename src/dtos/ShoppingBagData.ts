import { TipoPedidoEnum } from 'enuns/tipoPedidoEnum';

export interface ShoppingBagData {
  Codigo?: number;
  IconeUrl?: string;
  Nome: string;
  Detalhes?: string;
  CreditoConfianca?: number;
  CodigoUsuarioCartao: number;
  CodigoUsuario: number;
  ValorRecarga: number;
  TipoPedido: TipoPedidoEnum;
  CodigoAssinante: string; // só com serviço digital, caso tenha hasCodigoAssinante === true, caso contrário ""
  CodigoTipoCartao: number; // (código da operadora)  só serviço digital e recarga de celular, caso contrário 0
  TipoCartaoValor?: number; // (código do valor) só serviço digital é recarga de celular, caso contrário não é informado
  NumeroCartao?: string;
  ValorSaldo?: number;
  CodigoOperadora?: number;
  NumeroCelRecarga?: string;
  DDDCelRecarga?: string;
  GedRevalidacao?: {
    CodigoOperadora: number;
    CodigoPedido?: number;
    Documento64: string;
    NumeroCartao: string;
  }
  ValorEntrega?: number;
  IsRetirada?: boolean;
  CodPosto?: number,
  TipoLogradouroEntrega?: string;
  LogradouroEntrega?: string;
  NumLogradouroEntrega?: string;
  CompEntrega?: string;
  BairroEntrega?: string;
  MunicipioEntrega?: string;
  CodUFEntrega?: number;
  CepEntrega?: string;
}
