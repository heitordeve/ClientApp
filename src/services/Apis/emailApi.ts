import { post } from '../apiBase';
const CONTROLLER = 'v1/Email/';



async function EnvioBoleto(codigoPedido: number): Promise<boolean> {
  const url = `${CONTROLLER}EnvioBoleto?codigoPedido=${codigoPedido}`;
  var result = await post<void, void>(url, null, 'Erro ao enviar Email.');
  return result?.Status === 0;
};

const EmailApi = {
  EnvioBoleto,
};

export default EmailApi;
