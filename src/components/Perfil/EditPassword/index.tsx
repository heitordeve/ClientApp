import React, { useState, useCallback, useRef } from 'react';

//services
import api from '../../../services/api';

//hooks
import { useAuth } from '../../../hooks/auth';

//componets
import Modal from 'react-modal'
import Input from '../../ui/input';
import Button from '../../ui/button';
import Loading from '../../ui/loading';
import { FormGroup } from 'reactstrap';
import { Form } from '@unform/web';

import * as Yup from 'yup';

import { FormHandles } from '@unform/core';

import { FormList } from './styles';

import { useAlert } from '../../../hooks/alert';

import getValidationErrors from '../../../utils/getValidationErrors';

import { validatePassword } from '../../../utils/inputValidator';

Modal.setAppElement('#root');

const isSmallWidth = window.matchMedia("(max-width: 1000px)").matches;

const isSmallHeight = window.matchMedia("(max-height: 500px)").matches;

const customStyles = {
  content: isSmallWidth ? {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '90vmin',
    borderRadius: '15px',
    overflow: 'visible',
    padding: '10px 40px',
  }
    :
    {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '480px',
      height: '550px',
      borderRadius: '15px',
      overflow: 'visible',
      paddingLeft: '90px',
      paddingRight: '90px',
    },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',

  },
};

interface PasswordFormData {
  SenhaAntiga: string;
  SenhaNova: string;
}

const EditPassword: React.FC = () => {

  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const formRef = useRef<FormHandles>(null);
  const { addAlert } = useAlert();
  const [loading, setLoading] = useState(false);

  const handleEditPassword = useCallback(
    async (data: PasswordFormData) => {
      setLoading(true);
      await api.post(`KimMais.Api.AlterarSenha/${user.TokenUsuario}/${user.CodigoUsuario}`, {
        'senhaAntiga': data.SenhaAntiga,
        'senhaNova': data.SenhaNova,
      }).then(response => {
        setLoading(false);
        addAlert({
          title: 'Senha:',
          description: response.data.Mensagem,
          type: 'info',
        });
      }).catch(response => {
        setLoading(false);
        addAlert({
          title: 'Error',
          description: response.data.Mensagem,
          type: 'error',
        });
      });
    }, [user, addAlert]);

  const handleSubmit = useCallback(async (data: PasswordFormData) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      formRef.current?.setErrors({});

      const schema = Yup.object()
        .required('dados não cadastrados')
        .shape({
          // #endregion
          SenhaAntiga: Yup.string()
            .required('Informe a senha antiga')
            .test(
              'valid_password',
              'A senha deve conter de 8 a 15 caracteres entre letras e números',
              value => validatePassword(value || ''),
            )
          ,
          SenhaNova: Yup.string()
            .required('Digite uma nova senha')
            .test(
              'valid_password',
              'A senha deve conter de 8 a 15 caracteres entre letras e números',
              value => validatePassword(value || ''),
            )
          ,
          ConfSenhaNova: Yup.string()
            .required('Confirme a nova senha')
            .test(
              'equal_pwd',
              'As senhas não são iguais',
              value => value === data.SenhaNova,
            ),

        });

      await schema
        .validate(data, {
          abortEarly: false,
        })
        .then(value => {
          handleEditPassword({
            SenhaAntiga: value.SenhaAntiga,
            SenhaNova: value.SenhaNova,
          });
          setIsOpen(false);
        });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        formRef.current?.setErrors(errors);
        setTimeout(() => { formRef.current?.setErrors({}); }, 3000);
        addAlert({
          title: 'Error',
          type: 'error',
        });
      }
    }
  }, [formRef, addAlert, handleEditPassword]);

  return (
    <>
      <Button className="btn-atualizar-dados" onClick={() => setIsOpen(true)}>Alterar Senha</Button>
      <Loading loading={loading} />
      <Modal
        style={customStyles}
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        contentLabel="Example Modal"
      >
        <FormList>
          <h3 className="text-center">Alterar Senha</h3>
          <Form className="form" onSubmit={handleSubmit} ref={formRef}>
            <FormGroup className="form-group">
              <Input
                name="SenhaAntiga"
                props={{
                  type: 'password',
                  placeholder: 'Digite sua senha antiga',
                  minLength: 6,
                  maxLength: 15,
                }}
              />
            </FormGroup>
            <FormGroup className="form-group">
              <Input
                name="SenhaNova"
                props={{
                  type: 'password',
                  placeholder: 'Digite sua senha',
                  minLength: 6,
                  maxLength: 15,
                }}
              />
              <Input
                name="ConfSenhaNova"
                props={{
                  type: 'password',
                  placeholder: 'Digite novamente',
                  minLength: 6,
                  maxLength: 15,
                }}
              />
            </FormGroup>
            {isSmallHeight ?
              <div className="d-flex flex-row">
                <div className="mr-1">
                <Button type="submit">
                  Salvar Alterações
                </Button>
                </div>
                <div className="ml-1">
                <Button onClick={() => setIsOpen(false)}
                  color="secondary" >
                  Cancelar
                </Button>
                </div>

              </div>
              :
              <>
                <Button
                  type="submit"
                >
                  Salvar Alterações
                            </Button>
                <Button
                  onClick={() => setIsOpen(false)}
                  color="secondary"
                >
                  Cancelar
                            </Button>
              </>
            }

          </Form>
        </FormList>
      </Modal>
    </>
  )
}

export default EditPassword;
