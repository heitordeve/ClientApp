import * as Yup from 'yup';
import { validateCVV } from '../utils/inputValidator';

const cvv = Yup.string()
  .required()
  .test(
    'validar',
    'Número deve conter 3 ou 4 dígitos',
    validateCVV,
  );

const CartaoCreditoValid = {
  cvv
}
export default CartaoCreditoValid;

