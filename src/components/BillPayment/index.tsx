import React, { useState, useCallback, useRef } from 'react';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { format, parseISO } from 'date-fns';

import { useAlert } from '../../hooks/alert';

import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import { useDigitalWallet } from '../../hooks/digitalWallet';

import { TextAreaMask } from '../ui/textArea';
import Input from '../ui/input';
import Loading from '../ui/loading';

import getValidationErrors from '../../utils/getValidationErrors';


import { CardHr, CardSubtitle, ContentCard } from './styles';

import FunctionalityCard from '../FunctionalityCard';

import 'bootstrap/dist/css/bootstrap.min.css';

interface BillPaymentFormData {
  codBarras: string;
}

interface BillInfoData {
  ValidateBarCode: {
    Description: string;
  };
  PaymentInfoNPC: {
    DueDate: string;
    FormattedDueDate?: string;
    BillValue: string;
    FormattedBillValue?: string;
    NextUtilDay: string;
    BarCodeNumber: string;
    Traders: {
      Recipient: string;
      RecipientDocument: string;
      PayerName: string;
      PayerDocument: string;
    };
    ComputedBillValues: {
      CalculatedInterestAmount: string;
      FormattedCalculatedInterestAmount?: string;
      CalculatedFineValue: string;
      FormattedCalculatedFineValue?: string;
      DiscountValueCalculated: string;
      FormattedDiscountValueCalculated?: string;
      TotalAmountToCharge: string;
      PaymentAmountUpdated: string;
      FormattedPaymentAmountUpdated?: string;
      ComputedDate: string;
      FormattedComputedDate?: string;
    };
  };
}

