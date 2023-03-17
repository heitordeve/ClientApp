import * as Yup from 'yup';

const EnvioComprovante = Yup.object()
  .required()
  .shape({
    valueNumber: Yup.string()
      .required('Informe o valor pago!')
      .test('validValue', 'Informe um valor válido', value => {
        return (
          Number(value.replace(/[^,\d]/g, '').replace(',', '.')) > 0
        );
      })
      .transform(value =>
        value.replace(/[^,\d]/g, '').replace(',', '.'),
      ),
  });

const PedidoValid = {
  EnvioComprovante
}
export default PedidoValid;
