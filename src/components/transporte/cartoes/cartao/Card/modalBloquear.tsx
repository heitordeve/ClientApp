import React, { useCallback, useState, useRef } from 'react';

import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import { alertService, useAlert } from 'hooks/alert';
import getValidationErrors from 'utils/getValidationErrors';

import Input from 'components/ui/input/v2';
import Button from 'components/ui/button';
import { Column } from 'components/ui/layout';

import { CartaoTransporte } from 'dtos/CartaoTransporte';
import { CartaoTransporteApi } from 'services/apis';
import Modal from 'components/ui/modal';

interface TrasnportCardProps {
  card: CartaoTransporte;
  onClose: () => void;
}

interface PasswordFormData {
  password: string;
}

const ModalBloquear: React.FC<TrasnportCardProps> = ({ card, onClose }) => {
  const { addAlert } = useAlert();
  const [loading, setLoading] = useState<boolean>(false);
  const history = useHistory();
  const formRef = useRef<FormHandles>(null);

  const handleSubmitBlock = useCallback(
    async (data: PasswordFormData) => {
      formRef.current?.setErrors({});
      Yup.object()
        .shape({
          password: Yup.string().required('Senha obrigatória'),
        })
        .validate(data, {
          abortEarly: false,
        })
        .then(async value => {
          setLoading(true);
          const bloquaeio = await CartaoTransporteApi.Bloquear({
            CodigoUsuarioCartao: card.Codigo,
            Senha: value.password,
          });
          if (bloquaeio) {
            alertService.info('Bloqueio de cartão', bloquaeio);
            window.scrollTo(0, 0);
            onClose();
            history.go(0);
          } else {
            window.scrollTo(0, 0);
          }
          setLoading(false);
        })
        .catch(error => {
          setLoading(false);
          if (error instanceof Yup.ValidationError) {
            formRef.current?.setErrors(getValidationErrors(error));
            setTimeout(() => {
              formRef.current?.setErrors({});
            }, 3000);
          } else {
            addAlert({
              type: 'error',
              title: 'Erro',
              description: 'Erro ao buscar dados de Bloqueio Cartão, tente mais tarde',
            });
          }
        });
    },
    [card, history, addAlert,onClose],
  );

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      loading={loading}
      title="Bloquear Cartão"
      minWidth="350px"
    >
      <Form onSubmit={handleSubmitBlock} ref={formRef} style={{ margin: '30px' }}>
        <Column justify="center" gap="12px">
          <Input name="password" placeholder="Senha usuário" type="password" />
          <Button type="submit">Bloquear</Button>
          <Button theme="light" onClick={() => onClose()}>
            Cancelar
          </Button>
        </Column>
      </Form>
    </Modal>
  );
};

export default ModalBloquear;
