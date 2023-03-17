import { Estado } from 'dtos/endereco';
import API from '../apiBaseV2';

const CONTROLLER = 'v1/Estado/';

async function Obter(idOperadora: number): Promise<Estado> {
  const url = `${CONTROLLER}Obter`;
  var result = await API.get<Estado>(url, { idOperadora }, 'Erro ao obter estado.');
  return result.data;
};
async function Listar(): Promise<Estado[]> {
  const url = `${CONTROLLER}Listar`;
  var result = await API.get<Estado[]>(url, {}, 'Erro ao listar estados.');
  return result.data ?? [];
};

const EstadoApi = {
  Obter, Listar
};

export default EstadoApi;
