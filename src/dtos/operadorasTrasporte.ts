import { CartaoQrcode } from './cartaoQrcode';
import { CartaoTransporte } from './CartaoTransporte';
import { MaxMin, PosicaoGps } from './geral'
export interface OperadoraTranspote {
  Codigo: number,
  Nome: string,
  Logo: string,
  TemMapa: boolean,
  TemQRCode: boolean,
  TemBloqueio: boolean,
  TemPrimeiraVia: boolean,
  TemSegundaVia: boolean,
  TemRevalidacao: boolean,
  AreaAtuacao: PosicaoGps,
  ValorTarifa: number,
  ValorQrCode: MaxMin<number>,
  CodigoCidade: number
  CartoesUsuario: CartaoTransporte[],
  CartaoQrcode?: CartaoQrcode
}
