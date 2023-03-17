import { get } from '../apiBase';
import { OperadoraTranspote } from '../../dtos/operadorasTrasporte';

const CONTROLLER = 'v1/Operadoraransporte/';


async function Listar(latitude: number, longitude: number): Promise<OperadoraTranspote[]> {
  const url = `${CONTROLLER}Listar?latitude=${latitude}&longitude=${longitude}`;
  var result = await get<OperadoraTranspote>(url, 'Erro ao listar operadoras de transporte.');
  return result?.ListaObjeto ?? [];
};


const OperadoraTranspoteApi = {
  Listar
};

export default OperadoraTranspoteApi;
