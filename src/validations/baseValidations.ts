import { FormHandles } from '@unform/core';
import { ExecOptions } from 'child_process';
import * as Yup from 'yup';
import getValidationErrors from '../utils/getValidationErrors';

export type FormRef = React.MutableRefObject<FormHandles>;


const toMoney = (value: string) => {
  const result = value?.replace(/[^,\d]/g, '')?.replace(',', '.') ?? 0;
  return result;
}
const money = (mensagen: string) => Yup.string()
  .required(mensagen)
  .test('validValue', 'Informe um valor válido', value => {
    return (Number(toMoney(value)) > 0)
  })
  .transform(value => {
    return toMoney(value)
  });
const alpha = (mensagen?: string) => Yup.string().matches(/^[0-9]+$/, mensagen ?? "Must be only digits");

function sexo(mensagen?: string) {
  return Yup.string()
    .required('Infome o sexo')
    .test('validSexo', mensagen ?? 'Informe um valor válido', value => {
      return ['M', 'F', 'N', 'O'].includes(value);
    });
}

const nome = (mensagen?: string) => Yup.string()
  .matches(/^[a-zA-Zà-úÀ-Ú\s]+$/, mensagen ?? "O nome só pode conter letras")
  .test('validNome', mensagen ?? 'Informe o nome completo', value => value.trim().split(/\s+/).length > 1);


const validar = async (yup: Yup.Schema<object, object>, obj: object, refForm: FormRef): Promise<boolean> => {
  try {
    await yup.validate(obj, { abortEarly: false })
    return true;
  } catch (error) {
    onErro(error, refForm);
    return false;
  }
}
const onErro = (error: ExecOptions, refForm: FormRef) => {
  if (error instanceof Yup.ValidationError) {
    const errors = getValidationErrors(error);
    refForm.current?.setErrors(errors);
    setTimeout(() => { refForm.current?.setErrors({}); }, 3000);
  }
}
const BaseValidations = {
  money,
  sexo,
  nome,
  validar,
  onErro,
  alpha
}
export default BaseValidations;
