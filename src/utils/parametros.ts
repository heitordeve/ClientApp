const {
  REACT_APP_VENDA_QRCODE,
  REACT_APP_VALIDAR_USER_CARTAO,
  REACT_APP_MEU_ONIBUS,
  REACT_APP_PRIMEIRA_VIA,
  REACT_APP_SEGUNDA_VIA,
  REACT_APP_IS_PROD,
  REACT_APP_KIM_BFF,
  REACT_APP_KIM_APIS } = process.env;

const isTrue = (parm: string) => parm === 'true'
const Parametros = {
  vendaQrcodeAtivo: isTrue(REACT_APP_VENDA_QRCODE),
  validaUauarioCartao: isTrue(REACT_APP_VALIDAR_USER_CARTAO),
  meuOnibusAtivo: isTrue(REACT_APP_MEU_ONIBUS),
  primeiraViaAtivo: isTrue(REACT_APP_PRIMEIRA_VIA),
  segundaViaAtivo: isTrue(REACT_APP_SEGUNDA_VIA),
  isProd: isTrue(REACT_APP_IS_PROD),
  apiBff: REACT_APP_KIM_BFF,
  apiLegado: REACT_APP_KIM_APIS
}
export default Parametros;
