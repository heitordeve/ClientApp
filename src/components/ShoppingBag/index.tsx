import React, { useState, useCallback, useEffect, useRef } from 'react';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import Modal from 'react-modal';
import { BiTransferAlt, BiCalendarAlt } from 'react-icons/bi';
import { FaWallet, FaPiggyBank, FaHandsHelping } from 'react-icons/fa';
import { FiCreditCard, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { TiDocumentText } from 'react-icons/ti';
import { NumberToReais } from '../../utils/printHelper';
import FunctionalityCard from '../FunctionalityCard';
import { CreditCardSelect } from '../ui/select';
import Input from '../ui/input';
import { CustomRadioButton, CustomRadioOptionProps } from '../ui/radioButton';
import Loading from '../ui/loading';

import { useAuth } from '../../hooks/auth';
import { useShoppingBag } from '../../hooks/shoppingBag';
import { useCreditCard, CreditCardData } from '../../hooks/creditCard';
import { alertService, useAlert } from '../../hooks/alert';
import { IconButton } from '../ui/button';
import {
  CloseButton,
  Container,
  CardBody,
  ScrollBox,
  InnerParagraph,
  InnerTiltle,
  InnerTiltleLink,
  InnerSmallLabel,
  CardBox,
  InnerIcon,
  ProductLabel,
  CardBoxTail,
  PaymentHeader,
  ReturnIconHolder,
} from './styles';
import api from '../../services/api';
import { CodCanalVenda } from '../../services/consts';
import getValidationErrors from '../../utils/getValidationErrors';
import { PaymentTypeEnum } from '../../utils/resources';
import { getBrandLogo } from '../CreditCardCard';
import PaymentMethods from './paymentMethods';
import {
  ObterCarrinhoKimMaisResponse,
  ObterListaCupomDescontoResponse,
  PaymentLabelProps,
  PaymentOption,
  ShoppingBagResume,
} from './models';

import BagResume from './bagResume';
import FinalizeBag from './finalizeBag';
import { NovoPedidoRequest } from '../../dtos/Pedidos';
import { PedidoFast } from '../../dtos/Fast';
import PedidoApi from '../../services/apis/pedidoApi';
import BagItens from './bagItens';
import FastApi from '../../services/apis/fastApi';
import ValidacaoPagamento from './ValidacaoPagamento';
import CartaoCreditoValid from '../../validations/cartaoCeditoValid';
import walletValid from '../../validations/walletValid';
import BaseValidations from '../../validations/baseValidations';
import { RiShoppingCartLine } from 'react-icons/ri';
import { RevalidacaoCartaoEstudanteApi } from 'services/apis';
import { IcPix } from 'components/ui/icons';
import { PATHS } from 'routes/rotas-path';

Modal.setAppElement('#root');

const isSmallWidth = window.matchMedia('(max-width: 1000px)').matches;

const modalStyle = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

enum ShoppingBagStateEnum {
  List,
  Payment,
  SelectBank,
  Resume,
  Validate,
  Finalize,
}

interface BancoData {
  Id: number;
  Name: string;
  Description: string | null;
  Icon: string;
  BankNumber: string;
  Descricao: string | null;
  Icone: string;
}

interface BankFormData {
  BancoPagamento?: number;
  AgenciaBancaria?: string;
  NumeroContaBancaria?: string;
}

const paymentDefaultLabelProps: (PaymentLabelProps | null)[] = [
  null, //0
  { icon: <FiCreditCard />, name: 'Cartão de crédito' }, // 1
  { icon: <FiCreditCard />, name: 'Cartão de débito' }, // 2
  { icon: <TiDocumentText />, name: 'Boleto bancário' }, // 3
  { icon: <BiTransferAlt />, name: 'Transferência bancária' }, // 4
  { icon: <FaPiggyBank />, name: 'Depósito' }, // 5
  { icon: <FaHandsHelping />, name: 'Ressarcimento' }, // 6
  { icon: <BiCalendarAlt />, name: 'Resgate' }, // 7
  null, // 8
  null, // 9
  { icon: <FaWallet />, name: 'Carteira digital' }, //10
  null, // 11
  null, // 12
  null, // 13
  { icon: <IcPix />, name: 'PIX' }, // 14
];

const ShoppingBag: React.FC = () => {
  // Content states
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [compState, setCompState] = useState<ShoppingBagStateEnum>(ShoppingBagStateEnum.List);
  const [content, setContent] = useState<React.ReactNode>(<></>);

  // List states
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>([]);
  const [bankList, setBankList] = useState<BancoData[]>([]);

  // Select states
  const [selectedCard, setSelectedCard] = useState<CreditCardData>();
  const [selectedPayment, setSelectedPayment] = useState<PaymentOption>();
  const [cupons, setCupons] = useState<ObterListaCupomDescontoResponse[]>([]);
  const [selectedCupom, setSelectedCupom] = useState<ObterListaCupomDescontoResponse>();

  // Extra states
  const [resume, setResume] = useState<ShoppingBagResume>({ total: 0 });
  const [bankForm, setBankForm] = useState<BankFormData>();
  const [cupomText, setCupomText] = useState<string>('');
  const [pedidoFast, setPedidoFast] = useState<PedidoFast>();

  const formRef = useRef<FormHandles>(null);

  const { user } = useAuth();
  const { shoppingBag, removeShoppingBag } = useShoppingBag();
  const { creditCardList } = useCreditCard();
  const { addAlert } = useAlert();

  const toggleModal = useCallback(() => {
    setIsOpen(prev => !prev);
    setCompState(ShoppingBagStateEnum.List);
    setResume(prev => ({
      total: prev.total,
      valorEntrega: prev.valorEntrega,
    }));
    setPaymentOptions([]);
    setSelectedCard(undefined);
    setSelectedPayment(undefined);
    setBankList([]);
    setCupomText('');
    setSelectedCupom(undefined);
    setBankForm(undefined);
  }, []);

  useEffect(() => {
    setResume(prev => ({
      total: shoppingBag.reduce((sum, item) => sum + item.ValorRecarga, 0),
      valorEntrega: shoppingBag.reduce((sum, item) => sum + item.ValorEntrega, 0),
      cardDescription: prev.cardDescription,
      totalTaxas: selectedPayment?.apiResponse.ValorTaxas.reduce((sum, e) => sum + e, 0),
      novoPedidoData: prev.novoPedidoData,
    }));
  }, [shoppingBag, selectedPayment, selectedCupom]);

  const definePayment = useCallback(
    (index: number) => {
      setSelectedPayment(paymentOptions[index]);
    },
    [paymentOptions],
  );

  const handlePaymentClick = useCallback(
    (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
      definePayment(Number(event.currentTarget.value));
    },
    [definePayment],
  );

  const defineCard = useCallback(
    (index: number) => {
      if (creditCardList && creditCardList.length > 0) {
        let tmpRecurringDetails = creditCardList[index];
        setSelectedCard(tmpRecurringDetails);
        setResume(prev => ({
          total: prev.total,
          valorEntrega: prev.valorEntrega,
          totalTaxas: prev.totalTaxas,
          cardDescription: (
            <span className="cardDescription">
              {getBrandLogo(tmpRecurringDetails.BandeiraCartaoCredito)} - **** **** ****{' '}
              {tmpRecurringDetails.UltimosDigitos}
            </span>
          ),
        }));
      }
    },
    [creditCardList],
  );

  const handleCardChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      defineCard(Number(event.currentTarget.value));
    },
    [defineCard],
  );

  const renderPayments: () => CustomRadioOptionProps[] = useCallback(() => {
    return paymentOptions
      ? paymentOptions.map((element, index) => {
          let result: CustomRadioOptionProps;
          if (element.formaPagamento === PaymentTypeEnum.CreditCard) {
            if (creditCardList && creditCardList.length > 0) {
              result = {
                props: {
                  id: 'payment-method-' + element.apiResponse.CodigoFormaPagamento,
                  value: index,
                  onClick: handlePaymentClick,
                  disabled: !element.apiResponse.HasElegible,
                },
                render: input => (
                  <CardBox
                    key={'payment-method-' + element.apiResponse.CodigoFormaPagamento}
                    theme={{ disabled: !element.apiResponse.HasElegible }}
                  >
                    {input}
                    <InnerIcon>{element.label.icon}</InnerIcon>
                    <ProductLabel>
                      <InnerTiltle>{element.label.name}</InnerTiltle>
                      <InnerSmallLabel>
                        Cashback {NumberToReais(element.apiResponse.VlCashBack)}
                      </InnerSmallLabel>
                    </ProductLabel>
                    <CreditCardSelect
                      name="CardSelect"
                      onChange={handleCardChange}
                      options={creditCardList.map((cardElement, cardIndex) => ({
                        id: 'shopping-bag-cc-' + cardIndex,
                        value: cardIndex,
                        brand: cardElement.BandeiraCartaoCredito,
                        children: `**** **** **** ${cardElement.UltimosDigitos}`,
                      }))}
                    />
                    <CardBoxTail>
                      <InnerTiltleLink
                        to={PATHS.cartoesDeCredito}
                        className="highlight"
                        onClick={toggleModal}
                      >
                        Adicionar novo <FiChevronRight />
                      </InnerTiltleLink>
                    </CardBoxTail>
                  </CardBox>
                ),
              };
            } else {
              result = {
                props: {
                  id: 'payment-method-' + element.apiResponse.CodigoFormaPagamento,
                  value: index,
                  onClick: handlePaymentClick,
                  disabled: true,
                },
                render: input => (
                  <CardBox
                    key={'payment-method-' + element.apiResponse.CodigoFormaPagamento}
                    theme={{ disabled: true }}
                  >
                    {input}
                    <InnerIcon>{element.label.icon}</InnerIcon>
                    <ProductLabel>
                      <InnerTiltle>{element.label.name}</InnerTiltle>
                      <InnerSmallLabel>
                        Cashback {NumberToReais(element.apiResponse.VlCashBack)}
                      </InnerSmallLabel>
                    </ProductLabel>
                    <CardBoxTail>
                      <InnerSmallLabel>Nenhum cartão adicionado até o momento</InnerSmallLabel>
                      <InnerTiltleLink
                        to={PATHS.cartoesDeCredito}
                        className="highlight"
                        onClick={toggleModal}
                      >
                        Adicionar cartão <FiChevronRight />
                      </InnerTiltleLink>
                    </CardBoxTail>
                  </CardBox>
                ),
              };
            }
          } else {
            result = {
              props: {
                id: 'payment-method-' + element.apiResponse.CodigoFormaPagamento,
                value: index,
                onClick: handlePaymentClick,
                disabled: !element.apiResponse.HasElegible,
              },
              render: input => (
                <CardBox
                  key={'payment-method-' + element.apiResponse.CodigoFormaPagamento}
                  theme={{ disabled: !element.apiResponse.HasElegible }}
                >
                  {input}
                  <InnerIcon>{element.label.icon}</InnerIcon>
                  <ProductLabel>
                    <InnerTiltle>{element.label.name}</InnerTiltle>
                    <InnerSmallLabel>
                      Cashback {NumberToReais(element.apiResponse.VlCashBack)}
                    </InnerSmallLabel>
                  </ProductLabel>
                </CardBox>
              ),
            };
          }
          return result;
        })
      : [];
  }, [paymentOptions, creditCardList, toggleModal, handleCardChange, handlePaymentClick]);

  useEffect(() => {
    if (compState === ShoppingBagStateEnum.Payment) {
      defineCard(0);
    }
  }, [compState, definePayment, defineCard]);

  const goToList = useCallback(() => {
    setCompState(ShoppingBagStateEnum.List);
  }, []);

  const goToPayment = useCallback(async () => {
    setLoading(true);
    api
      .post(
        `/KimMais.Api.ObterCarrinhoKimMais/${user.TokenUsuario}/${user.CodigoUsuario}`,
        shoppingBag.map(e => ({
          ...e,
          GedRevalidacao: undefined,
          Detalhes: undefined,
          Nome: undefined,
        })),
      )
      .then(response => {
        setLoading(false);
        if (response.data.Status === 31) {
          alertService.info(
            'Pagamento',
            'O método de pagamento cartão de crédito não está disponível para compras de QRCode abaixo de R$ 18,00 ou acima R$ 100,00. Mas você ainda pode utilizar outras formas de pagamento.',
          );
        } else if (response.data.Status === 32) {
          alertService.info(
            'Pagamento',
            'O método de pagamento cartão de crédito só pode ser utilizado uma vez por dia na compra de QRCode. Mas você ainda pode utilizar outras formas de pagamento.',
          );
        }
        if (Array.isArray(response.data.ListaObjeto) && response.data.ListaObjeto.length > 0) {
          let paymentOptionsValue = (response.data.ListaObjeto as ObterCarrinhoKimMaisResponse[])
            .filter(
              e =>
                e.CodigoFormaPagamento !== PaymentTypeEnum.DebitCard &&
                e.CodigoFormaPagamento !== PaymentTypeEnum.PicPay,
            )
            .map(e => ({
              formaPagamento: e.CodigoFormaPagamento,
              label: paymentDefaultLabelProps[e.CodigoFormaPagamento],
              apiResponse: e,
            }))
            .sort((a, b) => (a.formaPagamento === 14 ? -1 : 0));
          setPaymentOptions(paymentOptionsValue);
          setSelectedPayment(undefined);
          setCompState(ShoppingBagStateEnum.Payment);
        } else {
          alertService.error('Pagamento', 'Erro ao buscar formas de pagamento, tente mais tarde.');
        }
      })
      .catch(() => {
        setLoading(false);
        alertService.error('Pagamento', 'Erro ao acessar servidor, tente mais tarde.');
      });
  }, [user, shoppingBag]);

  const iniciarCompra = useCallback(() => {
    if (shoppingBag?.length > 0) {
      const total = shoppingBag
        .map(sb => sb.ValorRecarga ?? 0 + sb.ValorEntrega ?? 0)
        .reduce((a, b) => a + b, 0);
      if (total === 0) {
        setSelectedPayment({
          formaPagamento: PaymentTypeEnum.Free,
          label: { icon: null, name: 'Gratuito' },
          apiResponse: {
            CodigoFormaPagamento: PaymentTypeEnum.Free,
            ValorTaxas: [],
            Desconto: 0,
            CodigoUsuarioCupom: null,
            VlTaxaDesconto: 0,
            HasElegible: false,
            VlCashBack: 0,
          },
        });
        setCompState(ShoppingBagStateEnum.Resume);
        return;
      }
    }
    goToPayment();
  }, [shoppingBag, goToPayment]);

  const goToSelectBank = useCallback(() => {
    setLoading(true);
    api
      .get(
        `/KimMais.Api.ObterBancos/${user.TokenUsuario}/${user.CodigoUsuario}?formaPagto=${selectedPayment?.apiResponse.CodigoFormaPagamento}`,
      )
      .then(response => {
        setLoading(false);
        if (Array.isArray(response.data.ListaObjeto) && response.data.ListaObjeto.length > 0) {
          setBankList(response.data.ListaObjeto[0]);
          setCompState(ShoppingBagStateEnum.SelectBank);
        } else {
          addAlert({
            title: 'Erro',
            description: 'Erro ao buscar dados dos bancos, tente mais tarde',
            type: 'error',
          });
        }
      })
      .catch(() => {
        setLoading(false);
        addAlert({
          title: 'Erro',
          description: 'Erro ao buscar dados dos bancos, tente mais tarde',
          type: 'error',
        });
      });
  }, [user, selectedPayment, addAlert]);

  const getCupons = useCallback(() => {
    setLoading(true);
    api
      .get(
        `KimMais.Api.Generica/${user.TokenUsuario}/${user.CodigoUsuario}/CupomDesconto%2FObterListaCupomDesconto`,
      )
      .then(response => {
        setLoading(false);
        if (response.data.Status === 0) {
          setCupons(response.data.ListaObjeto);
        } else {
          addAlert({
            title: 'Erro',
            description: 'Cupom inválido ou não encontrado, tente mais tarde',
            type: 'error',
          });
        }
      })
      .catch(() => {
        setLoading(false);
        addAlert({
          title: 'Erro',
          description: 'Erro ao buscar cupom, tente mais tarde',
          type: 'error',
        });
      });
  }, [user, addAlert]);

  const goToResume = useCallback(() => {
    formRef.current.setErrors({});
    let data = formRef.current.getData();
    switch (+selectedPayment?.formaPagamento) {
      case PaymentTypeEnum.TransferBank:
        Yup.object()
          .required()
          .shape({
            BancoPagamento: Yup.number()
              .required('Selecione um banco')
              .min(0, 'Selecione um banco')
              .typeError('Selecione um banco'),
            AgenciaBancaria: Yup.string()
              .required('Informe a agência')
              .min(4, 'Agência deve conter no mímimo 4 dígitos')
              .test('only numbers', 'Agência só pode conter números', value => {
                return value.replace(/\d/g, '').length === 0;
              }),
            NumeroContaBancaria: Yup.string()
              .required('Informe a conta')
              .test('only numbers', 'Conta só pode conter números', value => {
                return value.replace(/\d/g, '').length === 0;
              })
              .min(2, 'A conta precisa conter de 2 a 11 dígitos')
              .max(11, 'A conta precisa conter de 2 a 11 dígitos'),
          })
          .validate(data, {
            abortEarly: false,
          })
          .then(value => {
            setBankForm(value);
            getCupons();
            setCompState(ShoppingBagStateEnum.Resume);
          })
          .catch(error => {
            if (error instanceof Yup.ValidationError) {
              formRef.current?.setErrors(getValidationErrors(error));
              setTimeout(() => {
                formRef.current?.setErrors({});
              }, 3000);
            } else {
              addAlert({
                title: 'Erro',
                description: 'Erro ao enviar dados, tente mais tarde',
                type: 'error',
              });
            }
          });
        break;
      case PaymentTypeEnum.Deposit:
        Yup.object()
          .required()
          .shape({
            BancoPagamento: Yup.number()
              .required('Selecione um banco')
              .min(0, 'Selecione um banco')
              .typeError('Selecione um banco'),
          })
          .validate(data, {
            abortEarly: false,
          })
          .then(value => {
            setBankForm(value);
            getCupons();
            setCompState(ShoppingBagStateEnum.Resume);
          })
          .catch(error => {
            if (error instanceof Yup.ValidationError) {
              formRef.current?.setErrors(getValidationErrors(error));
              setTimeout(() => {
                formRef.current?.setErrors({});
              }, 3000);
            } else {
              addAlert({
                title: 'Erro',
                description: 'Erro ao enviar dados, tente mais tarde',
                type: 'error',
              });
            }
          });
        break;
      default:
        getCupons();
        setCompState(ShoppingBagStateEnum.Resume);
        break;
    }
  }, [formRef, selectedPayment, addAlert, getCupons]);

  const goToValidate = useCallback(() => {
    setCompState(ShoppingBagStateEnum.Validate);
  }, []);

  const submitNovoGedRevalidacao = useCallback(
    async (codigoPedido: number, index?: number): Promise<boolean> => {
      const realIndex = index ? index : 0;
      if (shoppingBag.length > realIndex) {
        const e = shoppingBag[index ? index : 0];
        if (e.GedRevalidacao) {
          const success = await RevalidacaoCartaoEstudanteApi.Novo(
            codigoPedido,
            e.GedRevalidacao.Documento64,
          );
          if (!success) {
            const msg = `Erro ao efetuar pedido do item "${e.Nome}", tente mais tarde`;
            alertService.error('Pedido', msg);
          }
          return success;
        } else {
          return await submitNovoGedRevalidacao(codigoPedido, realIndex + 1);
        }
      } else {
        return true;
      }
    },
    [shoppingBag],
  );
  const validarDadosPedido = useCallback((data: NovoPedidoRequest) => {
    if (!data.ListaItemPedido?.length) {
      addAlert({
        type: 'error',
        title: 'Erro ao montar pedido',
        description: 'Erro ao montar pedido, entre em contato com o SAC',
      });
      console.error('Pedido sem itens');
      return false;
    }
    return true;
  }, []);

  const submitNovoPedido = useCallback(
    async (data: NovoPedidoRequest) => {
      if (validarDadosPedido(data)) {
        setLoading(true);
        const result = await PedidoApi.SendNovoPedido(data);
        if (result) {
          const success = await submitNovoGedRevalidacao(result.CodigoPedido);
          if (success) {
            setCompState(ShoppingBagStateEnum.Finalize);
            removeShoppingBag(() => true);
            setResume(prev => ({
              total: prev.total,
              valorEntrega: prev.valorEntrega,
              novoPedidoData: result,
            }));
            alertService.success('Pedido', 'Pedido efetuado com sucesso!');
            FastApi.Obter(result.CodigoPedido).then(responseODP => {
              setLoading(false);
              if (responseODP) {
                setPedidoFast(responseODP);
              }
            });
          }
        } else {
          setLoading(false);
        }
      }
    },
    [removeShoppingBag, submitNovoGedRevalidacao, validarDadosPedido],
  );

  const submitData = useCallback(
    (cvc?: string) => {
      window.scrollTo(0, 0);
      submitNovoPedido({
        AgenciaBancaria: bankForm?.AgenciaBancaria ? bankForm.AgenciaBancaria : 0,
        BancoFastCashParaPagamento: bankForm?.BancoPagamento ? bankForm.BancoPagamento : 0,
        CanalVenda: CodCanalVenda,
        CodigoFormaPagamento: +selectedPayment?.formaPagamento,
        CodigoUsuario: user.CodigoUsuario,
        CodigoUsuarioCupom: selectedCupom ? selectedCupom.CodigoUsuarioCupom : 0,
        ValorPedido: (resume.total ? resume.total : 0).toFixed(2).toString(),
        ListaItemPedido: shoppingBag.map(e => ({
          CodigoAssinante: e.CodigoAssinante,
          CodigoTipoCartao: e.CodigoTipoCartao,
          CodigoUsuarioCartao: e.CodigoUsuarioCartao,
          CreditoConfianca: 0,
          dddCelRecarga: e.DDDCelRecarga,
          NumeroCelRecarga: e.NumeroCelRecarga,
          TipoCartaoValor: e.TipoCartaoValor,
          TipoPedido: e.TipoPedido,
          ValorRecarga: e.ValorRecarga,
          CodigoOperadora: e.CodigoOperadora,
          ValorEntrega: e.ValorEntrega,
          IsRetirada: e.IsRetirada,
          CodPosto: e.CodPosto,
          TipoLogradouroEntrega: e.TipoLogradouroEntrega,
          LogradouroEntrega: e.LogradouroEntrega,
          NumLogradouroEntrega: e.NumLogradouroEntrega,
          BairroEntrega: e.BairroEntrega,
          MunicipioEntrega: e.MunicipioEntrega,
          CodUFEntrega: e.CodUFEntrega,
          CepEntrega: e.CepEntrega,
        })),
        CodigoUsuarioCartaoCredito: selectedCard?.CodigoUsuarioCartaoCredito,
        cvvCartao: cvc,
        NumeroContaBancaria: bankForm?.NumeroContaBancaria ? bankForm.NumeroContaBancaria : 0,
        RepetirPedido: 0,
        FastCash: { Description: '', Tid: '' },
      });
    },
    [
      user,
      resume,
      bankForm,
      shoppingBag,
      selectedCard,
      selectedCupom,
      selectedPayment,
      submitNovoPedido,
    ],
  );

  const goToFinalize = useCallback(
    data => {
      switch (+selectedPayment?.formaPagamento) {
        case PaymentTypeEnum.CreditCard:
          Yup.object()
            .required()
            .shape({
              CreditCardCVV: CartaoCreditoValid.cvv,
            })
            .validate(data, {
              abortEarly: false,
            })
            .then(value => {
              submitData(value.CreditCardCVV);
            })
            .catch(error => BaseValidations.onErro(error, formRef));
          break;
        case PaymentTypeEnum.Wallet:
          Yup.object()
            .required()
            .shape({
              WalletPassword: walletValid.senha,
            })
            .validate(data, {
              abortEarly: false,
            })
            .then(value => {
              setLoading(true);
              api
                .get(
                  `KimMais.Api.VerificarSenha/${user.TokenUsuario}/${user.CodigoUsuario}?senha=${value.WalletPassword}`,
                )
                .then(response => {
                  setLoading(false);
                  if (response.data.Status !== 0) {
                    addAlert({
                      title: 'Erro',
                      description: 'Senha digitada não confere',
                      type: 'error',
                    });
                  } else {
                    submitData();
                  }
                })
                .catch(() => {
                  setLoading(false);
                  addAlert({
                    title: 'Erro',
                    description:
                      'Erro ao comunicar com API de verificação, tente novamente mais tarde',
                    type: 'error',
                  });
                });
            });
          break;
        default:
          submitData();
          break;
      }
    },
    [user, selectedPayment, addAlert, submitData],
  );

  const closeModal = useCallback(() => {
    goToList();
    toggleModal();
  }, [goToList, toggleModal]);

  const removeAndRefresh = useCallback(
    (codigo?: number) => {
      if (codigo) {
        let removed = removeShoppingBag(e => e.Codigo === codigo);
        removed.forEach(e => {
          addAlert({
            title: 'Removido com sucesso',
            description: e.Nome + ' removido do carrinho de compras',
            type: 'success',
          });
        });
      }
    },
    [removeShoppingBag, addAlert],
  );

  const goAfterPayment = useCallback(() => {
    if (selectedPayment) {
      switch (+selectedPayment.formaPagamento) {
        case PaymentTypeEnum.TransferBank:
          goToSelectBank();
          break;
        case PaymentTypeEnum.Deposit:
          goToSelectBank();
          break;
        default:
          goToResume();
          break;
      }
    } else {
      formRef?.current.setErrors({
        FormaPagamento: 'Selecione uma forma de pagamento',
      });
      setTimeout(() => {
        formRef?.current.setErrors({});
      }, 3000);
    }
  }, [selectedPayment, goToSelectBank, goToResume, formRef]);

  const goBeforeResume = useCallback(() => {
    switch (selectedPayment?.apiResponse.CodigoFormaPagamento) {
      case PaymentTypeEnum.TransferBank:
        goToSelectBank();
        break;
      case PaymentTypeEnum.Deposit:
        goToSelectBank();
        break;
      default:
        goToPayment();
        break;
    }
  }, [selectedPayment, goToPayment, goToSelectBank]);

  const goAfterResume = useCallback(() => {
    switch (selectedPayment?.apiResponse.CodigoFormaPagamento) {
      case PaymentTypeEnum.CreditCard:
        goToValidate();
        break;
      case PaymentTypeEnum.Wallet:
        goToValidate();
        break;
      default:
        formRef.current.submitForm();
        break;
    }
  }, [formRef, selectedPayment, goToValidate]);

  const handleNewCupomChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setCupomText(event.currentTarget.value);
  }, []);

  const handleSelectedCupomChange = useCallback(
    (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
      setSelectedCupom(
        cupons.find(e => e.CodigoCupomDesconto === Number(event.currentTarget.value)),
      );
    },
    [cupons],
  );

  useEffect(() => {
    if (isSmallWidth) {
      let modalForm = document.querySelector<HTMLFormElement>('#modalShopping > form');
      if (modalForm) {
        switch (+compState) {
          case ShoppingBagStateEnum.Payment:
            if (selectedPayment) {
              modalForm.querySelectorAll('.card-header')[1].scrollIntoView();
            }
            break;
          case ShoppingBagStateEnum.SelectBank:
            if (selectedPayment?.formaPagamento === PaymentTypeEnum.TransferBank) {
              modalForm.querySelectorAll('.card-header')[1].scrollIntoView();
            } else {
              modalForm.scrollIntoView();
            }
            break;
          case ShoppingBagStateEnum.Resume:
            modalForm.scrollTo({
              top: -modalForm.scrollHeight,
            });
            break;
        }
      }
    }
  }, [compState, selectedPayment]);

  const addCupom = useCallback(() => {
    if (cupomText.length > 0) {
      setLoading(true);
      api
        .post(`KimMais.Api.CadatrarCupomDesconto/${user.TokenUsuario}/${user.CodigoUsuario}/`, {
          Cupom: cupomText,
        })
        .then(response => {
          setLoading(false);
          if (response.data.Status === 0) {
            getCupons();
          } else {
            addAlert({
              title: 'Erro',
              description: 'Erro ao cadastrar cupom. ' + response.data.Mensagem,
              type: 'error',
            });
          }
        })
        .catch(() => {
          setLoading(false);
          addAlert({
            title: 'Erro',
            description: 'Erro ao cadastrar cupom, tente mais tarde',
            type: 'error',
          });
        });
    } else {
      formRef.current.setErrors({ Cupom: 'Informe o cupom' });
      setTimeout(() => {
        formRef.current.setErrors({});
      }, 3000);
    }
  }, [user, cupomText, addAlert, getCupons]);

  useEffect(() => {
    // setLoading(false);
    switch (+compState) {
      case ShoppingBagStateEnum.List:
        setContent(
          <BagItens
            key={ShoppingBagStateEnum.List}
            next={iniciarCompra}
            removeAndRefresh={removeAndRefresh}
            resume={resume}
            shoppingBag={shoppingBag}
          />,
        );
        break;
      case ShoppingBagStateEnum.Payment:
        setContent(
          <PaymentMethods
            key={ShoppingBagStateEnum.Payment}
            goToList={goToList}
            renderPayments={() => renderPayments()}
            goAfterPayment={goAfterPayment}
            shoppingBag={shoppingBag}
            resume={resume}
          />,
        );
        break;
      case ShoppingBagStateEnum.SelectBank:
        setContent(
          <>
            <FunctionalityCard
              title={selectedPayment?.label.name}
              color="#672ED7"
              components={{
                action: {
                  text: 'Continuar',
                  onClick: goToResume,
                },
              }}
            >
              <PaymentHeader>
                <ReturnIconHolder>
                  <FiChevronLeft onClick={goToPayment} />
                </ReturnIconHolder>
                <InnerTiltle>Qual banco você deseja pagar?</InnerTiltle>
              </PaymentHeader>
              <ScrollBox>
                <CustomRadioButton
                  key="BancoPagamentoCustomRadioButton"
                  name="BancoPagamento"
                  divProps={{
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                    },
                  }}
                  options={bankList.map(element => ({
                    props: {
                      id: 'payment-bank-' + element.Id,
                      value: element.Id,
                    },
                    render: input => (
                      <CardBox key={'payment-bank-' + element.Id}>
                        {input}
                        <InnerIcon>
                          <img src={element.Icon} alt={`logo ${element.Name}`} />
                        </InnerIcon>
                        <ProductLabel>
                          <InnerTiltle>{element.Name}</InnerTiltle>
                        </ProductLabel>
                      </CardBox>
                    ),
                  }))}
                />
              </ScrollBox>
            </FunctionalityCard>
            {selectedPayment?.formaPagamento === PaymentTypeEnum.TransferBank && (
              <FunctionalityCard title="Dados" color="#672ED7">
                <CardBody>
                  <InnerParagraph>Agência</InnerParagraph>
                  <Input name="AgenciaBancaria" props={{ mask: '9999' }} />
                  <InnerParagraph>Conta</InnerParagraph>
                  <Input name="NumeroContaBancaria" props={{ maxLength: 11 }} />
                </CardBody>
              </FunctionalityCard>
            )}
          </>,
        );

        break;
      case ShoppingBagStateEnum.Resume:
        setContent(
          <BagResume
            key={ShoppingBagStateEnum.Resume}
            isSmallWidth={isSmallWidth}
            next={goAfterResume}
            selectedPayment={selectedPayment}
            selectedCupom={selectedCupom}
            resume={resume}
            shoppingBag={shoppingBag}
            cupomText={cupomText}
            onNewCupomChange={handleNewCupomChange}
            addCupom={addCupom}
            onSelectedCupomChange={handleSelectedCupomChange}
            cupons={cupons}
          />,
        );
        break;
      case ShoppingBagStateEnum.Validate:
        setContent(
          <ValidacaoPagamento
            payment={selectedPayment}
            bagResume={resume}
            goToResume={goToResume}
          />,
        );
        break;
      case ShoppingBagStateEnum.Finalize:
        setContent(<FinalizeBag pedido={pedidoFast} resume={resume} closeModal={closeModal} />);
        break;
    }
  }, [
    user,
    cupons,
    resume,
    formRef,
    bankList,
    compState,
    cupomText,
    shoppingBag,
    selectedCupom,
    paymentOptions,
    selectedPayment,
    pedidoFast,
    addCupom,
    goToList,
    closeModal,
    goToResume,
    goToPayment,
    goToFinalize,
    iniciarCompra,
    goAfterResume,
    goAfterPayment,
    goBeforeResume,
    renderPayments,
    handleCardChange,
    removeAndRefresh,
    handlePaymentClick,
    handleNewCupomChange,
    handleSelectedCupomChange,
  ]);

  return (
    <>
      <IconButton
        icone={RiShoppingCartLine}
        label="Carrinho"
        onClick={toggleModal}
        badge={shoppingBag.length}
        theme="outlined"
        fontSize={16}
        id="shoppingBagToggleButton"
        pointed
      />
      <Modal
        isOpen={isOpen}
        style={modalStyle}
        overlayClassName="kim-modal d-flex"
        className="kim-modal__Content"
        id="modalShopping"
      >
        <Loading loading={loading} />
        <Container
          className={
            (compState === ShoppingBagStateEnum.SelectBank &&
              selectedPayment?.formaPagamento === PaymentTypeEnum.TransferBank) ||
            compState === ShoppingBagStateEnum.Resume
              ? 'reverseItems'
              : ''
          }
          ref={formRef}
          onSubmit={goToFinalize}
        >
          {content}
        </Container>
        <CloseButton onClick={toggleModal} size={22} />
      </Modal>
    </>
  );
};

export default ShoppingBag;
