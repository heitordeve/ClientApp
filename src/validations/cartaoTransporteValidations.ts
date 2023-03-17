import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import BaseValidations from './baseValidations';

const EnvioComprovante = (recargaMim: number, recargaMax: number) => (Yup.object()
  .required()
  .shape({
    OutroValor: Yup.string()
      .required()
      .test(
        'valorValido',
        `Digite um valor entre R$ ${recargaMim} e R$ ${recargaMax}`,
        value => {
          const num = Number(value.replace(/[^,\d]/g, '').replace(',', '.'));
          return num.between(recargaMim, recargaMax);

        }
      ),
  }));

const ValidarRecarga = async (data: { OutroValor?: string }, refForm: React.MutableRefObject<FormHandles>, recargaMim: number, recargaMax: number) => await BaseValidations.validar(EnvioComprovante(recargaMim, recargaMax), data, refForm)

const CartaoTransporteValid = {
  ValidarRecarga
}
export default CartaoTransporteValid;
