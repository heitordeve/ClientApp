import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { Link } from 'react-router-dom';
import kimLogo from '../../../assets/logos/kim-logo.svg';

import Modal from 'react-modal';

import * as Yup from 'yup';

import { FormHandles } from '@unform/core';

import { IoMdClose } from 'react-icons/io';
import { useAlert } from '../../../hooks/alert';
import iconCheckModal from '../../../assets/check-circle.png';

import api from '../../../services/api';
import getValidationErrors from '../../../utils/getValidationErrors';
import {
  validateCPF,
  validateName,
  validatePassword,
  validateDDD,
  validatePhoneNumber,
  validateUF,
} from '../../../utils/inputValidator';

import {
  FormRow,
  FormContainer,
  Container,
  ImageContainer,
  ContentContainer,
  Background,
} from './style';

import background from '../../../assets/background-sign.svg';
import Input, { InputProps } from '../../../components/ui/input';
import Select, { SelectProps } from '../../../components/ui/select';
import Button from '../../../components/ui/button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Checkbox } from '@material-ui/core';
import Loading from '../../../components/ui/loading';
import { backgroundPrimary, gray6, white } from 'styles/consts';

Modal.setAppElement('#root');

interface GoogleProfileData {
  email: string;
  name: string;
}

interface APIUploadData {
  CPFUsuario: string | null; // string number
  CNPJUsuario: string | null; // string number
  isCPF: boolean;
  NomeUsuario: string;
  NomeFantasia: string;
  DataNascimentoUsuario: Date | null;
  EmailUsuario: string;
  SenhaUsuario: string;
  NumeroDDD: string; // string number
  NumeroTelefone: string; // string number
  enderecoUsuario: {
    TipoLogradouro: string;
    Logradouro: string;
    NumeroLogradouro: string; // number
    ComplementoLogradouro: string;
    NomeBairro: string;
    NomeMunicipio: string;
    SiglaUF: string;
    CEP: string; // string number
    EnderecoPrincipal: boolean;
  };
}

interface SignUpFormData {
  CPFUsuario: string; // string number
  NomeUsuario: string;
  NomeFantasia: string;
  EmailUsuario: string;
  SenhaUsuario: string;
  ConfSenhaUsuario: string;
  NumeroDDD: string; // string number
  NumeroTelefone: string; // string number
  enderecoUsuario: {
    Logradouro: string;
    NumeroLogradouro: string; // number
    ComplementoLogradouro: string;
    NomeBairro: string;
    NomeMunicipio: string;
    SiglaUF: string;
    CEP: string; // string number
  };
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
        background: white,
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
        background: white,
        color: '#FFFFFF',
        borderRadius: '15px',
        overflow: 'visible',
      },
};

const customStylesTerms = {
  content: isSmallWidth
    ? {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        width: '90vmin',
        heigth: '90vmin',
        background: '#FFF',
        color: '#FFFFFF',
        borderRadius: '15px',
        height: '80%',
        overflow: 'auto',
      }
    : {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '40%',
        background: '#FFF',
        color: '#FFFFFF',
        borderRadius: '15px',
        height: '80%',
        overflow: 'auto',
      },
};

type ComposedInputData = InputProps;

const ComposedInput: React.FC<ComposedInputData> = ({ name, ...rest }) => {
  return (
    <div>
      <Input name={name} {...rest} styles={{ borderRadius: 4, height: 40 }} />
    </div>
  );
};

type ComposedSelectData = SelectProps;

const ComposedSelect: React.FC<ComposedSelectData> = ({ name, ...rest }) => {
  return (
    <div>
      <Select styles={{ borderRadius: 4, height: 40 }} name={name} {...rest} />
    </div>
  );
};

