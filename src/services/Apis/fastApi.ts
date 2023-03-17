import { get, post } from '../apiBase';
import { PedidoFast, ValidacaoComprovanteRequest } from '../../dtos/Fast';

const CONTROLLER = 'v1/Fast/';



async function Obter(codigoPedido: number): Promise<PedidoFast> {
  const url = `${CONTROLLER}Obter/${codigoPedido}`;
  var result = await get<PedidoFast>(url, 'Erro ao obter dados.');
  return result?.ListaObjeto?.[0] ?? null;
};
async function ObterGateway(cashIn: boolean): Promise<PedidoFast> {
  const url = `${CONTROLLER}ObterGateway/?idCashIn=${cashIn}`;
  var result = await get<PedidoFast>(url, 'Erro ao obter dados.');
  return result?.ListaObjeto?.[0] ?? null;
};

async function Validar(dadosComprovante: ValidacaoComprovanteRequest): Promise<boolean> {
  const url = `${CONTROLLER}Validar`;
  var result = await post<ValidacaoComprovanteRequest, void>(url, dadosComprovante, 'Erro ao enviar comprovante.');
  return [0, 200, 204].includes(result?.Status);
};

const FastApi = {
  Obter,
  ObterGateway,
  Validar
};

export default FastApi;
