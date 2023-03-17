import { FaqCategoria } from 'dtos/faq';
import API from '../apiBaseV2';

const CONTROLLER = 'v1/Faq/';

async function Listar(): Promise<FaqCategoria[]> {
  const url = `${CONTROLLER}Listar`;
  var result = await API.get<FaqCategoria[]>(url, { }, `Erro ao buscar notificações`);
  return result.data ?? [];
};
async function Avaliar(idPergunta: number, isCurtir: boolean): Promise<boolean> {
  const url = `${CONTROLLER}Avaliar/`;
  var result = await API.post<void>(url, { idPergunta, isCurtir }, `Erro ao excluir notificação`);
  return result.isSucess;
};

const FaqApi = {
  Listar, Avaliar
};

export default FaqApi;
