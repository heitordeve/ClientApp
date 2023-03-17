import { FormHandles } from '@unform/core';
import { EFormaDeEntrega } from 'enuns/formaDeEntrega';
import * as Yup from 'yup';
import BaseValidations from './baseValidations';

export interface DocumentoModel {
  frente: File,
  verso: File,
  selfie: File,
}

export interface TipoEntregaModel { tipoRecebimento: EFormaDeEntrega }


const DocumentosValid = () => (Yup.object<DocumentoModel>()
  .required()
  .shape({
    frente: Yup.mixed().required('Informe uma foto com a Frente do seu documento'),
    verso: Yup.mixed().required('Informe uma foto com o Verso do seu documento'),
    selfie: Yup.mixed().required('Informe uma foto sua')
  }));

const TipoEntregaValid = () => (Yup.object<DocumentoModel>()
  .required()
  .shape({
    tipoRecebimento: Yup.string().nullable().required('Informe o método de recebimento'),
  }));

const ValidarDocumentos = async (data: DocumentoModel, refForm: React.MutableRefObject<FormHandles>) => await BaseValidations.validar(DocumentosValid(), data, refForm)
const ValidarTipoEntrega = async (data: TipoEntregaModel, refForm: React.MutableRefObject<FormHandles>) => await BaseValidations.validar(TipoEntregaValid(), data, refForm)

const PrimeiraViaTrasportValid = {
  ValidarDocumentos, ValidarTipoEntrega
}
export default PrimeiraViaTrasportValid;
