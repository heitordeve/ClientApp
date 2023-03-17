import React, { useState, useCallback, useRef } from 'react';

import * as Yup from 'yup';
import { FormHandles } from '@unform/core';

import { Form } from '@unform/web';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';

import { AiOutlineCloseCircle } from 'react-icons/ai';
import { FiSmartphone, FiMail } from 'react-icons/fi';
import { MdLockOutline } from 'react-icons/md';
import { RiBillLine } from 'react-icons/ri';

import api from '../../../services/api';
import getValidationErrors from '../../../utils/getValidationErrors';

import { useAuth } from '../../../hooks/auth';
import { useAlert } from '../../../hooks/alert';

import FunctionalityCard from '../../FunctionalityCard';
import Loading from '../../ui/loading';
import Button from '../../ui/button';
import Label from '../../ui/label';
import Input from '../../ui/input';
import { CustomRadioButton } from '../../ui/radioButton'

import { validateName } from '../../../utils/inputValidator';

import { useDigitalWallet } from '../../../hooks/digitalWallet';

import { CardBody } from 'reactstrap';

import {
  CardBox,
  CardGroupButtons,
  CardHr,
  CardLabel,
  CardMenu,
  CardOptions,
  CardSubTitle,
  DashboardCard,
  HighlightLink,
  HighlightText
} from '../styles';
import { PATHS } from 'routes/rotas-path';

const isSmallWidth = window.matchMedia("(max-width: 1000px)").matches;

const CloseAccountModalStyle: Modal.Styles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: isSmallWidth?{
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    width: '90vmin'
  }
  :
  {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    maxWidth: '285px',
  }
}

const ChangePasswordModalStyle: Modal.Styles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    background: 'transparent',
    border: 'none',
    minWidth: '300px'
  }
}

enum ChangePasswordStateEnum {
  Verificacao,
  SelecaoEnvio,
  ObtencaoCodigo,
  AlteracaoSenha,
  Finalizacao
}

enum ModoEnvioEnum {
  Email,
  Celular
}

