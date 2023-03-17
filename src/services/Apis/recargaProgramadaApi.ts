import { RecargaProgramada } from 'dtos/Recarga';
import API from '../apiBaseV2';

const CONTROLLER = 'v1/RecargaProgramada/';

async function Obter(codCartaoTransporte: number): Promise<RecargaProgramada> {
  const url = `${CONTROLLER}Obter`;
  var result = await API.get<RecargaProgramada>(url, { codCartaoTransporte }, 'Erro ao obter Recarga programada.');
  return result.data;
};

const RecargaAutomaticaApi = {
  Obter
};

export default RecargaAutomaticaApi;
