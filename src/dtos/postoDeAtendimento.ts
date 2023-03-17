import { Endereco } from "./endereco";


export interface PostoDeAtendimento {
  Id: number;
  Nome: string;
  Telefone: string;
  Inativo: boolean;
  Endereco: Endereco;
}