const BillPayment: React.FC = () => {
  const { user } = useAuth();
  const { addAlert } = useAlert();
  const [pagina, setPagina] = useState<number>(0);
  const [billInfo, setBillInfo] = useState<BillInfoData>();
  const boletoFormRef = useRef<FormHandles>(null);
  const senhaFormRef = useRef<FormHandles>(null);
  const [finalizado, setFinalizado] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState<string>('');
  const wallet = useDigitalWallet();

  const validateBillPayment = useCallback(
    async (data: BillPaymentFormData, callback: (status: boolean) => void) => {
      try {
        setLoading(true);
        await api
          .get(
            `KimMais.Api.ValidarCodigoBarras/${user.TokenUsuario}/${user.CodigoUsuario}?codBarras=${data.codBarras}`,
          )
          .then(response => {
            if (response.data.Status === 0) {
              callback(true);
              const temp: BillInfoData = response.data.ListaObjeto[0].Result;
              temp.PaymentInfoNPC.FormattedDueDate = format(
                parseISO(temp.PaymentInfoNPC.DueDate),
                'dd/MM/yyyy',
              );
              temp.PaymentInfoNPC.ComputedBillValues.FormattedComputedDate = format(
                parseISO(temp.PaymentInfoNPC.ComputedBillValues.ComputedDate),
                'dd/MM/yyyy',
              );
              temp.PaymentInfoNPC.FormattedBillValue = new Intl.NumberFormat(
                'pt-BR',
                { style: 'currency', currency: 'BRL' },
              ).format(parseFloat(temp.PaymentInfoNPC.BillValue));
              temp.PaymentInfoNPC.ComputedBillValues.FormattedDiscountValueCalculated = new Intl.NumberFormat(
                'pt-BR',
                { style: 'currency', currency: 'BRL' },
              ).format(
                parseFloat(
                  temp.PaymentInfoNPC.ComputedBillValues.DiscountValueCalculated,
                ),
              );
              temp.PaymentInfoNPC.ComputedBillValues.FormattedCalculatedInterestAmount = new Intl.NumberFormat(
                'pt-BR',
                { style: 'currency', currency: 'BRL' },
              ).format(
                parseFloat(
                  temp.PaymentInfoNPC.ComputedBillValues.CalculatedInterestAmount,
                ),
              );
              temp.PaymentInfoNPC.ComputedBillValues.FormattedCalculatedFineValue = new Intl.NumberFormat(
                'pt-BR',
                { style: 'currency', currency: 'BRL' },
              ).format(
                parseFloat(
                  temp.PaymentInfoNPC.ComputedBillValues.CalculatedFineValue,
                ),
              );
              temp.PaymentInfoNPC.ComputedBillValues.FormattedPaymentAmountUpdated = new Intl.NumberFormat(
                'pt-BR',
                { style: 'currency', currency: 'BRL' },
              ).format(
                parseFloat(
                  temp.PaymentInfoNPC.ComputedBillValues.PaymentAmountUpdated,
                ),
              );
              setBillInfo(temp);
              setLoading(false);
            } else {
              setLoading(false);
              addAlert({
                type: 'error',
                title: 'Erro',
                description: response.data.Mensagem
              });
              window.scrollTo(0, 0);
              callback(false);
            }
          }).catch(() => {
            callback(false);
            setLoading(false);
            window.scrollTo(0, 0);
          });
      } catch (error) {
        callback(false);
        setLoading(false);
        window.scrollTo(0, 0);
      }
    },
    [user, addAlert],
  );
  const handleBillPayment = useCallback(
    async (callback: (status: boolean, mensagem: string) => void) => {
      setLoading(true);
      if (billInfo != null) {
        try {
          await api
            .post(
              `KimMais.Api.FazerPagamento/${user.CodigoUsuario}/${user.TokenUsuario}/`,
              {
                Descricao: billInfo.ValidateBarCode.Description,
                CodigoBarras: billInfo.PaymentInfoNPC.BarCodeNumber,
                DataValidade: billInfo.PaymentInfoNPC.FormattedDueDate,
                Cedente: billInfo.PaymentInfoNPC.Traders.Recipient,
                DocumentoCedente:
                  billInfo.PaymentInfoNPC.Traders.RecipientDocument,
                Desconto:
                  billInfo.PaymentInfoNPC.ComputedBillValues
                    .DiscountValueCalculated,
                Juros:
                  billInfo.PaymentInfoNPC.ComputedBillValues
                    .CalculatedInterestAmount,
                Multa:
                  billInfo.PaymentInfoNPC.ComputedBillValues
                    .CalculatedFineValue,
                Quantia: billInfo.PaymentInfoNPC.BillValue,
              },
            )
            .then(response => {
              if (response.data.Status === 0) {
                callback(true, response.data.Mensagem);
                setMensagem(response.data.Mensagem);
                addAlert({
                  title: 'Boleto',
                  type: 'info',
                  description: response.data.Mensagem,
                });
              } else {
                callback(false, 'Error comunicar com a API');
              }
              setLoading(false);
            })
            .catch(() => {
              callback(false, 'Error comunicar com a API');
              setLoading(false);
            });
        } catch (error) {
          callback(false, 'Error comunicar com a API');
          setLoading(false);
        }
      }
    },
    [user, billInfo, addAlert],
  );

  const submitBoletoFormData = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    boletoFormRef.current?.submitForm();
  }, [boletoFormRef]);

  const handleSubmit = useCallback(async (data: BillPaymentFormData) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      boletoFormRef.current?.setErrors({});

      const schema = Yup.object()
        .required()
        .shape({
          codBarras: Yup.string()
            .required()
            .test(
              'Código de Barras',
              'Código de Barras não existente',
              value => {
                if (typeof value === 'string') {
                  if (value.replace(/\D/g, '').length === 47) {
                    return true;
                  }
                  return false;
                }
                return false;
              },
            ).transform(value => {
              return value?.replace(/\D/g, '');
            }),
        });

      await schema
        .validate(data, {
          abortEarly: false,
        })
        .then(value => {
          validateBillPayment(value, status => {
            if (status) {
              setPagina(1);
            } else {
              setPagina(0);
            }
          });
        });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        boletoFormRef.current?.setErrors(errors);
        setTimeout(() => { boletoFormRef.current?.setErrors({}); }, 3000);
      }
    }
  }, [boletoFormRef, validateBillPayment]);

  const submitPassword = useCallback(
    async (callback: (status: boolean) => void) => {
      const data = senhaFormRef.current?.getData();
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        senhaFormRef.current?.setErrors({});

        const schema = Yup.object()
          .required()
          .shape({
            senha: Yup.string()
              .required()
              .test('Senha', 'Senha inválida', value => {
                if (typeof value === 'string') {
                  if (value.length >= 5) {
                    return true;
                  }
                  return false;
                }
                return false;
              }),
          });

        await schema
          .validate(data, {
            abortEarly: false,
          })
          .then(value => {
            setLoading(true);
            api
              .get(
                `KimMais.Api.VerificarSenha/${user.TokenUsuario}/${user.CodigoUsuario}?senha=${value.senha}`,
              )
              .then(response => {
                if (response.data && response.data.Status === 0) {
                  setLoading(false);
                  callback(true);
                } else {
                  setLoading(false);
                  callback(false);
                  addAlert({
                    type: 'error',
                    title: 'Erro',
                    description: response.data.Mensagem
                  });
                }
                window.scrollTo(0, 0);
              })
              .catch(() => {
                callback(false);
                setLoading(false);
                window.scrollTo(0, 0);
              });
          });
      } catch (error) {
        callback(false);
        setLoading(false);
        if (error instanceof Yup.ValidationError) {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          const errors = getValidationErrors(error);
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          senhaFormRef.current?.setErrors(errors);
          setTimeout(() => { senhaFormRef.current?.setErrors({}); }, 3000);
        }
      }
    },
    [user, senhaFormRef, addAlert],
  );

  const handleFinalizarClick = useCallback(
    (isAlerting: boolean, callback: (status: boolean) => void) => {
      if (!finalizado) {
        submitPassword(statusSenha => {
          if (statusSenha) {
            handleBillPayment((statusBill, mensagem) => {
              if (statusBill) {
                setFinalizado(true);
                callback(true);
              } else {
                setBillInfo(undefined);
                setPagina(0);
                setFinalizado(false);
                addAlert({
                  title: 'Erro ao pagar o boleto',
                  type: 'error',
                });
                callback(false);
              }
            });
          } else {
            callback(false);
          }
        });
      } else {
        setBillInfo(undefined);
        setPagina(0);
        setFinalizado(false);
        callback(false);

      }
    },
    [finalizado, submitPassword, handleBillPayment, addAlert],
  );

  const handleHasMoney = useCallback((isAlerting, callback, value: number) => {
    if(wallet.saldoDisponivelGlobal < value) {
        window.scrollTo(0, 0);
        addAlert({
          type: 'error',
          title: 'Você não têm saldo suficiente!'
        });
      }else{
        setPagina(2);
        callback(false);
      }

  }, [addAlert, wallet])

  const renderPage = useCallback(() => {
    let result: React.ReactNode;

    switch (pagina) {
      case 1:
        result = (
          <FunctionalityCard
            color="#F76C39"
            title="Pagamento de Boletos"
            components={{
              action: {
                text: 'Fazer Pagamento',
                onClick: (isAlerting, callback) => {
                  handleHasMoney(isAlerting, callback, Number(billInfo?.PaymentInfoNPC.BillValue));
                },
              },
              progressBar: {
                current: pagina,
                size: 3,
              },
            }}
          >
            <ContentCard>
              <div className="contentInfoBill">
                <CardSubtitle className="text-left">
                  Dados do beneficiário
                </CardSubtitle>
                <div>
                  <div className="textInfoBill">
                    <p>Nome/Razão Social</p>
                    <p>{billInfo?.PaymentInfoNPC.Traders.Recipient}</p>
                  </div>
                  <div className="textInfoBill">
                    <p>CPF/CNPJ</p>
                    <p>{billInfo?.PaymentInfoNPC.Traders.RecipientDocument}</p>
                  </div>
                </div>
                <CardHr />

                <CardSubtitle className="text-left">
                  Dados do pagamento
                </CardSubtitle>
                <div>
                  <div className="textInfoBill">
                    <p>(-) Desconto</p>
                    <p>
                      {
                        billInfo?.PaymentInfoNPC.ComputedBillValues
                          .FormattedDiscountValueCalculated
                      }
                    </p>
                  </div>
                  <div className="textInfoBill">
                    <p>(+) Juros/Mora</p>
                    <p>
                      {
                        billInfo?.PaymentInfoNPC.ComputedBillValues
                          .FormattedCalculatedInterestAmount
                      }
                    </p>
                  </div>
                  <div className="textInfoBill">
                    <p>(+) Multa</p>
                    <p>
                      {
                        billInfo?.PaymentInfoNPC.ComputedBillValues
                          .FormattedCalculatedFineValue
                      }
                    </p>
                  </div>
                  <div className="textInfoBill">
                    <p>(=) Total de encargos</p>
                    <p>
                      {
                        billInfo?.PaymentInfoNPC.ComputedBillValues
                          .FormattedPaymentAmountUpdated
                      }
                    </p>
                  </div>
                  <div className="textInfoBill">
                    <p>Data de vencimento</p>
                    <p>{billInfo?.PaymentInfoNPC.FormattedDueDate}</p>
                  </div>
                  <CardHr />
                  <div className="textInfoBill">
                    <p>Valor</p>
                    <p>{billInfo?.PaymentInfoNPC.FormattedBillValue}</p>
                  </div>
                  <CardHr />
                  <div className="textInfoBill">
                    <p>Data de pagamento</p>
                    <p>
                      {
                        billInfo?.PaymentInfoNPC.ComputedBillValues
                          .FormattedComputedDate
                      }
                    </p>
                  </div>
                </div>
                <CardHr />

                <div className="textInfoBill">
                  <p>Pagador</p>
                  <p>{user.NomeUsuario}</p>
                </div>
                <div className="textInfoBill">
                  <p>Conta de Pagamento</p>
                  <p>{user.CodigoConta}</p>
                </div>
              </div>
            </ContentCard>
          </FunctionalityCard>
        );
        break;

      case 2:
        result = (
          <FunctionalityCard
            color="#F76C39"
            title="Pagamento de Boletos"
            components={{
              action: {
                text: 'Confirmar',
                onClick: handleFinalizarClick,
                alertContent: (
                  <div className="text-center">
                    <h3>{mensagem}</h3>
                  </div>
                ),
                alertText: 'Concluir',
              },
              progressBar: {
                size: 3,
                current: pagina,
              },
            }}
          >
            <Form onSubmit={() => { }} ref={senhaFormRef}>
              <ContentCard>
                <CardSubtitle>Insira a senha da conta digital</CardSubtitle>
                <div className="mb-4 inputCellphone">
                  <div className="inputBill">
                    <Input name="senha" props={{ type: 'password' }} />
                  </div>
                </div>
                <CardHr />
              </ContentCard>
            </Form>
          </FunctionalityCard>
        );
        break;

      default:
        result = (
          <FunctionalityCard
            color="#F76C39"
            title="Pagamento de Boletos"
            components={{
              action: {
                text: 'Continuar',
                onClick: (isAlerting, callback) => {
                  submitBoletoFormData();
                  callback(false);
                },
              },
              progressBar: {
                size: 3,
                current: pagina,
              },
            }}
          >
            <Form onSubmit={handleSubmit} ref={boletoFormRef}>
              <ContentCard>
                <CardSubtitle>Insira o código do seu boleto</CardSubtitle>
                <div className="mb-4">
                  <div className="textBill">
                    <TextAreaMask
                      name="codBarras"
                      props={{
                        maxLength: 54,
                        placeholder:
                          '03399.91820 61600.00005 56536.510101 3 884120000007054',
                        cols: 20,
                        rows: 5,
                      }}
                    />
                  </div>
                </div>
                <CardHr />
              </ContentCard>
            </Form>
          </FunctionalityCard>
        );
        break;
    }

    return result;
  }, [user, pagina, billInfo, handleFinalizarClick, handleSubmit, handleHasMoney, submitBoletoFormData, mensagem]);

  return <>
  <Loading loading={loading}/>
  {renderPage()}
  </>;
};

export default BillPayment;
