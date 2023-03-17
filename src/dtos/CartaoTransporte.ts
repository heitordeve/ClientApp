import { Endereco } from "./endereco";

export interface CartaoTransporte {
  Codigo: number;
  Nome: string;
  Numero: string;
  IsFavorito: boolean;
  IsInativo: boolean;
  CodigoOperadora: number;
  CodigoTipoCartao: number;
  CodigoUsuario: number;
  DataUltimoUso: Date;
  HasBloqueio: boolean;
  HasQrCode: boolean;
  HasRevalidacaoCartao: boolean;
  HasRecargaAutomatica: boolean;
  HasRecargaProgramada: boolean;
  NomeOperadora: string;
  ValorRecargaMaxima: number;
  ValorRecargaMinima: number;
  ValorRevalidacaoOperadora: number;
  Saldo: number;
  SaldoPendente: number;
  urlLogoOperadora: string;
}
export interface BloqueioCartaoTrans {
  CodigoUsuarioCartao: number,
  Senha: string,
}
export interface ValidacaoCartao {
  Elegivel: boolean
  Tipo: string
  CodigoRetorno: string
  Mensagem: string
}
export interface CalcularTaxaEntregaViasRequest {
  IdTipoCartao: number;
  Endereco: Endereco;
}
export interface SaldoCartao {
  Saldo: number;
  SaldoPendente: number;
  DataAtualizacao: string;
  Mensagem: string;
}
