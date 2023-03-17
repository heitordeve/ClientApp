import { RecargaAutomatica } from 'dtos/Recarga';
import API from '../apiBaseV2';

const CONTROLLER = 'v1/RecargaAutomatica/';

async function Obter(codCartaoTransporte: number): Promise<RecargaAutomatica> {
  const url = `${CONTROLLER}Obter`;
  var result = await API.get<RecargaAutomatica>(url, { codCartaoTransporte }, 'Erro ao obter Recarga Automática.');
  return result.data;
};

const RecargaAutomaticaApi = {
  Obter
};

export default RecargaAutomaticaApi;
