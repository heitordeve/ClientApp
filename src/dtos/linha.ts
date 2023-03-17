export interface Linha {
  Id: string;
  Codigo: string;
  Nome: string;
  TipoServico: TipoServico;
  ValorTarifa: number;

}
export enum TipoServico {
  Linha = 0,
  Estacao = 1,
}

export interface FavoritarLinhaRequest {
  CodigoCartaoTransporte: number
  DescricaoLinha?: string
  IdLinhaSBE?: string
  CodigoOperadora: number
  IsFavoritar: boolean
  CodigoLinhaMapa?: string
  DescricaoLinhaMapa?: string
  NomeLinhaMapa?: string
}
