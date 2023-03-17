import { Coordenadas } from "./geral";

export interface UsuarioEndereco {
  Codigo: number
  CodigoUsuario: number
  TipoLogradouro: string
  Logradouro: string
  Numero: number
  Complemento: string
  NomeBairro: string
  NomeMunicipio: string
  CodigoUF: number
  SiglaUF: string
  CEP: string
  IsPrincipal: boolean
  Ibge: number
  Referencia: string
  Pais: string
  RecebeCorrespondencia: boolean

};
export interface Endereco {
  Logradouro: string
  Numero: string
  Complemento: string
  Bairro: string
  Cidade: string
  Estado: Estado
  Cep: string
  Pais: string
};
export interface Estado {
  Id: number;
  Sigla: string;
  Nome: string;
}

export interface Cidade {
  Id: number;
  Nome: string;
  Coordenadas: Coordenadas;
}
