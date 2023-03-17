import React, { useState, useEffect, useCallback, useRef } from 'react';

import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { Form } from '@unform/web';

import { useAuth } from '../../../hooks/auth';
import { useAlert } from '../../../hooks/alert';

import api from '../../../services/api';

import getValidationErrors from '../../../utils/getValidationErrors';

import { useDigitalWallet } from '../../../hooks/digitalWallet';

import FunctionalityCard from '../../FunctionalityCard';
import Loading from '../../ui/loading';
import Label from '../../ui/label';
import Select from '../../ui/select';
import { CustomRadioButton } from '../../ui/radioButton';
import Input, { CurrencyInput, InputCPFCNPJ } from '../../ui/input';

import { FiChevronLeft } from 'react-icons/fi';

import { CardBox, CardSmallLabel, ReturnHoder } from '../styles';

import { LabelTitle, LabelText, FormRow } from './styles';
import { AiOutlineSearch } from 'react-icons/ai';
import { validateCNPJ, validateCPF } from '../../../utils/inputValidator';

import { useHistory } from 'react-router-dom';

interface ContaKimData {
  valor: number;
  descricao: string;
  contaDestino: number;
}

interface OutroBancoData {
  Identificator: number;
  Descricao: string;
  Beneficiario: {
    TipoPessoa: string;
    NumeroCPFCNPJ: string;
    NomeBeneficiario: string;
    IdBanco: string | number;
    Agencia: number;
    DigitoAgencia: string;
    ContaCorrente: number;
    DigitoContaCorrente: string;
    TipoConta: string;
  };
  Valor: number;
}

enum TypeTransferData {
  ContasKIM = 1,
  OutrosBancos = 2,
}

enum TransferStateEnum {
  SelectTransfer = 0,

  //FluxoContaKIM
  ContaKimInfoFavorecido = 1.1,
  ContaKimInfoValor = 1.5,
  ContaKimFinalizar = 1.9,

  //FluxoOutrosBancos
  OutrosBancosInfoFavorecido = 2.1,
  OutrosBancosInfoValor = 2.5,
  OutrosBancosFinalizar = 2.9,
}

