import * as Yup from 'yup';
import BaseValidations, { FormRef } from './baseValidations';
import { DadosUsoCartao } from '../dtos/usuarios';


const dadosUsoCartao = Yup.object<DadosUsoCartao>()
  .required()
  .shape({
    DataNascimentoUsuario: Yup.date().required('Data é obrigatória').nullable().max(new Date().addYears(-18), 'Você deve ter mais de 18 anos'),
    SexoUsuario: BaseValidations.sexo(),
    NomeMae: BaseValidations.nome()
  });


const validardadosUsoCartao = async (data: DadosUsoCartao, refForm: FormRef) => await BaseValidations.validar(dadosUsoCartao, data, refForm)

const UsuarioValid = {
  validardadosUsoCartao
}
export default UsuarioValid;
