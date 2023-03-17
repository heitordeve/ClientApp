import { ConsultaRevalidacaoEstudanteResult } from 'dtos/revalidacaoCartaoEstudante';
import API from '../apiBaseV2';

const CONTROLLER = 'v1/RevalidacaoCartaoEstudante/';

async function Consulta(codigoCartaoTransporte: number): Promise<ConsultaRevalidacaoEstudanteResult> {
  const url = `${CONTROLLER}Consulta`;
  var result = await API.get<ConsultaRevalidacaoEstudanteResult>(url, { codigoCartaoTransporte }, `Erro ao consultar revalidação`);
  return result.data;
};
async function Novo(CodigoDoPedido: number, Documento64: string): Promise<boolean> {
  const url = `${CONTROLLER}Novo`;
  var result = await API.post<void>(url, { CodigoDoPedido, Documento64 }, `Erro ao efetuar pedido de revalidação`);
  return result.isSucess;
};

const RevalidacaoCartaoEstudanteApi = {
  Novo, Consulta
};

export default RevalidacaoCartaoEstudanteApi;