const Transfer: React.FC = () => {
  const { user } = useAuth();
  const { addAlert } = useAlert();

  const [loading, setLoading] = useState(false);

  const [compState, setCompState] = useState<TransferStateEnum>(TransferStateEnum.SelectTransfer);

  const [bodyHolder, setBodyHolder] = useState<React.ReactNode>();

  const [alertHolder, setAlertHolder] = useState<React.ReactNode>();

  const [favorecidoHolder, setFavorecidoHolder] = useState<React.ReactNode>();

  const [formData, setFormData] = useState<ContaKimData | OutroBancoData>();

  const formRef = useRef<FormHandles>();

  const history = useHistory();

  const wallet = useDigitalWallet();

  const goBack = useCallback(() => {
    setCompState(prev => {
      let result = TransferStateEnum.SelectTransfer;
      switch (+prev) {
        case TransferStateEnum.ContaKimInfoValor:
          result = TransferStateEnum.ContaKimInfoFavorecido;
          setFavorecidoHolder(undefined);
          break;
        case TransferStateEnum.ContaKimFinalizar:
          result = TransferStateEnum.ContaKimInfoValor;
          break;
        case TransferStateEnum.OutrosBancosInfoValor:
          result = TransferStateEnum.OutrosBancosInfoFavorecido;
          break;
        case TransferStateEnum.OutrosBancosFinalizar:
          result = TransferStateEnum.OutrosBancosInfoValor;
          break;
      }
      return result;
    });
  }, []);

  const handlePesquisaConta = useCallback(() => {
    Yup.string()
      .min(1, 'Digite uma conta válida')
      .required('Digite uma conta')
      .validate(formRef.current.getFieldValue('contaKim'), {
        abortEarly: false,
      })
      .then(value => {
        setLoading(true);
        api
          .get(`KimMais.Api.BuscarContaKim/0/0?idConta=${value}`)
          .then(response => {
            setLoading(false);
            if (response.data.Status === 0) {
              if (
                Array.isArray(response.data.ListaObjeto) &&
                response.data.ListaObjeto.length > 0
              ) {
                setFavorecidoHolder(
                  <>
                    <div className="d-flex flex-column align-items-start">
                      <div>
                        <LabelTitle>Nome do Favorecido</LabelTitle>
                        <LabelText>{response.data.ListaObjeto[0].NomeFavorecido}</LabelText>
                      </div>
                      <div className="mt-3 mb-3">
                        <LabelTitle>CPF/CNPJ do Favorecido</LabelTitle>
                        <LabelText>{response.data.ListaObjeto[0].CPFFavorecido}</LabelText>
                      </div>
                    </div>
                    <Input name="descricao" props={{ placeholder: 'Descrição' }} />
                  </>,
                );
                setLoading(false);
              } else {
                setFavorecidoHolder(
                  <>
                    <LabelTitle>Conta não existente!</LabelTitle>
                  </>,
                );
              }
            } else {
              addAlert({
                title: 'Erro',
                description: 'Erro ao buscar conta, tente mais tarde',
                type: 'error',
              });
            }
          })
          .catch(() => {
            addAlert({
              title: 'Erro',
              description: 'Erro ao buscar conta, tente mais tarde',
              type: 'error',
            });
          });
      })
      .catch(error => {
        if (error instanceof Yup.ValidationError) {
          formRef?.current.setErrors(getValidationErrors(error));
          setTimeout(() => {
            formRef.current?.setErrors({});
          }, 3000);
        } else {
          addAlert({
            title: 'Erro',
            description: 'Verifique os dados enviados',
            type: 'error',
          });
        }
      });
  }, [formRef, addAlert]);

  useEffect(() => {
    switch (+compState) {
      case TransferStateEnum.SelectTransfer:
        setBodyHolder(
          <>
            <CardSmallLabel>Escolha sua forma de transferência:</CardSmallLabel>
            <CustomRadioButton
              name="CodigoFormaTransferencia"
              options={[
                {
                  props: {
                    id: '',
                    defaultChecked: true,
                    value: TypeTransferData.ContasKIM,
                  },
                  render: input => (
                    <CardBox>
                      {input}
                      <Label>Entre contas KIM</Label>
                    </CardBox>
                  ),
                },
                {
                  props: {
                    id: '',
                    value: TypeTransferData.OutrosBancos,
                  },
                  render: input => (
                    <CardBox>
                      {input}
                      <Label>Outros bancos</Label>
                    </CardBox>
                  ),
                },
              ]}
            />
          </>,
        );
        setAlertHolder(undefined);
        break;

      case TransferStateEnum.ContaKimInfoFavorecido:
        setBodyHolder(
          <>
            <ReturnHoder>
              <FiChevronLeft size={25} onClick={goBack} />
            </ReturnHoder>
            <div>
              <LabelTitle>Etapa 1 de 3</LabelTitle>
            </div>
            <div className="mt-3">
              <CardSmallLabel>Digite uma conta KIM:</CardSmallLabel>
            </div>
            <div className="d-flex justify-content-center align-items-center mt-3">
              <Input name="contaKim" props={{ placeholder: 'Nº da conta' }} />
              <AiOutlineSearch
                className="ml-3"
                style={{ color: '#672ED7', cursor: 'pointer' }}
                size={35}
                onClick={handlePesquisaConta}
              />
            </div>
            {favorecidoHolder}
          </>,
        );
        setAlertHolder(undefined);
        break;

      case TransferStateEnum.ContaKimInfoValor:
        setBodyHolder(
          <>
            <ReturnHoder>
              <FiChevronLeft size={25} onClick={goBack} />
            </ReturnHoder>
            <div>
              <LabelTitle>Etapa 2 de 3</LabelTitle>
            </div>
            <div className="mt-3">
              <CardSmallLabel>Digite o Valor:</CardSmallLabel>
            </div>
            <div className="d-flex justify-content-center align-items-center mt-3">
              <div className="w-50">
                <CurrencyInput name="valor" />
              </div>
            </div>
          </>,
        );
        setAlertHolder(undefined);
        break;

      case TransferStateEnum.ContaKimFinalizar:
        setBodyHolder(undefined);
        setLoading(true);
        api
          .get(`KimMais.Api.BuscarContaKim/0/0?idConta=${(formData as ContaKimData).contaDestino}`)
          .then(response => {
            api
              .get(`KimMais.Api.Generica/0/0/Params%2FGetAllParams`)
              .then(value => {
                setAlertHolder(
                  <>
                    <ReturnHoder className="alert">
                      <FiChevronLeft size={25} onClick={goBack} />
                    </ReturnHoder>
                    <div className="d-flex flex-column align-items-start">
                      <div>
                        <LabelTitle className="text-light">Etapa 3 de 3</LabelTitle>
                      </div>
                      <div className="mt-3">
                        <LabelTitle className="text-light">
                          Confirme os dados da transferência:
                        </LabelTitle>
                        <LabelText className="text-white">
                          Nome: {response.data.ListaObjeto[0].NomeFavorecido}
                        </LabelText>
                        <LabelText className="text-white">
                          CPF: {response.data.ListaObjeto[0].CPFFavorecido}
                        </LabelText>
                        <LabelText className="text-white">
                          Conta: {(formData as ContaKimData).contaDestino}
                        </LabelText>
                      </div>
                      <div className="mt-3">
                        <LabelTitle className="text-light">Valor da transferência:</LabelTitle>
                        <LabelText className="text-white">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format((formData as ContaKimData).valor)}
                        </LabelText>
                      </div>
                      <div className="mt-3">
                        <LabelTitle className="text-light">Descrição:</LabelTitle>
                        <LabelText className="text-white">
                          {(formData as ContaKimData).descricao}
                        </LabelText>
                      </div>
                      <hr className="text-light" />
                      <div className="d-flex align-self-center p-3 mb-2 bg-light text-dark rounded">
                        <LabelText>
                          A conveniência de transferência é de{' '}
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(
                            value.data.ListaObjeto[0] && value.data.ListaObjeto[0].vl_banco_transf,
                          )}
                        </LabelText>
                      </div>
                    </div>
                  </>,
                );
                setLoading(false);
              })
              .catch(error => {
                window.scrollTo(0, 0);
                addAlert({
                  type: 'error',
                  title: 'Erro ao comunicar com o servidor',
                  description: error,
                });
                setLoading(false);
              });
          })
          .catch(error => {
            window.scrollTo(0, 0);
            addAlert({
              type: 'error',
              title: 'Erro ao comunicar com o servidor',
              description: error,
            });
            setLoading(false);
          });
        break;

      case TransferStateEnum.OutrosBancosInfoFavorecido:
        setLoading(true);
        api
          .get(`KimMais.Api.ObterTodosBancosWallet/0/0?pagina=0`)
          .then(response => {
            setBodyHolder(
              <>
                <ReturnHoder>
                  <FiChevronLeft size={25} onClick={goBack} />
                </ReturnHoder>
                <div>
                  <LabelTitle>Etapa 1 de 3</LabelTitle>
                </div>
                <div className="d-flex flex-row justify-content-center align-items-center flex-wrap w-100 mt-3">
                  <Select name="listaBancos" id="banco">
                    <option aria-label="bancos" value="" disabled={true} selected={true}>
                      Selecione o banco
                    </option>
                    {(response.data.ListaObjeto[0].content as any[]) &&
                      (response.data.ListaObjeto[0].content as any[]).map(banco => (
                        <option value={`${banco.id}_${banco.descricao}`}>
                          {banco.id} - {banco.descricao}
                        </option>
                      ))}
                  </Select>
                  <Input name="agencia" props={{ placeholder: 'Agência', mask: '9999' }} />
                  <FormRow>
                    <Input name="conta" props={{ placeholder: 'Conta', maxLength: 11 }} />
                    <Input name="digito" props={{ placeholder: 'Dígito', maxLength: 2 }} />
                  </FormRow>
                  <Input name="favorecido" props={{ placeholder: 'Favorecido' }} />
                  <InputCPFCNPJ name="CPF_CNPJ" props={{ placeholder: 'CPF ou CNPJ' }} />
                  <Select name="tipoConta" id="tipoConta">
                    <option aria-label="Operadoras" value="" disabled={true} selected={true}>
                      Tipo de conta
                    </option>
                    <option value="Conta Corrente">Conta Corrente</option>
                    <option value="Conta Poupança">Conta Poupança</option>
                  </Select>
                  <Input name="descricao" props={{ placeholder: 'Descrição' }} />
                </div>
              </>,
            );
            setLoading(false);
          })
          .catch(error => {
            window.scrollTo(0, 0);
            addAlert({
              type: 'error',
              title: 'Erro ao exibir dados',
              description: error,
            });
            setLoading(false);
          });
        setAlertHolder(undefined);
        break;

      case TransferStateEnum.OutrosBancosInfoValor:
        setBodyHolder(
          <>
            <ReturnHoder>
              <FiChevronLeft size={25} onClick={goBack} />
            </ReturnHoder>
            <div>
              <LabelTitle>Etapa 2 de 3</LabelTitle>
            </div>
            <div className="mt-3">
              <CardSmallLabel>Digite o Valor:</CardSmallLabel>
            </div>
            <div className="d-flex justify-content-center align-items-center mt-3">
              <div className="w-50">
                <CurrencyInput name="valor" />
              </div>
            </div>
          </>,
        );
        setAlertHolder(undefined);
        break;

      case TransferStateEnum.OutrosBancosFinalizar:
        setBodyHolder(undefined);
        setLoading(true);
        api
          .get(`KimMais.Api.Generica/0/0/Params%2FGetAllParams`)
          .then(value => {
            setAlertHolder(
              <>
                <ReturnHoder className="alert">
                  <FiChevronLeft size={25} onClick={goBack} />
                </ReturnHoder>
                <div className="d-flex flex-column align-items-start">
                  <div>
                    <LabelTitle className="text-light">Etapa 3 de 3</LabelTitle>
                  </div>
                  <div className="mt-3">
                    <LabelTitle className="text-light">
                      Confirme os dados da transferência:
                    </LabelTitle>
                    <LabelText className="text-white">
                      Nome:{' '}
                      {(formData as OutroBancoData) &&
                        (formData as OutroBancoData).Beneficiario.NomeBeneficiario}
                    </LabelText>
                    <LabelText className="text-white">
                      CPF:{' '}
                      {(formData as OutroBancoData) &&
                        (formData as OutroBancoData).Beneficiario.NumeroCPFCNPJ}
                    </LabelText>
                    <LabelText className="text-white">
                      Banco:{' '}
                      {(formData as OutroBancoData) &&
                        String((formData as OutroBancoData).Beneficiario.IdBanco).split('_')[1]}
                    </LabelText>
                    <LabelText className="text-white">
                      Agência:{' '}
                      {(formData as OutroBancoData) &&
                        (formData as OutroBancoData).Beneficiario.Agencia}
                    </LabelText>
                    <LabelText className="text-white">
                      Conta Corrente:{' '}
                      {(formData as OutroBancoData) &&
                        (formData as OutroBancoData).Beneficiario.ContaCorrente}{' '}
                      -{' '}
                      {(formData as OutroBancoData) &&
                        (formData as OutroBancoData).Beneficiario.DigitoContaCorrente}
                    </LabelText>
                  </div>
                  <div className="mt-3">
                    <LabelTitle className="text-light">Valor da transferência:</LabelTitle>
                    <LabelText className="text-white">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format((formData as OutroBancoData).Valor)}
                    </LabelText>
                  </div>
                  <div className="mt-3">
                    <LabelTitle className="text-light">Descrição:</LabelTitle>
                    <LabelText className="text-white">
                      {(formData as OutroBancoData) && (formData as OutroBancoData).Descricao}
                    </LabelText>
                  </div>
                  <hr className="text-light" />
                  <div className="d-flex align-self-center p-3 mb-2 bg-light text-dark rounded">
                    <LabelText>
                      A conveniência de transferência é de{' '}
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(
                        value.data.ListaObjeto[0] && value.data.ListaObjeto[0].vl_banco_ted,
                      )}
                    </LabelText>
                  </div>
                </div>
              </>,
            );
            setLoading(false);
          })
          .catch(error => {
            window.scrollTo(0, 0);
            addAlert({
              type: 'error',
              title: 'Erro ao comunicar com o servidor',
              description: error,
            });
            setLoading(false);
          });
        break;
    }
  }, [compState, favorecidoHolder, formData, goBack, addAlert, handlePesquisaConta]);

  const handleSelectTransfer = useCallback(
    data => {
      Yup.object()
        .required('Selecione uma forma de pagamento')
        .shape({
          CodigoFormaTransferencia: Yup.number().required('Selecione uma forma de transferência'),
        })
        .validate(data, {
          abortEarly: false,
        })
        .then(value => {
          switch (value.CodigoFormaTransferencia) {
            case TypeTransferData.ContasKIM:
              setFavorecidoHolder(undefined);
              setCompState(TransferStateEnum.ContaKimInfoFavorecido);
              break;

            case TypeTransferData.OutrosBancos:
              setCompState(TransferStateEnum.OutrosBancosInfoFavorecido);
              break;
          }
        })
        .catch(error => {
          if (error instanceof Yup.ValidationError) {
            formRef?.current.setErrors(getValidationErrors(error));
            setTimeout(() => {
              formRef.current?.setErrors({});
            }, 3000);
          } else {
            addAlert({
              title: 'Erro',
              description: 'Verifique os dados enviados',
              type: 'error',
            });
          }
        });
    },
    [addAlert],
  );

  const handleContaKimInfoFavorecido = useCallback(
    data => {
      Yup.object()
        .required('Preencha os dados')
        .shape({
          contaKim: Yup.number().required('Digite uma conta válida'),
          descricao: Yup.string().required('Digite uma descrição'),
        })
        .validate(data, {
          abortEarly: false,
        })
        .then(value => {
          setFormData({
            contaDestino: value.contaKim,
            valor: 0,
            descricao: value.descricao,
          } as ContaKimData);
          setCompState(TransferStateEnum.ContaKimInfoValor);
        })
        .catch(error => {
          if (error instanceof Yup.ValidationError) {
            formRef?.current.setErrors(getValidationErrors(error));
            setTimeout(() => {
              formRef.current?.setErrors({});
            }, 3000);
          } else {
            addAlert({
              title: 'Erro',
              description: 'Verifique os dados enviados',
              type: 'error',
            });
          }
        });
    },
    [addAlert],
  );

  const handleContaKimInfoValor = useCallback(
    data => {
      Yup.object()
        .required('Preencha os dados')
        .shape({
          valor: Yup.string()
            .required('Digite um valor')
            .test('validateValue', 'Informe um valor válido', value => {
              return Number(value.replace(/[^,\d]/g, '').replace(',', '.')) > 0;
            })
            .transform(value => value.replace(/[^,\d]/g, '').replace(',', '.')),
        })
        .validate(data, {
          abortEarly: false,
        })
        .then(value => {
          if (wallet.saldoDisponivelGlobal < Number(value.valor)) {
            window.scrollTo(0, 0);
            addAlert({
              type: 'error',
              title: 'Você não têm saldo suficiente!',
            });
          } else {
            setFormData(
              prev =>
                ({
                  contaDestino: (prev as ContaKimData).contaDestino,
                  valor: Number(value.valor),
                  descricao: (prev as ContaKimData).descricao,
                } as ContaKimData),
            );
            setCompState(TransferStateEnum.ContaKimFinalizar);
          }
        })
        .catch(error => {
          if (error instanceof Yup.ValidationError) {
            formRef?.current.setErrors(getValidationErrors(error));
            setTimeout(() => {
              formRef.current?.setErrors({});
            }, 3000);
          } else {
            window.scrollTo(0, 0);
            addAlert({
              title: 'Erro',
              description: 'Verifique os dados enviados',
              type: 'error',
            });
          }
        });
    },
    [addAlert, wallet],
  );

  const handleContaKimFinalizar = useCallback(
    data => {
      setLoading(true);
      api
        .post(
          `KimMais.Api.TransferenciaConta/api/TransferenciaConta?accsToken=${user.TokenUsuario}&usercode=${user.CodigoUsuario}`,
          {
            contaDestino: (formData as ContaKimData) && (formData as ContaKimData).contaDestino,
            valor: (formData as ContaKimData) && (formData as ContaKimData).valor,
            descricao: (formData as ContaKimData) && (formData as ContaKimData).descricao,
          },
        )
        .then(response => {
          setLoading(false);
          addAlert({
            title: 'Transferência',
            description: response.data.Mensagem,
            type: 'info',
          });
          window.scrollTo(0, 0);
          history.go(0);
        })
        .catch(error => {
          setLoading(false);
          addAlert({
            type: 'error',
            title: 'Erro ao enviar dados',
            description: error,
          });
          window.scrollTo(0, 0);
        });
    },
    [user, formData, addAlert, history],
  );

  const handleOutrosBancosInfoFavorecido = useCallback(
    data => {
      Yup.object()
        .required('Preencha os dados')
        .shape({
          listaBancos: Yup.string().typeError('Selecione um banco').required('Selecione um banco'),
          agencia: Yup.number()
            .max(9999, 'A agência precisa conter somente 4 dígitos')
            .typeError('Digite uma agência')
            .required('Digite uma agência'),
          conta: Yup.number()
            .typeError('Digite uma conta')
            .required('Digite uma conta')
            .min(10, 'A conta precisa conter de 2 a 11 dígitos')
            .max(99999999999, 'A conta precisa conter de 2 a 11 dígitos'),
          digito: Yup.string()
            .required('Digite um dígito')
            .max(2, 'Digite um dígito válido')
            .test('onlyDigits', 'Dígito inválido', value => {
              return value.replace(/[\d]/g, '').length === 0;
            }),
          favorecido: Yup.string().required('Digite um nome'),
          CPF_CNPJ: Yup.string()
            .required('Digite um CPF ou CNPJ')
            .test('onlyDigits', 'CPF ou CPNJ inválido', value => {
              let testValue = value.replace(/\D/g, '');
              return testValue.length > 11 ? validateCNPJ(testValue) : validateCPF(testValue);
            }),
          tipoConta: Yup.string().required('Digite o tipo da conta'),
          descricao: Yup.string().required('Digite uma descrição'),
        })
        .validate(data, {
          abortEarly: false,
        })
        .then(value => {
          let cpfCnpj = value.CPF_CNPJ.replace(/\D/g, '');
          setCompState(TransferStateEnum.OutrosBancosInfoValor);
          setFormData({
            Identificator: 13,
            Descricao: value.descricao,
            Beneficiario: {
              TipoPessoa: cpfCnpj.length > 11 ? 'juridica' : 'física',
              NumeroCPFCNPJ: cpfCnpj,
              NomeBeneficiario: value.favorecido,
              IdBanco: value.listaBancos,
              Agencia: value.agencia,
              DigitoAgencia: '',
              ContaCorrente: value.conta,
              DigitoContaCorrente: value.digito,
              TipoConta: value.tipoConta,
            },
            Valor: 0,
          } as OutroBancoData);
        })
        .catch(error => {
          if (error instanceof Yup.ValidationError) {
            formRef?.current.setErrors(getValidationErrors(error));
            setTimeout(() => {
              formRef.current?.setErrors({});
            }, 3000);
          } else {
            addAlert({
              title: 'Erro',
              description: 'Verifique os dados enviados',
              type: 'error',
            });
          }
        });
    },
    [addAlert],
  );

  const handleOutrosBancosInfoValor = useCallback(
    data => {
      Yup.object()
        .required('Preencha os dados')
        .shape({
          valor: Yup.string()
            .required('Digite um valor')
            .test('validateValue', 'Informe um valor válido', value => {
              return Number(value.replace(/[^,\d]/g, '').replace(',', '.')) > 0;
            })
            .transform(value => value.replace(/[^,\d]/g, '').replace(',', '.')),
        })
        .validate(data, {
          abortEarly: false,
        })
        .then(value => {
          if (wallet.saldoDisponivelGlobal < Number(value.valor)) {
            window.scrollTo(0, 0);
            addAlert({
              type: 'error',
              title: 'Você não têm saldo suficiente!',
            });
          } else {
            setFormData(
              prev =>
                ({
                  Identificator: 13,
                  Descricao: (prev as OutroBancoData).Descricao,
                  Beneficiario: {
                    TipoPessoa: (prev as OutroBancoData).Beneficiario.TipoPessoa,
                    NumeroCPFCNPJ: (prev as OutroBancoData).Beneficiario.NumeroCPFCNPJ,
                    NomeBeneficiario: (prev as OutroBancoData).Beneficiario.NomeBeneficiario,
                    IdBanco: (prev as OutroBancoData).Beneficiario.IdBanco,
                    Agencia: (prev as OutroBancoData).Beneficiario.Agencia,
                    DigitoAgencia: '',
                    ContaCorrente: (prev as OutroBancoData).Beneficiario.ContaCorrente,
                    DigitoContaCorrente: (prev as OutroBancoData).Beneficiario.DigitoContaCorrente,
                    TipoConta: (prev as OutroBancoData).Beneficiario.TipoConta,
                  },
                  Valor: Number(value.valor),
                } as OutroBancoData),
            );
            setCompState(TransferStateEnum.OutrosBancosFinalizar);
          }
        })
        .catch(error => {
          if (error instanceof Yup.ValidationError) {
            formRef?.current.setErrors(getValidationErrors(error));
            setTimeout(() => {
              formRef.current?.setErrors({});
            }, 3000);
          } else {
            window.scrollTo(0, 0);
            addAlert({
              title: 'Erro',
              description: 'Verifique os dados enviados',
              type: 'error',
            });
          }
        });
    },
    [addAlert, wallet],
  );

  const handleOutrosBancosFinalizar = useCallback(
    data => {
      setLoading(true);
      api
        .post(
          `KimMais.Api.TransferenciaBancos/api/TransferenciaBancos?accsToken=${user.TokenUsuario}&usercode=${user.CodigoUsuario}`,
          {
            Identificator:
              (formData as OutroBancoData) && (formData as OutroBancoData).Identificator,
            Descricao: (formData as OutroBancoData) && (formData as OutroBancoData).Descricao,
            Beneficiario: {
              TipoPessoa:
                (formData as OutroBancoData) &&
                (formData as OutroBancoData).Beneficiario.TipoPessoa,
              NumeroCPFCNPJ:
                (formData as OutroBancoData) &&
                (formData as OutroBancoData).Beneficiario.NumeroCPFCNPJ,
              NomeBeneficiario:
                (formData as OutroBancoData) &&
                (formData as OutroBancoData).Beneficiario.NomeBeneficiario,
              IdBanco:
                (formData as OutroBancoData) &&
                Number(String((formData as OutroBancoData).Beneficiario.IdBanco).split('_', 1)),
              Agencia:
                (formData as OutroBancoData) && (formData as OutroBancoData).Beneficiario.Agencia,
              DigitoAgencia:
                (formData as OutroBancoData) &&
                (formData as OutroBancoData).Beneficiario.DigitoAgencia,
              ContaCorrente:
                (formData as OutroBancoData) &&
                (formData as OutroBancoData).Beneficiario.ContaCorrente,
              DigitoContaCorrente:
                (formData as OutroBancoData) &&
                (formData as OutroBancoData).Beneficiario.DigitoContaCorrente,
              TipoConta:
                (formData as OutroBancoData) && (formData as OutroBancoData).Beneficiario.TipoConta,
            },
            Valor: (formData as OutroBancoData) && (formData as OutroBancoData).Valor,
          },
        )
        .then(response => {
          setLoading(false);
          addAlert({
            title: 'Transferência',
            description: response.data.Mensagem,
            type: 'info',
          });
          window.scrollTo(0, 0);
          history.go(0);
        })
        .catch(error => {
          setLoading(false);
          addAlert({
            type: 'error',
            title: 'Erro ao enviar dados',
            description: error,
          });
          window.scrollTo(0, 0);
        });
    },
    [user, formData, addAlert, history],
  );

  const handleSubmit = useCallback(
    data => {
      switch (+compState) {
        case TransferStateEnum.SelectTransfer:
          handleSelectTransfer(data);
          break;

        case TransferStateEnum.ContaKimInfoFavorecido:
          handleContaKimInfoFavorecido(data);
          break;

        case TransferStateEnum.ContaKimInfoValor:
          handleContaKimInfoValor(data);
          break;

        case TransferStateEnum.ContaKimFinalizar:
          handleContaKimFinalizar(data);
          break;

        case TransferStateEnum.OutrosBancosInfoFavorecido:
          handleOutrosBancosInfoFavorecido(data);
          break;

        case TransferStateEnum.OutrosBancosInfoValor:
          handleOutrosBancosInfoValor(data);
          break;

        case TransferStateEnum.OutrosBancosFinalizar:
          handleOutrosBancosFinalizar(data);
          break;
      }
    },
    [
      compState,
      handleSelectTransfer,
      handleContaKimInfoFavorecido,
      handleContaKimInfoValor,
      handleOutrosBancosInfoFavorecido,
      handleOutrosBancosInfoValor,
      handleContaKimFinalizar,
      handleOutrosBancosFinalizar,
    ],
  );

  const handleClick = useCallback(() => {
    if (compState % 1 > 0.8) {
      setCompState(TransferStateEnum.SelectTransfer);
      formRef.current.submitForm();
    } else {
      formRef.current.submitForm();
    }
  }, [formRef, compState]);

  return (
    <>
      <Form onSubmit={handleSubmit} ref={formRef}>
        <Loading loading={loading} />
        <FunctionalityCard
          title="Transferência"
          color="#6C63FF"
          components={{
            action: {
              text: 'Continuar',
              alertContent: alertHolder,
              alertText: 'Finalizar',
              startAlerting: compState % 1 > 0.8,
              onClick: handleClick,
            },
            progressBar: {
              current: compState,
              size: 2,
            },
          }}
        >
          {bodyHolder}
        </FunctionalityCard>
      </Form>
    </>
  );
};

export default Transfer;
