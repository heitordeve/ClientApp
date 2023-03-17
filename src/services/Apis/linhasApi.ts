import API from '../apiBaseV2';
import { Linha, TipoServico, FavoritarLinhaRequest } from 'dtos/linha';

const CONTROLLER = 'v1/Linhas/';


async function ListarLinhasVigentes(codOperadora: number, isEstacao: boolean): Promise<Linha[]> {
  const url = `${CONTROLLER}ListarPorOperadora/`;
  var result = await API.get<Linha[]>(url, { codOperadora, isEstacao }, 'Erro ao obter dados.');
  if (result) {
    result.data.forEach(l => l.TipoServico = isEstacao ? TipoServico.Estacao : TipoServico.Linha)
  }
  return result.data;
};
async function ListarFavoritos(isEstacao: boolean): Promise<string[]> {
  const url = `${CONTROLLER}ListarFavoritos/`;
  var result = await API.get<string[]>(url, { isEstacao }, 'Erro ao obter dados.');
  return result.data;
};
async function Favoritar(request: FavoritarLinhaRequest): Promise<boolean> {
  const url = `${CONTROLLER}Favoritar/`;
  var result = await API.post<string[]>(url, request, 'Erro ao obter dados.');
  return result.isSucess;
};

const LinhasApi = {
  ListarLinhasVigentes, ListarFavoritos, Favoritar
};

export default LinhasApi;
