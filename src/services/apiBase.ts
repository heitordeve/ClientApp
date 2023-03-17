import axios, { AxiosResponse } from 'axios';
import { alertService } from '../hooks/alert';
import { RX_ISO_DATE } from 'utils/dateUtils';
import { authService } from 'hooks/auth';

const { REACT_APP_KIM_BFF, REACT_APP_API_FILES } = process.env;
export const URL_API_ASSETS = REACT_APP_API_FILES;
interface result<T> {
  Status: number;
  ListaObjeto: T[];
  Mensagem: string;
}

const api = axios.create({
  baseURL: REACT_APP_KIM_BFF,
});
api.interceptors.response.use(originalResponse => {
  handleDates(originalResponse.data);
  return originalResponse;
});
api.interceptors.request.use(function (config) {
  const token = localStorage.getItem('@Kim:tokenAcesso');
  config.headers.Authorization = 'Bearer ' + token;

  return config;
});

function isIsoDateString(value: any): boolean {
  return value && typeof value === 'string' && RX_ISO_DATE.test(value);
}

export function handleDates(body: any) {
  if (body === null || body === undefined || typeof body !== 'object') return body;

  for (const key of Object.keys(body)) {
    const value = body[key];
    if (isIsoDateString(value)) body[key] = new Date(Date.parse(value));
    else if (typeof value === 'object') handleDates(value);
  }
}

async function GetResult<R>(
  promese: Promise<AxiosResponse<result<R>>>,
  errorMsg: string,
  aceptedMsg: Array<string> = [],
): Promise<result<R>> {
  let error = 'Erro ao comunicar com serviço, tente mais tarde';
  let serverErro: string = null;
  try {
    const response = await promese;
    aceptedMsg.push('Sucesso');
    const data = response.data;
    if (data.Status === 0 && (!data.Mensagem || aceptedMsg.includes(data.Mensagem))) {
      return data;
    } else if (data.Status === 0) {
      error = data.Mensagem;
    } else {
      error = data.Mensagem;
    }
  } catch (err) {
    const response = err?.response;
    if (response?.status === 401) {
      authService.logout();
      error = 'Sessão expirada, logue novamente para usar o KIM';
    } else if (response?.status >= 400) {
      serverErro = response.data[0] ?? response.data.Mensagem;
    }
  }
  alertService.error(errorMsg ?? 'Erro', serverErro ?? error);
  return null;
}

export async function get<R>(url: string, errorMsg: string): Promise<result<R>> {
  let promese = api.get(url);
  return GetResult(promese, errorMsg);
}
export async function getParms<R>(
  url: string,
  params: object,
  errorMsg: string,
): Promise<result<R>> {
  let promese = api.get(url, { params });
  return GetResult(promese, errorMsg);
}
export async function del<R>(url: string, errorMsg: string): Promise<result<R>> {
  let promese = api.delete(url);
  return GetResult(promese, errorMsg);
}
export async function post<T, R>(url: string, data: T, errorMsg: string): Promise<result<R>> {
  let promese = api.post(url, data);
  return GetResult(promese, errorMsg);
}
export async function put<T, R>(url: string, data: T, errorMsg: string): Promise<result<R>> {
  let promese = api.put(url, data);
  return GetResult(promese, errorMsg);
}

export async function sendFormUrlEncoded<T, R>(
  url: string,
  data: T,
  errorMsg: string,
): Promise<result<R>> {
  let promese = api.post(url, data);
  return GetResult(promese, errorMsg);
}
