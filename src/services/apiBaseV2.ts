import axios, { AxiosResponse } from 'axios';
import { alertService } from '../hooks/alert';
import { RX_ISO_DATE } from 'utils/dateUtils';
import { authService } from 'hooks/auth';

const { REACT_APP_KIM_BFF, REACT_APP_API_FILES } = process.env;
export const URL_API_ASSETS = REACT_APP_API_FILES;

interface Result<T> {
  data?: T;
  isSucess: boolean;
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
  promese: Promise<AxiosResponse<R>>,
  errorMsg: string,
): Promise<Result<R>> {
  let error = 'Erro ao comunicar com serviço, tente mais tarde';
  let serverErro: string = null;
  try {
    const response = await promese;
    return { data: response?.data, isSucess: true };
  } catch (err) {
    const response = err?.response;
    if (response?.status === 401) {
      authService.logout();
      error = 'Sessão expirada, logue novamente para usar o KIM';
    } else if (response?.status >= 400) {
      const data = response.data;
      serverErro = typeof data === 'string' ? data : data[0];
    }
  }
  alertService.error(errorMsg ?? 'Erro', serverErro ?? error);
  return { isSucess: false };
}

async function get<R>(url: string, params: object, errorMsg: string): Promise<Result<R>> {
  let promese = api.get(url, { params });
  return GetResult(promese, errorMsg);
}
async function del<R>(url: string, params: object, errorMsg: string): Promise<Result<R>> {
  let promese = api.delete(url, { params });
  return GetResult(promese, errorMsg);
}
async function post<R>(url: string, data: object, errorMsg: string): Promise<Result<R>> {
  let promese = api.post(url, data);
  return GetResult(promese, errorMsg);
}
async function put<R>(url: string, data: object, errorMsg: string): Promise<Result<R>> {
  let promese = api.put(url, data);
  return GetResult(promese, errorMsg);
}

const API = {
  get,
  delete: del,
  post,
  put,
};
export default API;
