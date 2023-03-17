import { EFormaDeEntrega } from "enuns/formaDeEntrega";
import { Endereco } from "./endereco";

export interface NovoPedidoRequest {
  CodigoUsuario: number;
  CodigoFormaPagamento: number;
  ValorPedido: string;
  CodigoUsuarioCupom: number;
  NumeroContaBancaria: string | number;
  AgenciaBancaria: string | number;
  BancoFastCashParaPagamento: number;
  CodigoUsuarioCartaoCredito?: number;
  cvvCartao?: string;
  ListaItemPedido: {
    CodigoUsuarioCartao: number;
    CreditoConfianca: number;
    TipoPedido: number;
    ValorRecarga: number;
    TipoCartaoValor?: number;
    CodigoAssinante: string;
    CodigoTipoCartao: number;
    dddCelRecarga?: string;
    NumeroCelRecarga?: string;
    CodigoOperadora?: number;
    IsRetirada?: boolean;
    CodPosto?: unknown;
    TipoLogradouroEntrega?: unknown;
    logradouroEntrega?: unknown;
    numLogradouroEntrega?: unknown;
    compEntrega?: unknown;
    bairroEntrega?: unknown;
    municipioEntrega?: unknown;
    codUFEntrega?: unknown;
    cepEntrega?: unknown;
  }[];
  CanalVenda: number;
  RepetirPedido: number;
  FastCash: {
    Tid: string;
    Description: string;
  }
}
export interface NovoPedidoResponse {
  CodigoPedido: number;
  Imagem_base64: string;
  Pix_link?: string;
  Emv?: string;
  Dt_pix_validade?: string;
  DataVencimento?: string;
  LinhaDigitavel?: string;
}
export interface PedidoResumido {
  CodigoPedido: number;
  CodigoFormaPagamento: number,
  CodigoStatusPedido: number,
  DescricaoStatusPedido: string,
  DataPedido: string,
  ValorTotalPedido: number,
  ListaItemPedido: Array<ItemPedidoResumido>
}

export interface ItemPedidoResumido {
  NomeUsuarioCartao: string,
  DddCelRecarga: string,
  NumeroCelRecarga: string,
  NomeProduto: string,
  TipoPedido: number,
  CodigoItemPedido: number,
  CodigoStatusItemPedido: number,
  CodigoUsuarioCartao: number,
  ValorRecarga: number,
  TipoPedidoDescricao: string
}
export interface Pedido {
  CodigoPedido: number,
  CodigoUsuario: number,
  DataHoraPedido: string,
  CodigoFormaPagamento: number,
  CodigoStatusPedido: number,
  DescricaoStatusPedido: string,
  NomeIconeStatus: string,
  ValorPedido: number,
  ValorTaxa: number,
  ValorDesconto: number,
  ValorTotalPedido: number,
  DataPagamento: string,
  ValorPago: number,
  ChaveTransacao: string,
  CodigoBarrasBoleto: string,
  LinhaDigitavelBoleto: string,
  DataVencimentoBoleto: string,
  UsuarioIP: string,
  CodigoMotivoBaixa: number,
  DataManualBaixa: string,
  CodigoUsuarioAdmBaixaManual: number,
  CorPedido: string,
  ExportadoErp: string,
  DataExportadoErp: string,
  CodigoUsuarioCupom: string,
  UsuarioCupomDesconto: string,
  CodigoUsuarioCartaoCredito: number,
  cvvCartao: string,
  ListaItemPedido: Array<ItemPedido>
  FastCashBank: FastCashBank,
  AgenciaBancaria: string,
  NumeroContaBancaria: string,
  BancoFastCashParaPagamento: string,
  ValorTotalCashBack: number,
  PixExpirado: string,
  DataPagamentoPix: string,
  DataValidadePix: string,
  QRCodePix: string,
  LinkPix: string,
  EMVPix: string,
  CanalVenda: string,
  CodFidelidadeResgate: number,
  CreditoConfianca: number,
  EnderecoEntrega: string,//?
  ListaDetalhePedido: Array<string>,//?
  ListaLogStatusPedido: Array<LogStatusPedido>,
  RepetirPedido: boolean,
  TokeUsuario: string,
  VlTaxaDesconto: number,
  Adyen: string,
  FastCash: string
}

export interface ItemPedido {
  CodigoItemPedido: number,
  CodigoPedido: number,
  CodigoUsuarioCartao: string,
  NomeUsuarioCartao: string,
  NumeroFisico: string,
  ValorRecarga: number,
  DescricaoPedidoOperadora: string,
  DataHoraPedidoOperadora: string,
  CodigoStatusItemPedido: number,
  DescricaoStatusItemPedido: string,
  ValorTaxa: number,
  CartaoInativo: boolean,
  CartaoBloqueado: boolean,
  CodigoOperadora: number,
  CodigoTipoCartao: number,
  NumeroCartao: string,
  HasCartaoElegivel: boolean,
  NomeProduto: string,
  ValorProduto: number,
  ValorComissao: number,
  TipoPedido: number,
  TipoPedidoDescricao: string,
  CreditoConfiancaItem: boolean,
  ProcessadoFidelidade: boolean,
  dddCelRecarga: string,
  NumeroCelRecarga: string,
  CodigoAssinante: string,
  TipoCartaoValor: number,
  ValorCashBack: number,
  NomeOperadora: string,
  LogoOperadora: string,
  isRetirada: boolean,
  codPosto: number,
  tipoLogradouroEntrega: string,
  logradouroEntrega: string,
  numLogradouroEntrega: number,
  compEntrega: string,
  bairroEntrega: string,
  municipioEntrega: string,
  codUFEntrega: number,
  cepEntrega: string,
  listaLogStatus: Array<LogStatus>,

}
export interface LogStatus {
  codStatus: number
  descStatus: string
  dataStatus: string
}
export interface LogStatusPedido {
  CodigoLogStatusPedido: number,
  Descricao: string,
  NomeIconeStatus: string,
  DataLogStatusPedidoFormat: string,
  LinhaTempoDataLogStatusPedidoFormat: string
}
export interface FastCashBank {
  Bank: string,
  Agency: string,
  Account: string,
  AccountHolder: string,
  AccountHolderDocument: string
}


export interface NovoGedPedidoRequest {
  CodigoPedido: number,
  Documento64: string,
}

////
export interface FormaDeEntrega {
  Tipo: EFormaDeEntrega;

}
export interface EntregaDto extends FormaDeEntrega {
  Endereco: Endereco,
  Valor: number;
}
export interface RedetiradaDto extends FormaDeEntrega {
  IdPosto: number,
}