interface ChangePasswordModalProps extends Modal.Props {
  onRequestClose(): void
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ onRequestClose: requestClose, ...rest }) => {

  const { user } = useAuth();
  const { addAlert } = useAlert();

  const [loading, setLoading] = useState<boolean>(false);
  const [compState, setCompState] = useState<ChangePasswordStateEnum>(ChangePasswordStateEnum.Verificacao);
  const [modoEvio, setModoEnvio] = useState<ModoEnvioEnum>(ModoEnvioEnum.Email);

  const formRef = useRef<FormHandles>();

  const close = useCallback(() => {
    setLoading(false);
    setCompState(ChangePasswordStateEnum.Verificacao);
    requestClose();
  }, [requestClose]);

  const backToSelecaoEnvio = useCallback(() => {
    setCompState(ChangePasswordStateEnum.SelecaoEnvio);
  }, []);

  const handleClick = useCallback((isAlerting: boolean, callback: (alert: boolean) => void) => {
    switch (+compState) {
      case ChangePasswordStateEnum.Finalizacao:
        close();
        break;
      default:
        formRef.current?.submitForm();
        break;
    }
  }, [compState, formRef, close]);

  const handleVerificacao = useCallback(data => {
    formRef.current?.setErrors({});
    Yup.object().required('Informe o nome da sua mãe').shape({
      NomeMae: Yup.string().required()
        .test('validate', 'Informe um nome válido', value => {
          return validateName(value);
        })
    }).validate(data, {
      abortEarly: false
    }).then(value => {
      setLoading(true);
      api.post(`/KimMais.Api.RevalidarNomeMae/${user.TokenUsuario}/${user.CodigoUsuario}`, {
        NomeMae: value.NomeMae
      }).then(response => {
        setLoading(false);
        if (response.data.Mensagem === 'Sucesso') {
          setCompState(ChangePasswordStateEnum.SelecaoEnvio);
        } else if (response.data.Mensagem) {
          addAlert({
            title: 'Erro',
            description: response.data.Mensagem,
            type: 'error'
          });
        } else {
          addAlert({
            title: 'Erro',
            description: 'Erro ao enviar dados, tente mais tarde',
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
        addAlert({
          title: 'Erro',
          description: 'Verifique os dados enviados no formulário',
          type: 'error'
        });
      }
    });
  }, [user, formRef, addAlert]);

  const enviarSMS = useCallback(() => {
    setLoading(true);
    api.post(`/KimMais.Api.SMS/${user.TokenUsuario}/${user.CodigoUsuario}`)
      .then(response => {
        setLoading(false);
        if (response.data.Status === 0) {
          setModoEnvio(ModoEnvioEnum.Celular);
          setCompState(ChangePasswordStateEnum.ObtencaoCodigo);
        } else if (response.data.Mensagem) {
          addAlert({
            title: 'Erro',
            description: response.data.Mensagem,
            type: 'error'
          });
        } else {
          addAlert({
            title: 'Erro',
            description: 'Erro ao enviar código, tente novamente mais tarde',
            type: 'error'
          });
        }
      }).catch(() => {
        setLoading(false);
        addAlert({
          title: 'Erro',
          description: 'Erro ao enviar código, tente novamente mais tarde',
          type: 'error'
        });
      });
  }, [user, addAlert]);

  const enviarCodigoEmail = useCallback(() => {
    setLoading(true);
    api.post(`/KimMais.Api.EnviarCodigoEmail/${user.TokenUsuario}/${user.CodigoUsuario}`, {})
      .then(response => {
        setLoading(false);
        if (response.data.Status === 0) {
          setModoEnvio(ModoEnvioEnum.Email);
          setCompState(ChangePasswordStateEnum.ObtencaoCodigo);
        } else if (response.data.Mensagem) {
          addAlert({
            title: 'Erro',
            description: response.data.Mensagem,
            type: 'error'
          });
        } else {
          addAlert({
            title: 'Erro',
            description: 'Erro ao enviar código, tente novamente mais tarde',
            type: 'error'
          });
        }
      }).catch(() => {
        setLoading(false);
        addAlert({
          title: 'Erro',
          description: 'Erro ao enviar código, tente novamente mais tarde',
          type: 'error'
        });
      });
  }, [user, addAlert]);

  const handleSelecaoEnvio = useCallback(data => {
    formRef.current?.setErrors({});
    Yup.object().required('Selecione uma opção').shape({
      ModoEnvio: Yup.number().typeError('Selecione uma opção').required('Selecione uma opção'),
    }).validate(data, {
      abortEarly: false
    }).then(value => {
      switch (value.ModoEnvio) {
        case ModoEnvioEnum.Celular:
          enviarSMS();
          break;
        case ModoEnvioEnum.Email:
          enviarCodigoEmail();
          break;
        default:
          addAlert({
            title: 'Erro',
            description: 'Opção selecionada não é válida, tente novamente',
            type: 'error'
          });
          break;
      }
    }).catch(error => {
      setLoading(false);
      if (error instanceof Yup.ValidationError) {
        formRef.current?.setErrors(getValidationErrors(error));
        setTimeout(() => { formRef.current?.setErrors({}); }, 3000);
      } else {
        addAlert({
          title: 'Erro',
          description: 'Verifique os dados enviados no formulário',
          type: 'error'
        });
      }
    });
  }, [formRef, addAlert, enviarSMS, enviarCodigoEmail]);

  const handleObtencaoCodigo = useCallback(data => {
    formRef.current?.setErrors({});
    Yup.object().required('Informe o código de confirmação').shape({
      CodigoConrfirmacao: Yup.string().required('Informe o código de confirmação')
        .min(4, 'O código deve conter 4 dígitos')
        .max(4, 'O código deve conter 4 dígitos')
        .test('onlyDigits', 'O código deve ser composta somente de dígitos', value => {
          return value.replace(/[\d]/g, '').length === 0
        })
    }).validate(data, {
      abortEarly: false
    }).then(value => {
      let url: string;
      switch (+modoEvio) {
        case ModoEnvioEnum.Celular:
          url = `/KimMais.Api.SMS/${user.TokenUsuario}/${user.CodigoUsuario}?sms=${value.CodigoConrfirmacao}`;
          break;
        case ModoEnvioEnum.Email:
          url = `/KimMais.Api.ValidarCodigoEmail/${user.TokenUsuario}/${user.CodigoUsuario}?codEmail=${value.CodigoConrfirmacao}`;
          break;
        default:
          addAlert({
            title: 'Erro',
            description: 'Opção selecionada não é válida, tente novamente',
            type: 'error'
          });
          backToSelecaoEnvio();
          break;
      }
      if (url) {
        setLoading(true);
      api.get(url)
        .then(response => {
          setLoading(false);
          if (response.data.Status === 0) {
            setCompState(ChangePasswordStateEnum.AlteracaoSenha);
          } else if (response.data.Mensagem) {
            addAlert({
              title: 'Erro',
              description: response.data.Mensagem,
              type: 'error'
            });
          } else {
            addAlert({
              title: 'Erro',
              description: 'Erro ao verificar código, tente novamente mais tarde',
              type: 'error'
            });
          }
        }).catch(() => {
          setLoading(false);
          addAlert({
            title: 'Erro',
            description: 'Erro ao verificar código, tente novamente mais tarde',
            type: 'error'
          });
        });
      }
    }).catch(error => {
      setLoading(false);
      if (error instanceof Yup.ValidationError) {
        formRef.current?.setErrors(getValidationErrors(error));
        setTimeout(() => { formRef.current?.setErrors({}); }, 3000);
      } else {
        addAlert({
          title: 'Erro',
          description: 'Verifique os dados enviados no formulário',
          type: 'error'
        });
      }
    });
  }, [user, formRef, modoEvio, backToSelecaoEnvio, addAlert]);

  const handleAlteracaoSenha = useCallback(data => {
    formRef.current?.setErrors({});
    Yup.object().required('Informe a senha').shape({
      password: Yup.string().required()
        .min(6, 'Senha deve conter 6 dígitos').max(6, 'Senha deve conter 6 dígitos')
        .test('onlyDigits', 'Senha deve ser composta somente de dígitos', value => {
          return value.replace(/[\d]/g, '').length === 0
        }),
      confirmPassword: Yup.string().required('Confirme a senha')
        .test('equalPwd', 'Senhas não batem', value => {
          return value === data.password;
        })
    }).validate(data, {
      abortEarly: false
    }).then(value => {
      setLoading(true);
      api.post(`/KimMais.Api.CadastrarSenha/${user.TokenUsuario}/${user.CodigoUsuario}`, {
        senhaPrimaria: value.password,
        senhaConfirmacao: value.confirmPassword,
      }).then(response => {
        setLoading(false);
        if (response.data.Status === 0) {
          addAlert({
            title: 'Sucesso',
            description: 'Senha da carteira digital alterada com sucesso!',
            type: 'success'
          });
          setCompState(ChangePasswordStateEnum.Finalizacao);
        } else {
          addAlert({
            title: 'Erro',
            description: 'Erro ao enviar dados, tente mais tarde',
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
        addAlert({
          title: 'Erro',
          description: 'Verifique os dados enviados no formulário',
          type: 'error'
        });
      }
    });
  }, [user, formRef, addAlert]);

  const renderForm = useCallback(() => {
    let result: React.ReactNode = <></>;
    switch (+compState) {
      case ChangePasswordStateEnum.Verificacao:
        result = (
          <Form ref={formRef} onSubmit={handleVerificacao}>
            <Label className="big-label">Insira abaixo a informação solicitada</Label>
            <p>Coloque na caixa abaixo o nome completo da sua mãe para continuarmos a redefinição da sua senha da Carteira Digital</p>
            <Input name="NomeMae" />
          </Form>
        );
        break;
      case ChangePasswordStateEnum.SelecaoEnvio:
        result = (
          <Form ref={formRef} onSubmit={handleSelecaoEnvio}>
            <Label className="big-label">Agora enviaremos um código de verificação para seu e-mail ou celular</Label>
            <p>Escolha a opção desejada:</p>
            <CustomRadioButton name="ModoEnvio" options={[
              {
                render: input => <CardBox>
                  {input}
                  <FiMail size={25} />
                  <Label>E-mail: {user.EmailUsuario}</Label>
                </CardBox>,
                props: {
                  id: 'EmailModoEnvio',
                  value: ModoEnvioEnum.Email
                }
              },
              {
                render: input => <CardBox>
                  {input}
                  <FiSmartphone size={25} />
                  <Label>Celular: ({user.NumeroDDD}) {user.NumeroTelefone}</Label>
                </CardBox>,
                props: {
                  id: 'CelularModoEnvio',
                  value: ModoEnvioEnum.Celular
                }
              }
            ]} />
          </Form>
        );
        break;
      case ChangePasswordStateEnum.ObtencaoCodigo:
        switch (+modoEvio) {
          case ModoEnvioEnum.Celular:
            result = (
              <Form ref={formRef} onSubmit={handleObtencaoCodigo}>
                <Label className="big-label">Confirme seu Número</Label>
                <p>Para sua segurança, enviamos um código de confirmação para seu celular do número <HighlightText>({user.NumeroDDD}) {user.NumeroTelefone}</HighlightText>, informe o código enviado para prosseguir</p>
                <Input name="CodigoConrfirmacao" props={{ mask: '9999' }} />
                <p>Não recebeu o código? <HighlightLink to="#" onClick={backToSelecaoEnvio}>clique aqui</HighlightLink> para receber o código novamente!</p>
              </Form>
            );
            break;
          case ModoEnvioEnum.Email:
            result = (
              <Form ref={formRef} onSubmit={handleObtencaoCodigo}>
                <Label className="big-label">Confirme seu E-mail</Label>
                <p>Para sua segurança, enviamos um código de confirmação para seu e-mail <HighlightText>{user.EmailUsuario}</HighlightText>, informe o código enviado para prosseguir</p>
                <Input name="CodigoConrfirmacao" props={{ mask: '9999' }} />
                <p>Não recebeu o código? <HighlightLink to="#" onClick={backToSelecaoEnvio}>clique aqui</HighlightLink> para receber o código novamente!</p>
              </Form>
            );
            break;
        }
        break;
      case ChangePasswordStateEnum.AlteracaoSenha:
        result = (
          <Form ref={formRef} onSubmit={handleAlteracaoSenha}>
            <Label className="text-left">Nova senha</Label>
            <Input name="password" props={{ type: 'password', maxLength: 6 }} />
            <Label className="text-left">Confirmar senha</Label>
            <Input name="confirmPassword" props={{ type: 'password', maxLength: 6 }} />
          </Form>
        );
        break;
    }
    return result;
  }, [
    user,
    compState,
    modoEvio,
    formRef,
    handleVerificacao,
    backToSelecaoEnvio,
    handleSelecaoEnvio,
    handleAlteracaoSenha,
    handleObtencaoCodigo
  ]);

  return (
    <Modal style={ChangePasswordModalStyle} onRequestClose={close} {...rest}>
      <Loading loading={loading} />
      <FunctionalityCard title="Alterar senha" color="#672ED7" components={{
        cancel: {
          onClick: close
        },
        action: {
          startAlerting: compState === ChangePasswordStateEnum.Finalizacao,
          alertText: 'Finalizar',
          alertContent: <CardLabel>Senha alterada com sucesso!</CardLabel>,
          text: 'Continuar',
          onClick: handleClick
        },
        progressBar: {
          size: 4,
          current: +compState
        }
      }}>
        {renderForm()}
      </FunctionalityCard>
    </Modal>
  );
}

const ConfigCard: React.FC = () => {

  const { user } = useAuth();
  const { addAlert } = useAlert();

  const wallet = useDigitalWallet();

  const [isCloseAccountModalOpen, setIsCloseAccountModalOpen] = useState<boolean>(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const toggleCloseAccountModal = useCallback(() => {
    setIsCloseAccountModalOpen(prev => !prev);
  }, []);

  const toggleChangePasswordModal = useCallback(() => {
    setIsChangePasswordModalOpen(prev => !prev);
  }, []);

  const tryCloseAccount = useCallback(() => {
    setLoading(true);
    api.get(`/KimMais.Api.Generica/${user.TokenUsuario}/${user.CodigoUsuario}/VerificaSaldoZerado`)
      .then(response => {
        setLoading(false);
      }).catch(() => {
        addAlert({
          title: 'Erro',
          description: 'Erro ao buscar saldo da conta, tente novamente mais tarde',
          type: 'error'
        });
      });
  }, [user, addAlert]);

  return (
    <DashboardCard>
      <Modal style={CloseAccountModalStyle} isOpen={isCloseAccountModalOpen}>
        <Loading loading={loading} />
        <CardLabel>Realmente deseja encerrar sua conta?</CardLabel>
        <CardOptions>
          <Button color="secondary" onClick={toggleCloseAccountModal}>
            Não
          </Button>
          <Button className="warning-colors" onClick={tryCloseAccount}>
            Sim
        </Button>
        </CardOptions>
      </Modal>
      <ChangePasswordModal isOpen={isChangePasswordModalOpen} onRequestClose={toggleChangePasswordModal} />
      <CardBody>
        <CardSubTitle className="w-100 justify-content-between">
          <div className="flex-column text-left">
            <b>Código conta</b>
            <p>{wallet?.codigoConta}</p>
          </div>
          <div className="flex-column text-right">
            <b>Dados da conta</b>
            <div className="flex-row">
              <p>CPF: {user.CpfUsuario}</p>
            </div>
            <div className="flex-row">
              <p>E-email: {user.EmailUsuario}</p>
            </div>
          </div>
        </CardSubTitle>
        <CardHr />
        <CardGroupButtons>
          <div className="ml-1 mr-1 mt-1 link-card" onClick={toggleCloseAccountModal}>
            <CardMenu>
              <AiOutlineCloseCircle size={20} style={{ color: '#FFF' }} />
              <strong>Encerrar a conta</strong>
            </CardMenu>
          </div>
          <div className="ml-1 mr-1 mt-1 link-card" onClick={toggleChangePasswordModal}>
            <CardMenu>
              <MdLockOutline size={20} style={{ color: '#FFF' }} />
              <strong>Alterar Senha</strong>
            </CardMenu>
          </div>
          <div className="ml-1 mr-1 mt-1 link-card">
            <Link to={PATHS.conveniencias}>
              <CardMenu>
                <RiBillLine size={20} style={{ color: '#FFF' }} />
                <strong>Conveniência</strong>
              </CardMenu>
            </Link>
          </div>
        </CardGroupButtons>
      </CardBody>
    </DashboardCard>
  )
};

export default ConfigCard;
