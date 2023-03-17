import { get } from '../apiBase';
import { Cidade } from '../../dtos/cidades';


const CONTROLLER = 'v1/Cidade/';


async function Listar(): Promise<Array<Cidade>> {
  const url = `${CONTROLLER}Listar`;
  var result = await get<Cidade>(url, 'Erro ao Listar Cidades.');
  return result?.ListaObjeto;
};

const CidadeApi = {
  Listar,
};

export default CidadeApi;
