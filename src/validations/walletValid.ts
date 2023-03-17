import * as Yup from 'yup';

const senha = Yup.string()
  .required('Informe a senha')
  .min(6, 'Senha deve conter 6 caracteres')
  .max(6, 'Senha deve conter 6 caracteres')
  .test('only numbers', 'Senha só pode conter números', value => {
    return value.replace(/\d/g, '').length === 0;
  });

const walletValid = {
  senha
}
export default walletValid;

