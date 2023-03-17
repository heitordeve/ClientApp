import { post } from '../apiBase';
import api from '../apiBaseV2';
import { DadosUsoCartao } from '../../dtos/usuarios';

const CONTROLLER = 'v1/Usuario/';


async function EditarDadosObrigatoriosCartao(request: DadosUsoCartao): Promise<boolean> {
  const url = `${CONTROLLER}EditarDadosObrigatoriosCartao`;
  var result = await post<DadosUsoCartao, void>(url, request, 'Erro ao enviar dados.');
  return result?.Status === 0;
};
async function RecuperarSenha(senha: string, token: string): Promise<boolean> {
  const url = `${CONTROLLER}RecuperarSenha`;
  var result = await api.post<void>(url, { senha, token }, 'Erro ao enviar dados.');
  return result?.isSucess;
};

const UsuarioApi = {
  EditarDadosObrigatoriosCartao,RecuperarSenha
};

export default UsuarioApi;
