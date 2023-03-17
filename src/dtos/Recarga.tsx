export interface RecargaAutomatica {
  Codigo: number;
  Saldo: number;
  Valor: number;
  CartaoCredito: cartaoCredito;
}
export interface RecargaProgramada {
  Codigo: number;
  Dia: number;
  Valor: number;
  CartaoCredito: cartaoCredito;
}
interface cartaoCredito {
  Codigo: number;
  Bandeira: string;
  Numero: string;
  Nome: string;
}