const PessoaFisica = ({ updateTypeSignUp }: { updateTypeSignUp: () => void }) => {
  const { location } = useHistory<GoogleProfileData>();
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenTerms, setIsOpenTerms] = useState(false);
  const [termsUse, setTermsUse] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoCep, setAutoCep] = useState('');
  const formRef = useRef<FormHandles>(null);
  const { addAlert } = useAlert();
  const state = {
    termoUso: true,
  };

  useEffect(() => {
    if (formRef) {
      formRef.current.setData({
        NomeUsuario: location.state?.name,
        EmailUsuario: location.state?.email,
      });
    }
  }, [location, formRef]);

  const handleSignUp = useCallback(
    async (data: APIUploadData) => {
      setLoading(true);
      api
        .post('/KimMais.Api.CadastrarUsuario/api/CadastrarUsuario', data)
        .then(response => {
          if (response.data.Mensagem === 'Sucesso') {
            setLoading(false);
            setIsOpen(true);
          } else {
            setLoading(false);
            addAlert({
              title: 'Erro',
              description: response.data.Mensagem,
              type: 'error',
            });
          }
          window.scrollTo(0, 0);
        })
        .catch(rejReason => {
          setLoading(false);
          addAlert({
            title: 'Erro ao comunicar com o servidor',
            description: `${rejReason}`,
            type: 'error',
          });
          window.scrollTo(0, 0);
        });
    },
    [addAlert],
  );

  useEffect(() => {
    api.get(`/KimMais.Api.ConsultaTermoDeUso/0/0?tipoTermoUso=1`).then(response => {
      setTermsUse(response.data.ListaObjeto[0].DescTermoDeUso);
    });
  }, []);

  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        formRef.current?.setErrors({});

        const schema = Yup.object()
          .required('dados não cadastrados')
          .shape({
            // #region CPF validation
            CPFUsuario: Yup.string()
              .required('Informe o CPF')
              .transform(value => value.replace(/\D/g, ''))
              .test('valid_CPF', 'CPF inválido', value => validateCPF(value || '')),
            // #endregion
            // #region NomeUsuario validation
            NomeUsuario: Yup.string()
              .required('Informe o nome completo')
              .transform(value => (typeof value === 'string' ? value.trim() : value))
              .test('valid_name', 'O nome deve incluir nome e sobrenome', value => validateName(value || '')),
            // #endregion
            EmailUsuario: Yup.string().email('Digite um e-mail válido').required('Informe o email'),
            // #region SenhaUsuario validation
            SenhaUsuario: Yup.string()
              .required('Informe a senha')
              .test(
                'valid_password',
                'A senha deve conter de 6 a 15 caracteres contendo letras e números',
                value => validatePassword(value || ''),
              ),
            ConfSenhaUsuario: Yup.string()
              .required('confirme a senha')
              .test('equal_pwd', 'Senhas não batem', value => value === data.SenhaUsuario),
            // #endregion
            // #region NumeroDDD validation
            NumeroDDD: Yup.string()
              .required('Informe o DDD')
              .test('valid_ddd', 'DDD inválido', value => validateDDD(value || '')),
            // #endregion
            // #region NumeroTelefone validation
            NumeroTelefone: Yup.string()
              .required('Informe o telefone')
              .transform(value => value.replace(/\D/g, ''))
              .test('valid_phoneNumber', 'Telefone inválido', value =>
                validatePhoneNumber(value || ''),
              ),
            // #endregion
            Logradouro: Yup.string().required('Informe o logradouro'),
            NumeroLogradouro: Yup.string()
              .required('Informe o número')
              .typeError('Informe o número'),
            ComplementoLogradouro: Yup.string(),
            NomeBairro: Yup.string().required('Informe o bairro'),
            NomeMunicipio: Yup.string().required('Informe o municipio'),
            SiglaUF: Yup.string()
              .required('Informe a UF')
              .test('uf_size', 'UF inválida', value => validateUF(value || '')),
            CEP: Yup.string()
              .required('Informe o CEP')
              .transform(value => value.replace(/\D/g, ''))
              .min(8, 'O CEP deve conter 8 caracteres')
              .max(8, 'O CEP deve conter 8 caracteres'),
          });

        await schema
          .validate(data, {
            abortEarly: false,
          })
          .then(value => {
            if (state.termoUso) {
              handleSignUp({
                CPFUsuario: value.CPFUsuario,
                CNPJUsuario: null,
                isCPF: true,
                NomeUsuario: value.NomeUsuario,
                NomeFantasia: null,
                DataNascimentoUsuario: null,
                EmailUsuario: value.EmailUsuario,
                SenhaUsuario: value.SenhaUsuario,
                NumeroDDD: value.NumeroDDD.toString(),
                NumeroTelefone: value.NumeroTelefone,
                enderecoUsuario: {
                  TipoLogradouro: '',
                  Logradouro: value.Logradouro,
                  NumeroLogradouro: value.NumeroLogradouro,
                  ComplementoLogradouro: value.ComplementoLogradouro,
                  NomeBairro: value.NomeBairro,
                  NomeMunicipio: value.NomeMunicipio,
                  SiglaUF: value.SiglaUF,
                  CEP: value.CEP,
                  EnderecoPrincipal: true,
                },
              });
            } else {
              window.scrollTo(0, 0);
              addAlert({
                type: 'error',
                title: 'Aceite os termos de uso!',
              });
            }
          });
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          formRef.current?.setErrors(errors);
          setTimeout(() => {
            formRef.current?.setErrors({});
          }, 3000);
        }
      }
    },
    [formRef, state.termoUso, addAlert, handleSignUp],
  );

  useEffect(() => {
    const cep = autoCep.replace(/\D/g, '');
    if (formRef && cep.length === 8) {
      api
        .get(`KimMais.Api.BuscarEnderecoCEP/0/0?cep=${cep}`)
        .then(response => {
          if (Array.isArray(response.data.ListaObjeto) && response.data.ListaObjeto.length > 0) {
            formRef.current.setData({
              ...formRef.current.getData(),
              Logradouro: response.data.ListaObjeto[0].logradouro,
              NomeMunicipio: response.data.ListaObjeto[0].cidade,
              SiglaUF: response.data.ListaObjeto[0].uf,
              NomeBairro: response.data.ListaObjeto[0].bairro,
            });
          } else {
            formRef.current.setErrors({
              ...formRef.current.getErrors(),
              CEP: response.data.Mensagem,
            });
            setTimeout(() => {
              formRef.current.setErrors({});
            }, 3000);

            formRef.current.setData({
              ...formRef.current.getData(),
              Logradouro: '',
              NomeMunicipio: '',
              SiglaUF: 'MG',
              NomeBairro: '',
            });
          }
        })
        .catch(() => {
          formRef.current.setErrors({
            ...formRef.current.getErrors(),
            CEP: 'Erro ao buscar CEP',
          });
          setTimeout(() => {
            formRef.current.setErrors({});
          }, 3000);
          formRef.current.setData({
            ...formRef.current.getData(),
            Logradouro: '',
            NomeMunicipio: '',
            SiglaUF: 'MG',
            NomeBairro: '',
          });
        });
    }
  }, [autoCep, formRef]);

  return (
    <>
      <Loading loading={loading} />
      <Container>
        <Background>
          <ImageContainer src={background} />
        </Background>
        <ContentContainer>
          <img src={kimLogo} alt="kimLogo" />
          <p>Cadastro</p>
          <div className="flex-row align-items-center justify-content-center">
            <input checked type="radio" />
            <label className="ml-1">Pessoa Física</label>
            <input onClick={updateTypeSignUp} className="ml-3" type="radio" />
            <label className="ml-1">Pessoa Jurídica</label>
          </div>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <FormContainer>
              <span className="mt-2">Dados de cadastro</span>
              <FormRow className="mt-2">
                <div className="inputMargin">
                  <ComposedInput
                    name="NomeUsuario"
                    props={{
                      type: 'text',
                      placeholder: 'Nome completo',
                    }}
                  />
                </div>
              </FormRow>
              <FormRow className="mt-2">
                <div className="inputMargin">
                  <ComposedInput
                    name="CPFUsuario"
                    props={{
                      type: 'text',
                      placeholder: 'CPF',
                      mask: '999.999.999-99',
                    }}
                  />
                </div>
              </FormRow>
              <FormRow className="mt-2">
                <div>
                  <div className="numberCellphone">
                    <div className="inputDDD inputMargin">
                      <ComposedInput
                        name="NumeroDDD"
                        props={{
                          type: 'text',
                          placeholder: 'DDD',
                          mask: '99',
                        }}
                      />
                    </div>
                    <div className="inputCell inputMargin">
                      <ComposedInput
                        name="NumeroTelefone"
                        props={{
                          type: 'text',
                          placeholder: 'Telefone',
                          mask: '99999-9999',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </FormRow>
              <span className="mt-2">Dados de acesso</span>

              <FormRow className="mt-2">
                <div className="inputMargin">
                  <ComposedInput
                    name="EmailUsuario"
                    props={{
                      placeholder: 'Email',
                    }}
                  />
                </div>
              </FormRow>
              <FormRow className="mt-2">
                <div className="inputMargin">
                  <ComposedInput
                    name="SenhaUsuario"
                    props={{
                      type: 'password',
                      placeholder: 'Senha',
                      maxLength: 15,
                    }}
                  />
                </div>
              </FormRow>
              <FormRow className="mt-2">
                <div className="inputMargin">
                  <ComposedInput
                    name="ConfSenhaUsuario"
                    props={{
                      type: 'password',
                      placeholder: 'Senha novamente',
                      maxLength: 15,
                    }}
                  />
                </div>
              </FormRow>
              <span className="mt-2">Endereço</span>
              <FormRow className="mt-2">
                <div className="inputMargin">
                  <ComposedInput
                    name="CEP"
                    props={{
                      type: 'text',
                      placeholder: 'CEP',
                      mask: '99999-999',
                      id: 'CEP',
                      onChange: event => setAutoCep(event.target.value),
                    }}
                  />
                </div>
              </FormRow>
              <FormRow className="mt-2">
                <div className="inputMargin">
                  <ComposedInput
                    name="Logradouro"
                    props={{
                      type: 'text',
                      placeholder: 'Logradouro',
                    }}
                  />
                </div>
              </FormRow>
              <FormRow className="mt-2">
                <div className="inputMargin">
                  <ComposedInput
                    name="NumeroLogradouro"
                    props={{
                      type: 'number',
                      placeholder: 'Número',
                    }}
                  />
                </div>
                <div className="inputMargin">
                  <ComposedInput
                    name="ComplementoLogradouro"
                    props={{ type: 'text', placeholder: 'Complemento' }}
                  />
                </div>
              </FormRow>
              <FormRow className="mt-2">
                <div className="inputMargin">
                  <ComposedInput
                    name="NomeBairro"
                    props={{
                      type: 'text',
                      placeholder: 'Bairro',
                    }}
                  />
                </div>
              </FormRow>
              <FormRow className="mt-2">
                <div className="inputMargin">
                  <ComposedInput
                    name="NomeMunicipio"
                    props={{
                      type: 'text',
                      placeholder: 'Cidade',
                    }}
                  />
                </div>
                <div className="selectUF inputMargin">
                  <ComposedSelect name="SiglaUF" required defaultValue="MG">
                    <option value="AC">Acre</option>
                    <option value="AL">Alagoas</option>
                    <option value="AP">Amapá</option>
                    <option value="AM">Amazonas</option>
                    <option value="BA">Bahia</option>
                    <option value="CE">Ceará</option>
                    <option value="DF">Distrito Federal</option>
                    <option value="ES">Espirito Santo</option>
                    <option value="GO">Goiás</option>
                    <option value="MA">Maranhão</option>
                    <option value="MS">Mato Grosso do Sul</option>
                    <option value="MT">Mato Grosso</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="PA">Pará</option>
                    <option value="PB">Paraíba</option>
                    <option value="PR">Paraná</option>
                    <option value="PE">Pernambuco</option>
                    <option value="PI">Piauí</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="RN">Rio Grande do Norte</option>
                    <option value="RS">Rio Grande do Sul</option>
                    <option value="RO">Rondônia</option>
                    <option value="RR">Roraima</option>
                    <option value="SC">Santa Catarina</option>
                    <option value="SP">São Paulo</option>
                    <option value="SE">Sergipe</option>
                    <option value="TO">Tocantins</option>
                  </ComposedSelect>
                </div>
              </FormRow>
              <FormRow id="acceptTerms" className="justify-content-center align-items-center mt-2">
                <p className="self-align-center">
                  Ao continuar, você declara aceitar os{' '}
                  <b onClick={() => setIsOpenTerms(true)}>termos de uso </b>e nossa{' '}
                  <b onClick={() => setIsOpenTerms(true)}>política de privacidade </b>
                </p>
              </FormRow>
              <FormRow className="mt-2 mb-2">
                <Button
                  style={{ backgroundColor: backgroundPrimary, borderRadius: 4 }}
                  type="submit"
                >
                  Continuar
                </Button>
              </FormRow>
            </FormContainer>
          </Form>
          <Modal
            style={customStyles}
            isOpen={isOpen}
            onRequestClose={() => setIsOpen(false)}
            contentLabel="Example Modal"
          >
            <div className="d-flex justify-content-center align-items-center flex-wrap flex-column pr-2 pl-2 pt-4 pb-4">
              <img
                alt="Sucesso"
                style={{
                  display: isSmallHeight ? 'none' : '',
                  maxWidth: '150px',
                }}
                src={iconCheckModal}
              />
              <h3
                style={{ fontSize: '24px', fontWeight: 600, color: gray6 }}
                className="text-center pl-4 pr-4 mt-2"
              >
                Cadastro realizado <br></br> com sucesso
              </h3>

              <p style={{ fontSize: '14px', color: gray6 }} className="text-center mt-2">
                Por favor, verifique seu e-mail para ativar sua conta.
              </p>
              <Link to="" style={isSmallWidth ? { width: '100%' } : {}}>
                <Button
                  className="font-weight-bold"
                  style={
                    isSmallWidth
                      ? {
                          background: backgroundPrimary,
                          color: white,
                          borderRadius: 4,
                        }
                      : {
                          background: backgroundPrimary,
                          color: white,
                          borderRadius: 4,
                          width: '350px',
                        }
                  }
                  onClick={() => {
                    setIsOpen(false);
                    history.push('/');
                  }}
                >
                  Ir para a página inicial
                </Button>
              </Link>
            </div>
          </Modal>
          <Modal
            style={customStylesTerms}
            isOpen={isOpenTerms}
            onRequestClose={() => setIsOpen(false)}
            contentLabel="Example Modal"
          >
            <IoMdClose
              onClick={() => setIsOpenTerms(false)}
              size={20}
              style={{
                color: backgroundPrimary,
                top: '-22',
                display: 'block',
                float: 'right',
                position: 'relative',
                right: '-20px',
                cursor: 'pointer',
              }}
            />
            <>
              <div className="d-flex justify-content-center align-items-center flex-wrap flex-column pr-2 pl-2 pt-4 pb-4">
                <div
                  id="terms"
                  style={{ color: 'black' }}
                  dangerouslySetInnerHTML={{ __html: termsUse }}
                />

                <Button
                  className="font-weight-bold"
                  style={
                    isSmallWidth
                      ? {
                          background: '#D9D0F8',
                          color: backgroundPrimary,
                          width: '100%',
                        }
                      : {
                          background: '#D9D0F8',
                          color: backgroundPrimary,
                          width: '350px',
                        }
                  }
                  onClick={() => setIsOpenTerms(false)}
                >
                  Ok
                </Button>
              </div>
            </>
          </Modal>
        </ContentContainer>
      </Container>
    </>
  );
};

export default PessoaFisica;
