import { OperadoraTranspote } from './operadorasTrasporte';
import { MaxMin } from './geral'
export interface CartaoQrcode {
  Praca: string,
  Numero: string,
  Saldo: number,
  Mensagem: string,
  CodigoTitularRevenda: string,
  Cpf: string
}
export interface ListarQrCodeResquest {
  CodOperadora: number,
  CodExtCartao: string
  QtdPag: number,
  Pag: number
  DtInicial?: Date
  DtFinal?: Date
}
export interface QrCode {
  CodigoQRCode: number,
  Versao: string
  Praca: string,
  Numero: string,
  Valor: number,
  Saldo: number,
  Chave: string,
  DataValidadeCarga: Date,
  CodigoLinhaPrincipal: number,
  Linha: string,
  CodigoGerado: string,
  Mensagem: string,
  ImagemBase64: string,
  CodigoTitularRevenda: number,
  DataGeracao: Date,
  TipoEvento: string,
  DataEvento: Date,
  Descricao: string,
  StatusUso: string,
  IcEstacao: boolean
}

export interface GerarCartaoVirtualRequest {
  CodigoOperadora: number
  CodigoTipoCartao: number
  NomeCartaoVirtual: string
}
export interface GerarCartaoVirtualResult {
  Codigo: number,
  Nome: string,
  Numero: string,
  CodigoTipoCartao: number,
  DataSaldoAtualizado: Date,
  ValorSaldo: number,
  Operadora: OperadoraTranspote
  HasBloqueio: boolean,
  HasCartaoElegivel: boolean
  UrlLogoOperadora: string,
  ValorRecarga: MaxMin<number>
}

export interface GerarQrCodeRequest {
  CodigoTipoCartao: number
  CodigoCartaoTransporte: number
  CodigoLinha: string
  ValorTarifa: number
}
