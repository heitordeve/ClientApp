import { FormHandles } from '@unform/core';
import { Endereco } from 'dtos/endereco';
import * as Yup from 'yup';
import BaseValidations from './baseValidations';

const EnderecoValid = () => (Yup.object<Endereco>()
  .required()
  .shape({
    Logradouro: Yup.string().required('Informe o logradouro'),
    Numero: Yup.string().required('Informe o número'),
    Bairro: Yup.string().required('Informe o bairro'),
    Cidade: Yup.string().required('Informe a cidade'),
    Estado: Yup.string().required('Informe o estado'),
    Cep: Yup.string().required('Informe o CEP')
      .matches(/^\d{5}-\d{3}$/, 'CEP Inválido')
  }));



const ValidarEndereco = async (data: Endereco, refForm: React.MutableRefObject<FormHandles>) => await BaseValidations.validar(EnderecoValid(), data, refForm)

const EnderecoValidations = {
  ValidarEndereco
}
export default EnderecoValidations;
