import { get, post } from '../apiBase';
import { NovoPedidoRequest, NovoPedidoResponse, PedidoResumido, Pedido, NovoGedPedidoRequest } from '../../dtos/Pedidos';

const CONTROLLER = 'v1/Pedido/';

async function Listar(status: number, pagina: number): Promise<Array<PedidoResumido>> {
  const url = `${CONTROLLER}Listar/${status}/${pagina}`;
  var result = await get<PedidoResumido>(url, 'Erro ao listar pedidos.');
  return result?.ListaObjeto ?? [];
};

async function Obter(codigoPedido: number): Promise<Pedido> {
  const url = `${CONTROLLER}Obter/${codigoPedido}`;
  var result = await get<Pedido>(url, 'Erro ao obter dados do pedido.');
  return result?.ListaObjeto?.[0] ?? null;
};

async function Cancelar(codigoPedido: number): Promise<boolean> {
  const url = `${CONTROLLER}Cancelar/${codigoPedido}`;
  var result = await post<void, void>(url, null, 'Erro ao cancelar Pedido.');
  return result?.Status === 0;
};

async function SendNovoPedido(data: NovoPedidoRequest): Promise<NovoPedidoResponse> {
  const url = `${CONTROLLER}Novo`;
  var result = await post<NovoPedidoRequest, NovoPedidoResponse>(url, data, 'Erro ao efetuar pedido.');
  return result?.ListaObjeto?.[0] ?? null;
};

async function NovoGedPedido(data: NovoGedPedidoRequest): Promise<boolean> {
  const url = `${CONTROLLER}Novo`;
  var result = await post<NovoGedPedidoRequest, void>(url, data, 'Erro ao efetuar pedido.');
  return result?.Status === 0;
};

const PedidoApi = {
  Listar,
  Obter,
  Cancelar,
  SendNovoPedido,
  NovoGedPedido
};

export default PedidoApi;
