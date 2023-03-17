export function NumberToReais(value?: number | null) {
  return typeof value == 'number' ? 'R$ ' + value.toFixed(2).replace('.', ',') : 'R$ 0,00';
}

export function mascaraCpf(valor: string) {
  return valor?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4") ?? '';
}

export function mascaraCnpj(valor: string) {
  return valor?.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "$1.$2.$3/$4-$5") ?? '';
}

