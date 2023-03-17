import { Endereco } from 'dtos/endereco';
import API from '../apiBaseV2';

const CONTROLLER = 'v1/Endereco/';

async function ObterPorCep(cep: string): Promise<Endereco> {
  const url = `${CONTROLLER}CEP`;
  var result = await API.get<Endereco>(url, { cep }, 'Erro ao obter endereço.');
  return result.data;
};


const EnderecoApi = {
  ObterPorCep
};

export default EnderecoApi;
