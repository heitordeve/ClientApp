import React, { useCallback, useRef, useState } from 'react';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import Button from '../../ui/button';
import Input from '../../ui/input';
import api from '../../../services/api';
import { useAuth } from '../../../hooks/auth';
import { useAlert } from '../../../hooks/alert';
import getValidationErrors from '../../../utils/getValidationErrors';
import Loading from '../../ui/loading';
import { useHistory } from 'react-router-dom';

interface CardFormData {
  nomeCartao: string;
}

interface EditCardProps {
  codeUserNumber?: number;
}

const EditCard: React.FC<EditCardProps> = ({ codeUserNumber }) => {
  const formRef = useRef<FormHandles>(null);
  const { user } = useAuth();
  const { addAlert } = useAlert();
  const history = useHistory()

  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback((data: CardFormData) => {
    formRef.current?.setErrors({});
    Yup.object().shape({
      nomeCartao: Yup.string().required('Nome ou apelido do cartão de transporte é obrigatório')
            .max(20,'Limite de 20 caracteres para o Nome ou apelido do cartão de transporte'),
    }).validate(data, {
      abortEarly: false,
    }).then(({ nomeCartao }) => {
      setLoading(true);
      api.post(`/KimMais.Api.EditarCartao/${user.TokenUsuario}/${user.CodigoUsuario}`, {
        CodigoUsuarioCartao: codeUserNumber,
        NomeCartao: nomeCartao,
      }).then(response => {
        if (response.data.Status === 0) {
          addAlert({
            title: 'Sucesso',
            description: 'Cartão alterado com sucesso!',
            type: 'success'
          });
          history.go(0);
        } else {
          addAlert({
            title: 'Erro',
            description: 'Erro ao editar cartão, tente mais tarde',
            type: 'error'
          });
        }
      });
    }).catch(error => {
      setLoading(false);
      if (error instanceof Yup.ValidationError) {
        formRef.current?.setErrors(getValidationErrors(error));
        setTimeout(() => { formRef.current?.setErrors({}); }, 3000);
      } else {
        window.scrollTo(0, 0);
        addAlert({
          title: 'Erro',
          description: 'Erro ao editar cartão, tente mais tarde',
          type: 'error'
        });
      }
    });
  },
    [user, history, codeUserNumber, addAlert],
  );
  return (
    <>
      <Loading loading={loading} />
      <Form onSubmit={handleSubmit} ref={formRef} style={{ marginTop: '30px' }}>
        <div>
          <h3 className="text-center">Editar cartão</h3>
          <Input
            name="nomeCartao"
            props={{ placeholder: 'Nome ou apelido do cartão de transporte', type: 'text' }}
          />
          <Button style={{
            height: '50px',
          }} type="submit">Salvar</Button>
        </div>
      </Form>
    </>
  );
};

export default EditCard;
