import { post } from "../apiBase";
import qs from 'qs';
import { Usuario } from "../../dtos/usuarios";

const CONTROLLER = 'v1/Autenticacao/'

async function Autenticar(email: string, senha: string): Promise<Usuario> {
  const url = `${CONTROLLER}Autenticar`;
  var result = await post<string, Usuario>(url, qs.stringify({ email, senha }), 'Erro ao autenticar.');
  return result?.ListaObjeto?.[0] ?? null;
};


async function AutenticarGoogle(token: string, codCanal: string): Promise<Usuario> {
  const url = `${CONTROLLER}Autenticar`;
  var result = await post<string, Usuario>(url, qs.stringify({ token, codCanal }), 'Erro ao autenticar.');
  return result?.ListaObjeto?.[0] ?? null;
};

async function VerificarSessao(): Promise<Usuario> {
  const url = `${CONTROLLER}VerificarSessao`;
  var result = await post<void, Usuario>(url, null, 'Erro ao autenticar.');
  return result?.ListaObjeto?.[0] ?? null;
};


async function RecuperarSenha(email: string): Promise<void> {
  const url = `${CONTROLLER}RecuperarSenha/${email}`;
  await post<null, Usuario>(url, null, 'Erro ao autenticar.');
};

const AutenticacaoApi = {
  Autenticar,
  AutenticarGoogle,
  RecuperarSenha,
  VerificarSessao
};

export default AutenticacaoApi;
