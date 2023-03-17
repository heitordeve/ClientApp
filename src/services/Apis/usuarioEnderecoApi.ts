import { get } from "../apiBase";
import { UsuarioEndereco } from "../../dtos/endereco";

const CONTROLLER = 'v1/UsuarioEndereco/'

async function Listar(): Promise<UsuarioEndereco[]> {
  const url = `${CONTROLLER}Listar`;
  var result = await get<UsuarioEndereco>(url, 'Erro ao listar Endereços');
  return result.ListaObjeto ?? [];
};

const UsuarioEnderecoApi = {
  Listar
};

export default UsuarioEnderecoApi;
