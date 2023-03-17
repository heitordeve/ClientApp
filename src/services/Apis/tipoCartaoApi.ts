import API from '../apiBaseV2';
import { TipoCartao } from 'dtos/tipoCartao';
import { TipoDocumentoPrimeiraVia } from 'enuns/tipoDocumentoPrimeiraVia';

const CONTROLLER = 'v1/TipoCartao/';

async function Obter(idTipoCartao: number): Promise<TipoCartao> {
  const url = `${CONTROLLER}obter`;
  var result = await API.get<TipoCartao>(url, { idTipoCartao }, 'Erro ao Listar tiops de cartões.');
  return result.data;
};

async function primeiraVia(codigoperadora: number): Promise<TipoCartao[]> {
  const url = `${CONTROLLER}PrimeiraVia`;
  var result = await API.get<TipoCartao[]>(url, { codigoperadora }, 'Erro ao Listar tiops de cartões.');
  return result.data;
};

async function envioDocumento(documentos: { tipoDocumento: TipoDocumentoPrimeiraVia, imagemBase64: string }[]): Promise<boolean> {
  const url = `${CONTROLLER}EnvioDocumento`;
  var result = await API.post<void>(url, documentos, 'Erro ao enviar documentos.');
  return result.isSucess;
};

const TipoCartaoApi = {
  Obter, primeiraVia, envioDocumento
};

export default TipoCartaoApi;
