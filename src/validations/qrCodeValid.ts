import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { CompraQRCode } from '../dtos/qrCode';
import BaseValidations from './baseValidations';

const ValidarCompra = async (data: CompraQRCode, refForm: React.MutableRefObject<FormHandles>, min: number, max: number) => {
  const compra = Yup.object()
    .required()
    .shape({
      valorDaCompra: Yup.number().min(min, 'Valor deve ser maior que ' + min).max(max, 'Valor deve ser menor que ' + max)
    });
  return await BaseValidations.validar(compra, data, refForm)
}
const QrCodeValid = {
  ValidarCompra
}
export default QrCodeValid;
