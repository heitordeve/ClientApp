

const typoPagamento = new Map<number, string>();
typoPagamento.set(1, 'Cartão de crédito');
typoPagamento.set(2, 'Cartão de débito')
typoPagamento.set(3, 'Boleto')
typoPagamento.set(4, 'Transferência')
typoPagamento.set(5, 'Depósito')
typoPagamento.set(6, 'Ressarcimento')
typoPagamento.set(7, 'Resgate')
typoPagamento.set(10, 'Carteira digital')
typoPagamento.set(14, 'Pix')
export const getNomeTipoPagamento = (codPagamento: number): string => {
  return typoPagamento.get(codPagamento);
}

const NomeStatusPagamento = new Map<number, string>();
NomeStatusPagamento.set(1, 'Em Aberto');
NomeStatusPagamento.set(2, 'Finalizado')
NomeStatusPagamento.set(3, 'Cancelado')
NomeStatusPagamento.set(4, 'Pedido Registrado')
NomeStatusPagamento.set(5, 'Pagamento Recusado')
NomeStatusPagamento.set(6, 'Pagamento Recebido')
NomeStatusPagamento.set(7, 'Recarga Disponível')
export const getNomeStatusPagamento = (codStatus: number): string => {
  return NomeStatusPagamento.get(codStatus);
}
