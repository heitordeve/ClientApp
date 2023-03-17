import { Notificacao } from 'dtos/notificacao';
import API from '../apiBaseV2';

const CONTROLLER = 'v1/Notificacao/';

async function Listar(): Promise<Notificacao[]> {
  const url = `${CONTROLLER}Listar`;
  var result = await API.get<Notificacao[]>(url, {}, `Erro ao buscar notificações`);
  return result.data;
};
async function Excluir(idNotificacao?: number): Promise<boolean> {
  const url = `${CONTROLLER}Excluir/` + (idNotificacao ?? '');
  var result = await API.delete<void>(url, {}, `Erro ao excluir notificação`);
  return result.isSucess;
};

const NotificacaoApi = {
  Listar, Excluir
};

export default NotificacaoApi;
