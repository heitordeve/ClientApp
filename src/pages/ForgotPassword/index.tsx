import React, { useCallback, useState } from 'react';
import Modal from 'react-modal';
import { Form } from '@unform/web';
import { IoMdClose } from 'react-icons/io';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Container, FormContainer, Content } from './styles';
import esqueciSenha from '../../assets/esqueciSenha.png';
import iconCheckModal from '../../assets/iconCheckModal.png';
import Input from '../../components/ui/input';
import Button from '../../components/ui/button';
import { useAlert } from '../../hooks/alert';
import Loading from '../../components/ui/loading';
import { backgroundPrimary } from 'styles/consts';

Modal.setAppElement('#root');

interface ForgotPasswordFormData {
  email: string;
}

const isSmallWidth = window.matchMedia('(max-width: 1000px)').matches;

const isSmallHeight = window.matchMedia('(max-height: 500px)').matches;

const customStyles = {
  content: isSmallWidth
    ? {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        width: '90vmin',
        heigth: '90vmin',
        background: '#672ED7',
        color: '#FFFFFF',
        borderRadius: '15px',
        overflow: 'visible',
        padding: '8px',
      }
    : {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '480px',
        background: '#672ED7',
        color: '#FFFFFF',
        borderRadius: '15px',
        overflow: 'visible',
      },
};

const ForgotPassword: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addAlert } = useAlert();

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      setLoading(true);
      try {
        await api
          .get(`KimMais.Api.Login/EsqueciSenha/${data.email.replace('@', '%40')}`)
          .then(response => {
            setLoading(false);
            if (response.data.Status === 0) {
              setIsOpen(true);
            } else {
              addAlert({
                type: 'error',
                title: 'Erro no envio',
                description: `${response.data.Mensagem}`,
              });
            }
          });
      } catch (error) {
        addAlert({
          type: 'error',
          title: 'Erro Interno',
          description: error,
        });
      }
    },
    [addAlert],
  );

  return (
    <Container>
      <Loading loading={loading} />
      <Content>
        <div>
          <img className="img" src={esqueciSenha} alt="imagem esqueci a senha" />
        </div>
        <div>
          <p>
            Para recuperar sua senha é<br />
            super fácil, basta apenas informar seu e-mail abaixo e<br />
            seguir o passo a passo.
          </p>
        </div>
        <FormContainer>
          <Form onSubmit={handleSubmit}>
            <div className="input-form">
              <Input
                name="email"
                props={{ type: 'email', placeholder: 'Digite aqui seu e-mail' }}
                styles={{ borderRadius: 4, height: 38 }}
              />
              <p>Exemplo: nome@outlook.com</p>
            </div>
            <div className="button-form">
              <Button
                style={{ background: backgroundPrimary, borderRadius: 4, height: 42, padding: 0 }}
                type="submit"
              >
                Entrar
              </Button>
            </div>
          </Form>
        </FormContainer>
        <Modal
          style={customStyles}
          isOpen={isOpen}
          onRequestClose={() => setIsOpen(false)}
          contentLabel="Example Modal"
        >
          <IoMdClose
            onClick={() => setIsOpen(false)}
            size={20}
            style={{
              color: '#672ED7',
              top: '-22',
              display: 'block',
              float: 'right',
              position: 'relative',
              right: '-43px',
              cursor: 'pointer',
            }}
          />

          <div className="d-flex justify-content-center align-items-center flex-wrap flex-column pr-2 pl-2 pt-4 pb-4">
            <h3
              style={{ fontSize: '20px' }}
              className="font-weight-bold text-center mb-4 pl-4 pr-4"
            >
              Prontinho seu e-mail foi enviado com sucesso, Obrigado!
            </h3>
            <img
              alt={iconCheckModal}
              style={{
                display: isSmallHeight ? 'none' : '',
                maxWidth: '150px',
              }}
              className=""
              src={iconCheckModal}
            />
            <p style={{ fontSize: '14px' }} className="text-center mt-4">
              Agora basta verificar seu e-mail em sua caixa de entrada ou na caixa de spam e seguir
              nosso passo a passo de recuperação de e-mail
            </p>
            <Link to="" style={isSmallWidth ? { width: '100%' } : {}}>
              <Button
                className="font-weight-bold"
                style={
                  isSmallWidth
                    ? {
                        background: '#D9D0F8',
                        color: '#672ED7',
                      }
                    : {
                        background: '#D9D0F8',
                        color: '#672ED7',
                        width: '350px',
                      }
                }
                onClick={() => setIsOpen(false)}
              >
                Ok
              </Button>
            </Link>
          </div>
        </Modal>
      </Content>
    </Container>
  );
};

export default ForgotPassword;
