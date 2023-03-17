import React, { useCallback, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import api from 'services/api';
import { useAuth, useAlert } from 'hooks';

import Button from 'components/ui/button';
import Input from 'components/ui/input/v2';
import getValidationErrors from 'utils/getValidationErrors';
import Modal from 'components/ui/modal';
import { Column, Row } from 'components/ui/layout';
import { CartaoTransporte } from 'dtos/CartaoTransporte';

interface CardFormData {
  nomeCartao: string;
}

interface EditCardProps {
  card: CartaoTransporte;
  onClose: () => void;
}

const ModalEditar: React.FC<EditCardProps> = ({ card, onClose }) => {
  const formRef = useRef<FormHandles>(null);
  const { user } = useAuth();
  const { addAlert } = useAlert();
  const history = useHistory();

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(
    (data: CardFormData) => {
      formRef.current?.setErrors({});
      Yup.object()
        .shape({
          nomeCartao: Yup.string()
            .required('Nome ou apelido do cartão de transporte é obrigatório')
            .max(20, 'Limite de 20 caracteres para o Nome ou apelido do cartão de transporte'),
        })
        .validate(data, {
          abortEarly: false,
        })
        .then(({ nomeCartao }) => {
          setLoading(true);
          api
            .post(`/KimMais.Api.EditarCartao/${user.TokenUsuario}/${user.CodigoUsuario}`, {
              CodigoUsuarioCartao: card.Codigo,
              NomeCartao: nomeCartao,
            })
            .then(response => {
              setLoading(false);
              if (response.data.Status === 0) {
                addAlert({
                  title: 'Sucesso',
                  description: 'Cartão alterado com sucesso!',
                  type: 'success',
                });
                history.go(0);
              } else {
                addAlert({
                  title: 'Erro',
                  description: 'Erro ao editar cartão, tente mais tarde',
                  type: 'error',
                });
              }
            });
        })
        .catch(error => {
          setLoading(false);
          if (error instanceof Yup.ValidationError) {
            formRef.current?.setErrors(getValidationErrors(error));
            setTimeout(() => {
              formRef.current?.setErrors({});
            }, 3000);
          } else {
            window.scrollTo(0, 0);
            addAlert({
              title: 'Erro',
              description: 'Erro ao editar cartão, tente mais tarde',
              type: 'error',
            });
          }
        });
    },
    [user, history, card, addAlert],
  );
  return (
    <Modal
      loading={loading}
      onClose={onClose}
      title="Editar cartão"
      minWidth="350px"
      padding="30px"
    >
      <Form onSubmit={handleSubmit} ref={formRef} style={{ flex: 1 }}>
        <Column gap="12px">
          <Input name="nomeCartao" placeholder="Nome ou apelido do cartão de transporte" />
          <Row gap="12px">
            <Button color="secondary" onClick={() => onClose()}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </Row>
        </Column>
      </Form>
    </Modal>
  );
};

export default ModalEditar;
