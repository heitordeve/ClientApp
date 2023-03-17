import React, { useState, useEffect, useCallback, useRef } from 'react';

import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { Form } from '@unform/web';

import { useAuth } from '../../../hooks/auth';
import { useAlert } from '../../../hooks/alert';

import api from '../../../services/api';

import { useDigitalWallet } from '../../../hooks/digitalWallet';

import getValidationErrors from '../../../utils/getValidationErrors';
import { NumberToReais } from '../../../utils/printHelper';
import { PaymentTypeEnum } from '../../../utils/resources';

import FunctionalityCard from '../../FunctionalityCard';
import Loading from '../../ui/loading';
import Label from '../../ui/label';
import { CustomRadioButton } from '../../ui/radioButton'
import Input, { CurrencyInput } from '../../ui/input';

import { useHistory } from 'react-router-dom';

import {
  BiTransferAlt
} from 'react-icons/bi';

import {
  FaPiggyBank
} from 'react-icons/fa';

import {
  FiSmartphone,
  FiChevronLeft
} from 'react-icons/fi';

import {
  CardBox,
  CardSmallLabel,
  CardHr,
  ReturnHoder
} from '../styles'

import {
  ScrollBox,
  BancoDataHolder,
  InnerIcon,
  AlertCard
} from './styles';

//Obs: X.9 === Finalize
enum AddMoneyCardStateEnum {
  InfoAmount = 0,
  SelectPaymentMethod = 1,
  //2 - TED flow
  TEDFinalize = 2.9,
  //3 - Transfer flow
  TransferSelectBank = 3.1,
  TransferInfoBankData = 3.5,
  TransferFinalize = 3.9,
  //4 - Deposit flow
  DepositSelectBank = 4.1,
  DepositFinalize = 4.9
}

enum LocalPaymentTypeEnum {
  TED = -1,
  Transfer = PaymentTypeEnum.TransferBank,
  Deposit = PaymentTypeEnum.Deposit
}

interface NovoPedidoCashInBody {
  CodigoUsuario: number;
  ValorTotalCashIn: number;
  CodigoFormaPagamento: LocalPaymentTypeEnum;
  AgenciaBancaria: string | number;
  NumeroContaBancaria: string | number;
  BancoFastCashParaPagamento: string;
}

