import { get, post, del } from '../apiBase';
import api from '../apiBaseV2';
import { BloqueioCartaoTrans, CartaoTransporte, CalcularTaxaEntregaViasRequest, SaldoCartao } from '../../dtos/CartaoTransporte';


const CONTROLLER = 'v1/CartaoTransporte/';


async function Listar(): Promise<Array<CartaoTransporte>> {
  const url = `${CONTROLLER}Listar`;
  var result = await get<CartaoTransporte>(url, 'Erro ao buscar cartões.');
  return result?.ListaObjeto ?? [];
};

async function ListarBloqueados(): Promise<Array<CartaoTransporte>> {
  const url = `${CONTROLLER}Bloqueados`;
  var result = await get<CartaoTransporte>(url, 'Erro ao buscar cartões.');
  return result?.ListaObjeto ?? [];
};

async function ObterSaldo(idOperadora: number, idCartao: number, numeroCartao: string): Promise<SaldoCartao> {
  const url = `${CONTROLLER}Saldo`;
  var result = await api.get<SaldoCartao>(url, { idOperadora, idCartao, numeroCartao }, 'Erro ao buscar saldo.');
  return result.data;
};

async function Validar(codCartao: number): Promise<boolean> {
  const url = `${CONTROLLER}Validar`;
  var result = await api.get<boolean>(url, { codCartao }, 'Erro ao buscar cartões.');
  return result.data;
};

async function Favoritar(idCartao: number): Promise<boolean> {
  const url = `${CONTROLLER}Favoritar?idCartao=${idCartao}`;
  var result = await post<void, void>(url, null, 'Erro ao favoritar cartão.');
  return result?.Status === 0;
};

async function Excluir(idCartao: number): Promise<boolean> {
  const url = `${CONTROLLER}Excluir?idCartao=${idCartao}`;
  var result = await del<void>(url, 'Erro ao excluir cartão.');
  return result?.Status === 0;
};

async function Bloquear(request: BloqueioCartaoTrans): Promise<string> {
  const url = `${CONTROLLER}Bloquear`;
  var result = await post<BloqueioCartaoTrans, void>(url, request, 'Erro ao bloquear cartão.');
  return result?.Status === 0 ? result.Mensagem : null;
};
async function CalcularTaxaEntregaVias(request: CalcularTaxaEntregaViasRequest): Promise<number> {
  const url = `${CONTROLLER}CalcularTaxaEntregaVias`;
  var result = await api.post<{ Taxa: number }>(url, request, 'Erro ao calcular taxa de entrega.');
  return result.data?.Taxa;
};

async function ValidarSolicitacaoVias(idOperadora: number, idTipoCartao: number, tipoSolicitacao: number): Promise<boolean> {
  const url = `${CONTROLLER}ValidarSolicitacaoVias`;
  var result = await api.get(url, { idOperadora, idTipoCartao, tipoSolicitacao }, 'Erro ao validar solicitação.');
  return result.isSucess;
};
async function ObterMensagemVias(idOperadora: number, idPosto: number, idVia: number, isEntrega: boolean): Promise<string> {
  const url = `${CONTROLLER}ObterMensagemVias`;
  var result = await api.get<string>(url, { idOperadora, idPosto, idVia, isEntrega }, 'Erro ao buscar mensagem.');
  return result.data;
};

const CartaoTransporteApi = {
  Listar,
  ListarBloqueados,
  Favoritar,
  Excluir,
  Bloquear,
  Validar,
  CalcularTaxaEntregaVias,
  ValidarSolicitacaoVias,
  ObterMensagemVias,
  ObterSaldo,
};

export default CartaoTransporteApi;
