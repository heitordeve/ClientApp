export interface FaqCategoria {
  id: number
  Titulo: string;
  Perguntas: FaqPergunta[];
}
export interface FaqPergunta {
  Id: number;
  Numero: number;
  Titulo: string;
  Resposta: string;
}