const AddMoneyCard: React.FC = () => {

  const { user } = useAuth();
  const { addAlert } = useAlert();

  const wallet = useDigitalWallet();

  const formRef = useRef<FormHandles>();

  const history = useHistory();

  const [compState, setCompState] = useState<AddMoneyCardStateEnum>(AddMoneyCardStateEnum.InfoAmount);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<NovoPedidoCashInBody>();
  const [bodyHolder, setBodyHolder] = useState<React.ReactNode>();
  const [alertHolder, setAlertHolder] = useState<React.ReactNode>();

  const goBack = useCallback(() => {
    setCompState(prev => {
      let result = AddMoneyCardStateEnum.InfoAmount;
      switch (+prev) {
        case AddMoneyCardStateEnum.TEDFinalize:
          result = AddMoneyCardStateEnum.SelectPaymentMethod;
          break;
        case AddMoneyCardStateEnum.TransferSelectBank:
          result = AddMoneyCardStateEnum.SelectPaymentMethod;
          break;
        case AddMoneyCardStateEnum.TransferInfoBankData:
          result = AddMoneyCardStateEnum.TransferSelectBank;
          break;
        case AddMoneyCardStateEnum.TransferFinalize:
          result = AddMoneyCardStateEnum.TransferInfoBankData;
          break;
        case AddMoneyCardStateEnum.DepositSelectBank:
          result = AddMoneyCardStateEnum.SelectPaymentMethod;
          break;
        case AddMoneyCardStateEnum.DepositFinalize:
          result = AddMoneyCardStateEnum.DepositSelectBank;
          break;
      }
      return result;
    });
  }, []);

  useEffect(() => {
    switch (+compState) {
      case AddMoneyCardStateEnum.InfoAmount:
        setAlertHolder(undefined);
        setBodyHolder(<>
          <CardSmallLabel>Insira o valor desejado</CardSmallLabel>
          <CurrencyInput name="ValorTotalCashIn" />
        </>);
        break;
      case AddMoneyCardStateEnum.SelectPaymentMethod:
        setAlertHolder(undefined);
        setBodyHolder(<>
          <ReturnHoder><FiChevronLeft size={25} onClick={goBack} /></ReturnHoder>
          <CardSmallLabel>Selecione uma forma de pagamento</CardSmallLabel>
          <CustomRadioButton
            name="CodigoFormaPagamento"
            options={[
              {
                props: {
                  id: 'FormaPagamentoTED',
                  defaultChecked: true,
                  value: LocalPaymentTypeEnum.TED
                },
                render: input => <CardBox>
                  {input}
                  <FiSmartphone size={25} />
                  <Label>TED</Label>
                </CardBox>
              },
              {
                props: {
                  id: 'FormaPagamentoTransfer',
                  value: LocalPaymentTypeEnum.Transfer
                },
                render: input => <CardBox>
                  {input}
                  <BiTransferAlt size={25} />
                  <Label>Transferência</Label>
                </CardBox>
              },
              {
                props: {
                  id: 'FormaPagamentoDeposit',
                  value: LocalPaymentTypeEnum.Deposit
                },
                render: input => <CardBox>
                  {input}
                  <FaPiggyBank size={25} />
                  <Label>Depósito</Label>
                </CardBox>
              }
            ]}
          />
        </>);
        break;
      case AddMoneyCardStateEnum.TEDFinalize:
        setLoading(true);
        api.get(`/KimMais.API.Generica/${user.TokenUsuario}/${user.CodigoUsuario}/Banco%2FListaBancoContaCashIn`)
          .then(response => {
            setLoading(false);
            if (response.data.Status === 0) {
              setBodyHolder(undefined);
              if (Array.isArray(response.data.ListaObjeto) && response.data.ListaObjeto.length > 0) {
                setAlertHolder(<>
                  <Label><b>Realize um TED utilizando os dados abaixo:</b></Label>
                  <ScrollBox className="alert">
                    {(response.data.ListaObjeto as any[]).reduce((prev, curr) => <>
                      {prev}
                      <CardHr className="white-hr" />
                      <BancoDataHolder>
                        <p>BANCO: <b>{curr['nu_banco']} - {curr['nm_banco']}</b></p>
                        <p>AGÊNCIA: <b>{curr['ds_age_num']}</b></p>
                        <p>CONTA: <b>{curr['ds_num_conta']}-{curr['ds_num_conta_dv']}</b></p>
                        <p>VALOR: <b>{NumberToReais(formData.ValorTotalCashIn)}</b></p>
                        <p>FAVORECIDO: <b>{wallet.codigoConta} {curr['ds_conta']}</b></p>
                        <p>CNPJ: <b>{curr['nu_cnpj_favorecido'].replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/, '$1.$2.$3/$4-$5')}</b></p>
                      </BancoDataHolder>
                    </>, <></>)}
                    <AlertCard className="mt-3">
                      <p><b>ATENÇÂO</b></p>
                      <p>Crèditos efetuados das <b>17:31 doa dia anterior até às 11:00 do mesmo dia,</b> sensibilizarão as Contas de Pagamento <b>até às 12:00</b></p>
                      <p>Crèditos efetuados das <b>11:01 até às 15:30,</b> sensibilizarão as Contas de Pagamento <b>até às 16:30</b></p>
                      <p>Crèditos efetuados das <b>15:31 até às 17:30,</b> sensibilizarão as Contas de Pagamento <b>até às 18:30</b></p>
                    </AlertCard>
                  </ScrollBox>
                </>);
              }
            } else {
              addAlert({
                title: 'Erro',
                description: 'Erro ao buscar dados para TED, tente mais tarde',
                type: 'error'
              });
              goBack();
              window.scrollTo(0, 0);
            }
          }).catch(() => {
            setLoading(false);
            addAlert({
              title: 'Erro',
              description: 'Erro ao buscar dados para TED, tente mais tarde',
              type: 'error'
            });
            goBack();
            window.scrollTo(0, 0);
          });
        break;
      case AddMoneyCardStateEnum.TransferSelectBank:
        setLoading(true);
        api.get(`/KimMais.API.Generica/${user.TokenUsuario}/${user.CodigoUsuario}/Pedido%2FObterBancos%3FFormaPag%3D${formData?.CodigoFormaPagamento}`)
          .then(response => {
            setLoading(false);
            if (response.data.Status === 0 || response.data.Status === 200) {
              setAlertHolder(undefined);
              if (Array.isArray(response.data.ListaObjeto) && response.data.ListaObjeto.length > 0) {
                setBodyHolder(<>
                  <ReturnHoder><FiChevronLeft size={25} onClick={goBack} /></ReturnHoder>
                  <CardSmallLabel>Selecione um banco para a transferência:</CardSmallLabel>
                  <ScrollBox>
                    <CustomRadioButton
                      name="BancoFastCashParaPagamento"
                      options={(response.data.ListaObjeto[0] as any[]).map((e) => ({
                        props: {
                          id: `${e['Name']}-BancoFastCashParaPagamento`,
                          value: e['Id']
                        },
                        render: (input) => <CardBox>
                          {input}
                          <InnerIcon>
                            <img src={e['Icon']} alt={`logo ${e['Name']}`} />
                          </InnerIcon>
                          <Label>{e['Name']}</Label>
                        </CardBox>
                      }))}
                    />
                  </ScrollBox>
                </>);
              } else {
                setBodyHolder(undefined);
              }
            } else if (response.data.Status === 1) {
              addAlert({
                title: 'Erro',
                description: 'Erro ao buscar Bancos, tente mais tarde',
                type: 'error'
              });
              goBack();
              window.scrollTo(0, 0);
            }
          }).catch(() => {
            setLoading(false);
            addAlert({
              title: 'Erro',
              description: 'Erro ao buscar Bancos, tente mais tarde',
              type: 'error'
            });
            goBack();
            window.scrollTo(0, 0);
          });
        break;
      case AddMoneyCardStateEnum.TransferInfoBankData:
        setAlertHolder(undefined);
        setBodyHolder(<>
          <ReturnHoder><FiChevronLeft size={25} onClick={goBack} /></ReturnHoder>
          <CardSmallLabel>Insira os valores desejados para a transferência</CardSmallLabel>
          <p className="mb-0">Agência:</p>
          <Input name="AgenciaBancaria" props={{ mask: '9999' }} />
          <p className="mb-0 mt-1">Conta:</p>
          <Input name="NumeroContaBancaria" props={{ type: 'string', maxLength: 11 }} />
        </>);
        break;
      case AddMoneyCardStateEnum.TransferFinalize:
        setLoading(true);
        api.post(`/KimMais.API.NovoPedidoCashIn/${user.TokenUsuario}/${user.CodigoUsuario}`, formData)
          .then(response => {
            setLoading(false);
            if (response.data.Status === 0) {
              setBodyHolder(undefined);
              if (Array.isArray(response.data.ListaObjeto) && response.data.ListaObjeto.length > 0) {
                setAlertHolder(<>
                  <Label>Seu pedido foi gerado com sucesso! Agora, realize uma transferência bancária utilizando os dados descritos abaixo:</Label>
                  <ScrollBox className="alert">
                    {(response.data.ListaObjeto as any[]).reduce((prev, curr) => <>
                      {prev}
                      {Array.isArray(curr.Parameters) && <>
                        <CardHr className="white-hr" />
                        <BancoDataHolder>
                          <p>BANCO: <b>{(curr.Parameters as any[]).find(e => e.Id === 'bank')?.Value}</b></p>
                          <p>AGÊNCIA: <b>{(curr.Parameters as any[]).find(e => e.Id === 'agency')?.Value}</b></p>
                          <p>CONTA: <b>{(curr.Parameters as any[]).find(e => e.Id === 'account')?.Value}</b></p>
                          <p>VALOR: <b>{NumberToReais(formData.ValorTotalCashIn)}</b></p>
                          <p>FAVORECIDO: <b>{(curr.Parameters as any[]).find(e => e.Id === 'accountholder')?.Value}</b></p>
                          <p>CNPJ: <b>{(curr.Parameters as any[]).find(e => e.Id === 'accountholderdocument')?.Value}</b></p>
                        </BancoDataHolder>
                      </>}
                    </>, <></>)}
                  </ScrollBox>
                </>);
              }
            } else {
              addAlert({
                title: 'Erro',
                description: 'Erro ao efetuar novo pedido, tente mais tarde',
                type: 'error'
              });
              goBack();
              window.scrollTo(0, 0);
            }
          }).catch(() => {
            setLoading(false);
            addAlert({
              title: 'Erro',
              description: 'Erro ao efetuar novo pedido, tente mais tarde',
              type: 'error'
            });
            goBack();
            window.scrollTo(0, 0);
          });
        break;
      case AddMoneyCardStateEnum.DepositSelectBank:
        setLoading(true);
        api.get(`/KimMais.API.Generica/${user.TokenUsuario}/${user.CodigoUsuario}/Pedido%2FObterBancos%3FFormaPag%3D${formData?.CodigoFormaPagamento}`)
          .then(response => {
            setLoading(false);
            if (response.data.Status === 0 || response.data.Status === 200) {
              setAlertHolder(undefined);
              if (Array.isArray(response.data.ListaObjeto) && response.data.ListaObjeto.length > 0) {
                setBodyHolder(<>
                  <ReturnHoder><FiChevronLeft size={25} onClick={goBack} /></ReturnHoder>
                  <CardSmallLabel>Selecione um banco para o depósito:</CardSmallLabel>
                  <ScrollBox>
                    <CustomRadioButton
                      name="BancoFastCashParaPagamento"
                      options={(response.data.ListaObjeto[0] as any[]).map((e) => ({
                        props: {
                          id: `${e['Name']}-BancoFastCashParaPagamento`,
                          value: e['Id']
                        },
                        render: (input) => <CardBox>
                          {input}
                          <InnerIcon>
                            <img src={e['Icon']} alt={`logo ${e['Name']}`} />
                          </InnerIcon>
                          <Label>{e['Name']}</Label>
                        </CardBox>
                      }))}
                    />
                  </ScrollBox>
                </>);
              } else {
                setBodyHolder(undefined);
              }
            } else if (response.data.Status === 1) {
              addAlert({
                title: 'Erro',
                description: 'Erro ao buscar Bancos, tente mais tarde',
                type: 'error'
              });
              goBack();
              window.scrollTo(0, 0);
            }
          }).catch(() => {
            setLoading(false);
            addAlert({
              title: 'Erro',
              description: 'Erro ao buscar Bancos, tente mais tarde',
              type: 'error'
            });
            goBack();
            window.scrollTo(0, 0);
          });
        break;
      case AddMoneyCardStateEnum.DepositFinalize:
        setLoading(true);
        Yup.object().shape({
          AgenciaBancaria: Yup.number().required(),
          BancoFastCashParaPagamento: Yup.string().required(),
          CodigoFormaPagamento: Yup.number().required(),
          CodigoUsuario: Yup.number().required()
        }).validate(formData).then(() => {
          api.post(`/KimMais.API.NovoPedidoCashIn/${user.TokenUsuario}/${user.CodigoUsuario}`, formData)
            .then(response => {
              setLoading(false);
              if (response.data.Status === 0) {
                setBodyHolder(undefined);
                if (Array.isArray(response.data.ListaObjeto) && response.data.ListaObjeto.length > 0) {
                  setAlertHolder(<>
                    <Label>Seu pedido foi gerado com sucesso! Agora, realize um depósito utilizando os dados descritos abaixo:</Label>
                    <ScrollBox className="alert">
                      {(response.data.ListaObjeto as any[]).reduce((prev, curr) => <>
                        {prev}
                        {Array.isArray(curr.Parameters) && <>
                          <CardHr className="white-hr" />
                          <BancoDataHolder>
                            <p>BANCO: <b>{(curr.Parameters as any[]).find(e => e.Id === 'bank')?.Value}</b></p>
                            <p>AGÊNCIA: <b>{(curr.Parameters as any[]).find(e => e.Id === 'agency')?.Value}</b></p>
                            <p>CONTA: <b>{(curr.Parameters as any[]).find(e => e.Id === 'account')?.Value}</b></p>
                            <p>VALOR: <b>{NumberToReais(formData.ValorTotalCashIn)}</b></p>
                            <p>FAVORECIDO: <b>{(curr.Parameters as any[]).find(e => e.Id === 'accountholder')?.Value}</b></p>
                            <p>CNPJ: <b>{(curr.Parameters as any[]).find(e => e.Id === 'accountholderdocument')?.Value}</b></p>
                          </BancoDataHolder>
                        </>}
                      </>, <></>)}
                    </ScrollBox>
                  </>);
                }
              } else {
                addAlert({
                  title: 'Erro',
                  description: 'Erro ao efetuar novo pedido, tente mais tarde',
                  type: 'error'
                });
                goBack();
                window.scrollTo(0, 0);
              }
            }).catch(() => {
              setLoading(false);
              addAlert({
                title: 'Erro',
                description: 'Erro ao efetuar novo pedido, tente mais tarde',
                type: 'error'
              });
              goBack();
              window.scrollTo(0, 0);
            });
        }).catch(() => {});
        break;
    }
  }, [
    user,
    wallet,
    formData,
    compState,
    goBack,
    addAlert
  ]);

  const handleInfoAmount = useCallback(data => {
    formRef?.current.setErrors({});
    Yup.object().required('Informe a o valor desejado').shape({
      ValorTotalCashIn: Yup.string().required()
        .test('validateValue', 'Informe um valor válido', value => {
          return Number(value.replace(/[^,\d]/g, '').replace(',', '.')) > 0
        }).transform(value => value.replace(/[^,\d]/g, '').replace(',', '.'))
    }).validate(data, {
      abortEarly: false
    }).then(value => {
      setCompState(AddMoneyCardStateEnum.SelectPaymentMethod);
      setFormData({
        AgenciaBancaria: 0,
        BancoFastCashParaPagamento: '',
        CodigoFormaPagamento: LocalPaymentTypeEnum.TED,
        CodigoUsuario: user.CodigoUsuario,
        NumeroContaBancaria: 0,
        ValorTotalCashIn: Number(value.ValorTotalCashIn)
      });
    }).catch(error => {
      if (error instanceof Yup.ValidationError) {
        formRef?.current.setErrors(getValidationErrors(error));
        setTimeout(() => { formRef.current?.setErrors({}); }, 3000);
      } else {
        addAlert({
          title: 'Erro',
          description: 'Verifique os dados enviados',
          type: 'error'
        });
        window.scrollTo(0, 0);
      }
    });
  }, [user, formRef, addAlert]);

  const handleSelectPaymentMethod = useCallback(data => {
    formRef?.current.setErrors({});
    Yup.object().required('Selecione uma forma de pagamento').shape({
      CodigoFormaPagamento: Yup.number().required('Selecione uma forma de pagamento')
    }).validate(data, {
      abortEarly: false
    }).then(value => {
      switch (value.CodigoFormaPagamento) {
        case LocalPaymentTypeEnum.TED:
          setCompState(AddMoneyCardStateEnum.TEDFinalize);
          setFormData(prev => ({
            AgenciaBancaria: 0,
            BancoFastCashParaPagamento: '',
            CodigoFormaPagamento: value.CodigoFormaPagamento,
            CodigoUsuario: user.CodigoUsuario,
            NumeroContaBancaria: 0,
            ValorTotalCashIn: prev.ValorTotalCashIn
          }));
          break;
        case LocalPaymentTypeEnum.Transfer:
          setCompState(AddMoneyCardStateEnum.TransferSelectBank);
          setFormData(prev => ({
            AgenciaBancaria: 0,
            BancoFastCashParaPagamento: '',
            CodigoFormaPagamento: value.CodigoFormaPagamento,
            CodigoUsuario: user.CodigoUsuario,
            NumeroContaBancaria: 0,
            ValorTotalCashIn: prev.ValorTotalCashIn
          }));
          break;
        case LocalPaymentTypeEnum.Deposit:
          setCompState(AddMoneyCardStateEnum.DepositSelectBank);
          setFormData(prev => ({
            AgenciaBancaria: 0,
            BancoFastCashParaPagamento: '',
            CodigoFormaPagamento: value.CodigoFormaPagamento,
            CodigoUsuario: user.CodigoUsuario,
            NumeroContaBancaria: 0,
            ValorTotalCashIn: prev.ValorTotalCashIn
          }));
          break;
        default:
          addAlert({
            title: 'Erro',
            description: 'Selecione uma forma de pagamento',
            type: 'error'
          });
          break;
      }
    }).catch(error => {
      if (error instanceof Yup.ValidationError) {
        formRef?.current.setErrors(getValidationErrors(error));
        setTimeout(() => { formRef.current?.setErrors({}); }, 3000);
      } else {
        addAlert({
          title: 'Erro',
          description: 'Verifique os dados enviados',
          type: 'error'
        });
        window.scrollTo(0, 0);
      }
    });
  }, [user, formRef, addAlert]);

  const handleTransferSelectBank = useCallback((data) => {
    formRef?.current.setErrors({});
    Yup.object().required('Selecione um banco para a transferência').shape({
      BancoFastCashParaPagamento: Yup.string().required('Selecione um banco para a transferência')
    }).validate(data, {
      abortEarly: false
    }).then(value => {
      setCompState(AddMoneyCardStateEnum.TransferInfoBankData);
      setFormData(prev => ({
        AgenciaBancaria: 0,
        BancoFastCashParaPagamento: value.BancoFastCashParaPagamento,
        CodigoFormaPagamento: LocalPaymentTypeEnum.Transfer,
        CodigoUsuario: user.CodigoUsuario,
        NumeroContaBancaria: 0,
        ValorTotalCashIn: prev.ValorTotalCashIn,
      }));

    }).catch(error => {
      if (error instanceof Yup.ValidationError) {
        formRef?.current.setErrors(getValidationErrors(error));
        setTimeout(() => { formRef.current?.setErrors({}); }, 3000);
      } else {
        addAlert({
          title: 'Erro',
          description: 'Verifique os dados enviados',
          type: 'error'
        });
        window.scrollTo(0, 0);
      }
    });
  }, [user, formRef, addAlert]);

  const handleTransferInfoBankData = useCallback(data => {
    formRef?.current.setErrors({});
    Yup.object().required('Informe os dados para a transferência').shape({
      AgenciaBancaria: Yup.string()
        .required('informe a agência')
        .min(4, 'Agência deve conter 4 dígitos')
        .max(4, 'Agência deve conter 4 dígitos')
        .test('only numbers', 'Agência deve conter 4 dígitos', value => {
          return value.replace(/\d/g, '').length === 0;
        }),
      NumeroContaBancaria: Yup.string()
        .required('informe a conta')
        .test('only numbers', 'Conta só pode conter números', value => {
          return value.replace(/\d/g, '').length === 0;
        }).min(2, 'A conta precisa conter de 2 a 11 dígitos')
        .max(11, 'A conta precisa conter de 2 a 11 dígitos'),
    }).validate(data, {
      abortEarly: false
    }).then(value => {
      setCompState(AddMoneyCardStateEnum.TransferFinalize);
      setFormData(prev => ({
        AgenciaBancaria: value.AgenciaBancaria,
        BancoFastCashParaPagamento: prev.BancoFastCashParaPagamento,
        CodigoFormaPagamento: LocalPaymentTypeEnum.Transfer,
        CodigoUsuario: user.CodigoUsuario,
        NumeroContaBancaria: value.NumeroContaBancaria,
        ValorTotalCashIn: prev.ValorTotalCashIn
      }));
    }).catch(error => {
      if (error instanceof Yup.ValidationError) {
        formRef?.current.setErrors(getValidationErrors(error));
        setTimeout(() => { formRef.current?.setErrors({}); }, 3000);
      } else {
        addAlert({
          title: 'Erro',
          description: 'Verifique os dados enviados',
          type: 'error'
        });
        window.scrollTo(0, 0);
      }
    });
  }, [user, formRef, addAlert]);

  const handleDepositSelectBank = useCallback((data) => {
    formRef?.current.setErrors({});
    Yup.object().required('Selecione um banco para o depósito').shape({
      BancoFastCashParaPagamento: Yup.string().required('Selecione um banco para o depósito')
    }).validate(data, {
      abortEarly: false
    }).then(value => {
      setCompState(AddMoneyCardStateEnum.DepositFinalize);
      setFormData(prev => ({
        AgenciaBancaria: 0,
        BancoFastCashParaPagamento: value.BancoFastCashParaPagamento,
        CodigoFormaPagamento: LocalPaymentTypeEnum.Deposit,
        CodigoUsuario: user.CodigoUsuario,
        NumeroContaBancaria: 0,
        ValorTotalCashIn: prev.ValorTotalCashIn,
      }));
    }).catch(error => {
      if (error instanceof Yup.ValidationError) {
        formRef?.current.setErrors(getValidationErrors(error));
        setTimeout(() => { formRef.current?.setErrors({}); }, 3000);
      } else {
        addAlert({
          title: 'Erro',
          description: 'Verifique os dados enviados',
          type: 'error'
        });
        window.scrollTo(0, 0);
      }
    });
  }, [user, formRef, addAlert]);

  const handleSubmit = useCallback((data) => {
    switch (+compState) {
      case AddMoneyCardStateEnum.InfoAmount:
        handleInfoAmount(data);
        break;
      case AddMoneyCardStateEnum.SelectPaymentMethod:
        handleSelectPaymentMethod(data);
        break;
      case AddMoneyCardStateEnum.TransferSelectBank:
        handleTransferSelectBank(data);
        break;
      case AddMoneyCardStateEnum.TransferInfoBankData:
        handleTransferInfoBankData(data);
        break;
      case AddMoneyCardStateEnum.DepositSelectBank:
        handleDepositSelectBank(data);
        break;
    }
  }, [
    compState,
    handleInfoAmount,
    handleDepositSelectBank,
    handleTransferSelectBank,
    handleSelectPaymentMethod,
    handleTransferInfoBankData,
  ]);

  const handleClick = useCallback(() => {
    if ((compState % 1) > 0.8) {
      setCompState(AddMoneyCardStateEnum.InfoAmount);
      setFormData(undefined);
      setBodyHolder(undefined);
      history.go(0);
      window.scrollTo(0, 0);
    } else {
      formRef?.current.submitForm();
    }
  }, [formRef, compState, history]);

  return <>
    <Loading loading={loading} />
    <Form ref={formRef} onSubmit={handleSubmit}>
      <FunctionalityCard
        title="Adicionar dinheiro"
        color="#672ED7"
        components={{
          action: {
            startAlerting: (compState % 1) > 0.8,
            alertContent: alertHolder,
            alertText: 'Finalizar',
            text: 'Continuar',
            onClick: handleClick,
          },
          progressBar: {
            current: compState,
            size: 3
          }
        }}
      >
        {bodyHolder}
      </FunctionalityCard>
    </Form>
  </>
}

export default AddMoneyCard;
