import { CartaoQrcode, ListarQrCodeResquest, QrCode, GerarCartaoVirtualRequest, GerarCartaoVirtualResult, GerarQrCodeRequest } from 'dtos/cartaoQrcode';
import { TipoCartao } from 'dtos/tipoCartao';

import { getParms, post } from '../apiBase';
import API from '../apiBaseV2';


const CONTROLLER = 'v1/CartaoQrCode/';


async function ObterPorOperadora(codOperadora: number): Promise<CartaoQrcode> {
  const url = `${CONTROLLER}ObterPorOperadora`;
  var result = await getParms<CartaoQrcode>(url, { codOperadora }, 'Erro ao buscar cartões.');
  return result?.ListaObjeto?.[0];
};

async function BuscaListaTipoCartao(codOperadora: number): Promise<TipoCartao> {
  const url = `${CONTROLLER}BuscaListaTipoCartao`;
  var result = await getParms<TipoCartao>(url, { codOperadora }, 'Erro ao buscar informações do cartão.');
  return result?.ListaObjeto?.[0];
};

async function QrCodeDisponiveis(parms: ListarQrCodeResquest): Promise<QrCode[]> {
  const url = `${CONTROLLER}Listar/QrCodeDisponiveis`;
  var result = await getParms<QrCode>(url, parms, 'Erro ao Listar QRcodes.');
  return result?.ListaObjeto ?? [];
};
async function QrCodeTodosStatus(parms: ListarQrCodeResquest): Promise<QrCode[]> {
  const url = `${CONTROLLER}Listar/QrCodeTodosStatus`;
  var result = await getParms<QrCode>(url, parms, 'Erro ao Listar QRcodes.');
  return result?.ListaObjeto ?? [];
};

async function GerarCartaoVirtual(parms: GerarCartaoVirtualRequest): Promise<GerarCartaoVirtualResult> {
  const url = `${CONTROLLER}GerarCartaoVirtual`;
  var result = await post<GerarCartaoVirtualRequest, GerarCartaoVirtualResult>(url, parms, 'Erro ao Listar QRcodes.');
  return result?.ListaObjeto?.[0];
};
async function GerarQrCode(parms: GerarQrCodeRequest): Promise<QrCode> {
  const url = `${CONTROLLER}GerarQrCode`;
  var result = await API.post<QrCode>(url, parms, 'Erro ao Listar QRcodes.');
  return result.data;
};

const CartaoQrCodeApi = {
  ObterPorOperadora, BuscaListaTipoCartao, QrCodeDisponiveis, QrCodeTodosStatus, GerarQrCode, GerarCartaoVirtual
};

export default CartaoQrCodeApi;
