import { PostoDeAtendimento } from 'dtos/postoDeAtendimento';
import API from '../apiBaseV2';

const CONTROLLER = 'v1/PostoAtendimento/';

async function Listar(idOperadora: number): Promise<PostoDeAtendimento[]> {
  const url = `${CONTROLLER}Listar`;
  var result = await API.get<PostoDeAtendimento[]>(url, { idOperadora }, 'Erro ao obter Recarga Automática.');
  return result.data ?? [];
};

const PostoAtendimentoApi = {
  Listar
};

export default PostoAtendimentoApi;
