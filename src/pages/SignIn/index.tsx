import React, { useCallback, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Form } from '@unform/web';
import { Link } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useGoogleLogin, GoogleLoginResponse } from 'react-google-login';
import { useAlert } from '../../hooks/alert';

import { Container, FormContainer, Content, Background } from './styles';
import getValidationErrors from '../../utils/getValidationErrors';
import { useAuth } from '../../hooks/auth';
import kimLogo from '../../assets/logos/kim-logo.svg';
import logoGoogle from '../../assets/feGoogle.svg';
import background from '../../assets/background-sign.svg';
import 'bootstrap/dist/css/bootstrap.min.css';

import Loading from '../../components/ui/loading';
import Input from '../../components/ui/input';
import Button from '../../components/ui/button';
import { Column } from 'components/ui/layout';
import { PATHS } from 'routes/rotas-path';
import { backgroundPrimary, gray2, gray6 } from 'styles/consts';

interface SignInFormData {
  email: string;
  password: string;
}

interface GoogleProfileData {
  email: string;
  name: string;
}

const clientId = '675518189900-ti0tm4q3lbohq3er1a1eort0cudoan0o.apps.googleusercontent.com';

const SignIn: React.FC = () => {
  const history = useHistory<GoogleProfileData>();
  const formRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { signIn, signInGoogle } = useAuth();
  const [type, setType] = useState<'normal' | 'password'>('password');
  const { addAlert } = useAlert();

  const onSuccess = useCallback(
    (responseGoogle: GoogleLoginResponse) => {
      setLoading(true);
      signInGoogle(responseGoogle.tokenId)
        .then(() => {
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          history.push(PATHS.cadastro, responseGoogle.profileObj);
        });
    },
    [history, signInGoogle],
  );

  const onFailure = useCallback(
    (response: any) => {
      addAlert({
        type: 'error',
        title: 'Erro na autenticação',
        description:
          'Ocorreu um erro ao fazer login, verifique sua conta Google ou valide seus dados no aplicativo.',
      });
    },
    [addAlert],
  );

  const googleLogin = useGoogleLogin({
    onSuccess,
    onFailure,
    clientId,
  });

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      formRef.current?.setErrors({});

      Yup.object()
        .shape({
          email: Yup.string(),
          password: Yup.string().required('Senha obrigatória'),
        })
        .validate(data, {
          abortEarly: false,
        })
        .then(() => {
          setLoading(true);
          signIn({
            email: data.email,
            password: data.password,
          })
            .then(() => {
              setLoading(false);
            })
            .catch(() => {
              setLoading(false);
              addAlert({
                type: 'error',
                title: 'Erro na autenticação',
                description:
                  'Ocorreu um erro ao fazer login, cheque as credenciais ou valide seus dados no aplicativo.',
              });
              window.scrollTo(0, 0);
            });
        })
        .catch(error => {
          if (error instanceof Yup.ValidationError) {
            const errors = getValidationErrors(error);
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            formRef.current?.setErrors(errors);
            setTimeout(() => {
              formRef.current?.setErrors({});
            }, 3000);
          }
          addAlert({
            type: 'error',
            title: 'Erro na autenticação',
            description: 'Ocorreu um erro ao fazer login, cheque as credenciais',
          });
          window.scrollTo(0, 0);
        });
    },
    [signIn, addAlert],
  );

  const handleCadastroClick = useCallback(() => {
    history.push(PATHS.cadastro);
  }, [history]);

  return (
    <>
      <Loading loading={loading} />
      <Container>
        <Background>
          <img src={background} />
        </Background>
        <Content>
          <div>
            <img className="logo" src={kimLogo} alt="kimLogo" />
          </div>
          <FormContainer className="w-100 mb-3 mt-4">
            <Form onSubmit={handleSubmit}>
              <Column gap="12px">
                <div className="text-left">
                  <Input
                    styles={{ borderRadius: 4, height: 38 }}
                    name="email"
                    props={{ type: 'email', placeholder: 'Email' }}
                  />
                </div>
                <div className="text-left">
                  <Input
                    styles={{ borderRadius: 4, height: 38 }}
                    name="password"
                    props={{ type, placeholder: 'Senha' }}
                    changeType={() => setType(type === 'normal' ? 'password' : 'normal')}
                  />
                  <div className="text-right">
                    <Link style={{ color: gray6, fontWeight: 400 }} to={PATHS.esqueciSenha}>
                      esqueceu sua senha?
                    </Link>
                  </div>
                </div>
                <Button
                  style={{ background: backgroundPrimary, borderRadius: 4, height: 42, padding: 0 }}
                  type="submit"
                  className="font-weight-bold"
                >
                  Entrar
                </Button>
              </Column>
            </Form>
            <div className="flex-row mt-1 mb-1">
              <text>Ainda não tem uma conta?</text>{' '}
              <span onClick={handleCadastroClick}>Cadastre-se</span>
            </div>
            <div className="mt-3 flex-row d-flex align-items-center w-100">
              <hr style={{ borderColor: gray2 }} />
              <p className="ml-3 mr-3">ou</p>
              <hr style={{ borderColor: gray2 }} />
            </div>
            <div className="mt-4 w-100">
              <Button
                onClick={googleLogin.signIn}
                type="button"
                style={{
                  background: '#fff',
                  color: backgroundPrimary,
                  border: '2px solid',
                  borderColor: backgroundPrimary,
                  borderRadius: 4,
                  height: 42,
                  padding: 0,
                }}
              >
                <img className="mr-2 mb-1" src={logoGoogle} alt={logoGoogle} />
                Entrar com o Google
              </Button>
            </div>
          </FormContainer>
        </Content>
      </Container>
    </>
  );
};

export default SignIn;
