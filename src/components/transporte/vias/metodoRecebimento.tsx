import React, { useCallback, useRef } from 'react';
import { FormControl } from '@material-ui/core';

import { BodyP, Title, Subtitle, Small } from 'components/ui/typography';
import { Column, Row } from 'components/ui/layout';

import { useVias } from './viasHook';
import { RadioLabel, RadioGroup } from 'components/ui/radio';
import Button from 'components/ui/button';
import PrimeiraViaTrasportValid from 'validations/PrimeiraViaTrasportValid';
import { Form } from 'components/ui/form';
import { FormHandles } from '@unform/core';
import { IcRetirada, IcEntrega } from 'components/ui/icons';
import { IconType } from 'react-icons';
import { EFormaDeEntrega } from 'enuns/formaDeEntrega';

interface metodo {
  icon: IconType;
  titulo: string;
  descricao: String;
  value: number;
}
const metodos: metodo[] = [
  {
    icon: IcRetirada,
    titulo: 'Retirar no posto de atendimento',
    descricao: 'Sem taxa de entrega',
    value: EFormaDeEntrega.Retirada,
  },
  {
    icon: IcEntrega,
    titulo: 'Receber em casa',
    descricao: 'Valor da entrega: INSIRA SEU ENDEREÇO',
    value: EFormaDeEntrega.Entrega,
  },
];

const MetodoRecebimento: React.FC = () => {
  const { onNext, setFormaDeEntrega } = useVias();
  const formRef = useRef<FormHandles>(null);

  const onSubmit = useCallback(
    async (data: { tipoRecebimento: EFormaDeEntrega }) => {
      data.tipoRecebimento = Number(data.tipoRecebimento);
      const valido = await PrimeiraViaTrasportValid.ValidarTipoEntrega(data, formRef);
      if (valido) {
        setFormaDeEntrega({ Tipo: data.tipoRecebimento });
        onNext();
      }
    },
    [setFormaDeEntrega, onNext],
  );

  return (
    <Form ref={formRef} onSubmit={onSubmit}>
      <Column gap="6px" flex="1">
        <Title justify="center">Método de recebimento</Title>
        <BodyP justify="center">
          Qual o tipo de documento de verificação você deseja utilizar em sua solicitação?
        </BodyP>
        <FormControl>
          <RadioGroup ariaLabel="Tipo de recebimento" name="tipoRecebimento">
            {metodos.map(m => (
              <RadioLabel
                key={m.value}
                value={m.value.toString()}
                label={
                  <Row align="center" gap="8px">
                    <m.icon color="primary" />
                    <Column>
                      <Subtitle>{m.titulo}</Subtitle>
                      <Small>{m.descricao}</Small>
                    </Column>
                  </Row>
                }
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Column>
      <Button type="submit">Próximo</Button>
    </Form>
  );
};

export default MetodoRecebimento;
