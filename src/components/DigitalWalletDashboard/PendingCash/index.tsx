import React, { useCallback, useEffect, useState, useRef } from 'react';

import * as Yup from 'yup';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import Label from '../../ui/label';
import api from '../../../services/api';
import { useAuth } from '../../../hooks/auth';

import { CardSubtitle, Container, ContentModal } from './styles';

import FunctionalityCard from '../../FunctionalityCard';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import { MdExpandMore } from 'react-icons/md';
import Button from '../../ui/button';
import Loading from '../../ui/loading';

import Modal from 'react-modal';
import { IoMdClose } from 'react-icons/io';

import { FiAlertTriangle } from 'react-icons/fi';

import ImageUploader from '../../ui/imageUploader';

import { useAlert } from '../../../hooks/alert';
import { CurrencyInput } from '../../ui/input';
import getValidationErrors from '../../../utils/getValidationErrors';
import toBase64 from '../../../utils/toBase64';



interface CashFormData {
  AgenciaBancaria: string;
  CnpjFavorecido: string;
  CodigoFormaPagamento: number;
  CodigoPedido: number;
  CodigoPedidoFastCash: string;
  CodigoUsuario: number;
  DataHoraPedido: Date;
  DescricaoBancoFastCash: string;
  DescricaoFavorecidoFastCash: string;
  NumeroContaBancaria: string;
  StatusPedido: number
  ValorTotalCashIn: number;
}

interface CashInFormData {
  valueNumber: string;
}

interface CodCashFormData {
  Validation: {
    ValidationCode1: string;
    ValidationCode2: string;
    ValidationCode3: string;
    ValidationCode4: string;
  }

  Transaction: {
    Tid: number;
    Pid: number;
    ProdId: number;
  }
}

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
    height: isSmallHeight ? '70vmax' : '90vmax',
    background: '#FFFFFF',
    color: '#6B6576',
    borderRadius: '15px',
    overflow: 'auto',
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
      maxHeight: '532px',
      background: '#FFFFFF',
      color: '#6B6576',
      borderRadius: '15px',
      overflow: 'auto',
    },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',

  },
};



const PendingCash: React.FC = () => {
  const { user } = useAuth();
  const { addAlert } = useAlert();
  const formRef = useRef<FormHandles>(null);
  const [cash, setCash] = useState<CashFormData[]>([]);
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [codCash, setCodCash] = useState<number>();
  const [codFastCash, setCodFastCash] = useState<string>();
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [isOpenImage, setIsOpenImage] = useState(false);
  const [imageType, setImageType] = useState<string>();
  const [imageBase, setImageBase] = useState<string>();
  const [loading, setLoading] = useState(false);

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const loadCash = useCallback(() => {
    setLoading(true);
    api.get(`KimMais.Api.Generica/${user.TokenUsuario}/${user.CodigoUsuario}/Pedido%2FObterPedidosCashInAbertos`)
      .then(response => {
        setLoading(false);
        if (Array.isArray(response.data.ListaObjeto) && response.data.ListaObjeto.length > 0) {
          setCash(response.data.ListaObjeto);
        } else {
          addAlert({
            title: 'Erro',
            description: 'Erro ao buscar dinheiro pendente, tente mais tarde',
            type: 'error'
          });
        }
      }).catch(() => {
        setLoading(false);
        addAlert({
          title: 'Erro',
          description: 'Erro ao buscar dinheiro pendente, tente mais tarde',
          type: 'error'
        });
      });
  }, [user, addAlert])

  useEffect(() => {
    loadCash();
  }, [user, loadCash]);

  const cancelCashIn = useCallback(
    async () => {
      setLoading(true);
      try {
        await api.post(`/KimMais.Api.CancelarPedidoCashin/${user.TokenUsuario}/${user.CodigoUsuario}`, {
          CodigoPedido: codCash,
        }).then(response => {
          setLoading(false);
          if (response.data.Status === 0) {
            loadCash();
            addAlert({
              title: 'Pedido cancelado com sucesso!',
              type: 'success'
            });
          } else {
            setLoading(false);
            addAlert({
              title: 'Erro ao cancelar pedido!',
              type: 'error'
            });
          }
          window.scrollTo(0, 0);
        });
      }
      catch {
        setLoading(false);
        addAlert({
          title: 'Erro ao cancelar pedido!',
          type: 'error'
        });
      }
    }, [user, codCash, addAlert, loadCash]);


  const onImgChange = useCallback((img: File, callback: (rejectImage?: boolean) => void) => {
    toBase64(img).then(response => {
      setImageType(img.type);
      setImageBase(response.toString().replace(`data:${img.type};base64,`, ''));
    }).catch(() => {
      callback(true);
      addAlert({
        title: 'Erro',
        description: 'Erro ao converter imagem, tente enviar outo arquivo',
        type: 'error'
      });
    })
  }, [addAlert]);

  const novoGedPedidoCashIn = useCallback(
    async (callback?: (value?: any) => void) => {
      await api.post(`/KimMais.Api.NovoGedPedidoCashIn/${user.TokenUsuario}/${user.CodigoUsuario}`, {
        codigoPedido: codCash,
        documento64: imageBase,
      }).then(response => {
        if (response.data.Status === 0) {
          callback?.call({});
          addAlert({
            type: 'success',
            title: 'Anexo enviado com sucesso!'
          });
        } else {
          addAlert({
            type: 'error',
            title: 'Erro ao enviar anexo'
          });
          setLoading(false);
        }
        window.scrollTo(0, 0);
      }).catch(() => {
        setLoading(false);
        addAlert({
          type: 'error',
          title: 'Erro ao enviar anexo'
        });
        window.scrollTo(0, 0);
      });
    }, [user, codCash, imageBase, addAlert]);

  const obterGatewayFastCash = useCallback(
    async (callback?: (value?: any) => void) => {
      await api
        .get(
          `/KimMais.Api.ObterGatewayFastCash/${user.TokenUsuario}/${user.CodigoUsuario}?idCashIn=true`
        ).then(() => {
          callback?.call({});
        }).catch(() => {
          addAlert({
            type: 'error',
            title: 'Erro ao enviar dados'
          });
          setLoading(false);
        });
    }, [user, addAlert]);

  const obterDadosPedido = useCallback(async (callback?: (value?: any) => void) => {
    await api
      .get(
        `/KimMais.Api.ObterDadosPedido/${user.TokenUsuario}/${user.CodigoUsuario}?codPedido=${codFastCash}`
      ).then(response => {
        if (response.data.Status === 0) {
          callback?.call({}, response.data.ListaObjeto as CodCashFormData[]);
        } else {
          addAlert({
            title: 'Erro',
            description: 'Erro ao buscar dados do pedido, tente mais tarde',
            type: 'error'
          });
        }
      }).catch(() => {
        addAlert({
          title: 'Erro',
          description: 'Erro ao buscar dados do pedido, tente mais tarde',
          type: 'error'
        });
        setLoading(false);
      });
  }, [user, codFastCash, addAlert])

  const fastCashValidate = useCallback((codigoValidation: CodCashFormData, codigoValue: number, callback?: () => void) => {
    api
      .post(
        `/KimMais.Api.FastCashValidate/api/FastCashValidate?accsToken=${user.TokenUsuario}&usercode=${user.CodigoUsuario}`,
        {
          Tid: codigoValidation.Transaction.Tid,
          Pid: codigoValidation.Transaction.Pid,
          AmountPaid: codigoValue,
          ValidationCode1: codigoValidation.Validation.ValidationCode1,
          ValidationCode2: codigoValidation.Validation.ValidationCode2,
          ValidationCode3: codigoValidation.Validation.ValidationCode3,
          ValidationCode4: codigoValidation.Validation.ValidationCode4,
          Base64Image: imageBase,
          Base64ImageExtension: imageType,
          PaymentTime: new Date(),
        },
      ).then(response => {
        if (response.data.Status !== 0 && response.data.Status !== 200) {
          addAlert({
            type: 'error',
            title: 'Erro ao enviar anexo!1 ' + response
          });
        } else {
          callback?.call({});
        }
      }).catch(() => {
        addAlert({
          type: 'error',
          title: 'Erro ao enviar anexo!'
        });
        setLoading(false);
      });
  }, [user, imageBase, imageType, addAlert]);


  const handleSubmit = useCallback(async (data: CashInFormData) => {
    setLoading(true);
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object()
        .required()
        .shape({
          valueNumber: Yup.string().required('Informe o valor pago!')
            .test('validValue', 'Informe um valor válido', value => {
              return Number(value.replace(/[^,\d]/g, '').replace(',', '.')) > 0
            }).transform(value => value.replace(/[^,\d]/g, '').replace(',', '.')),
        });

      await schema
        .validate(data, {
          abortEarly: false,
        })
        .then(value => {
          obterGatewayFastCash(() => {
            obterDadosPedido(codigo => {
              fastCashValidate(codigo[0] as CodCashFormData, Number(value.valueNumber), () => {
                novoGedPedidoCashIn(() => {
                  setIsOpenImage(false);
                  setLoading(false);
                });
              });
            });
          });
        });
    } catch (error) {
      setLoading(false);
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);

        formRef.current?.setErrors(errors);
        setTimeout(() => { formRef.current?.setErrors({}); }, 3000);
      }
    }
  }, [formRef, fastCashValidate, obterGatewayFastCash, obterDadosPedido, novoGedPedidoCashIn]);

  return (
    <>
      <Loading loading={loading} />
      <FunctionalityCard
        title='Dinheiro Pendente'
        color='#0068E1'
      >
        <CardSubtitle>Útimas transações</CardSubtitle>
        <Container>
          {cash.length > 0 ?
            cash.slice(0).reverse().map((e) => {
              let tmpDate = new Date(e.DataHoraPedido);
              let descriptionOrder = '';
              switch(e.CodigoFormaPagamento){
                case 5:
                  descriptionOrder = "Depósito na carteira";
                break;
                case 4:
                  descriptionOrder = "Transferência para a carteira";
                break;
              }
              return (
                <>
                  <Accordion expanded={expanded === e.CodigoPedido.toString()} onChange={handleChange(e.CodigoPedido.toString())}>
                    <AccordionSummary
                      expandIcon={<MdExpandMore style={{ color: '#F76C39' }} />}
                      aria-controls={`${e.CodigoPedido.toString()}bh-content`}
                      id={`${e.CodigoPedido.toString()}bh-header`}
                    >
                      <div className="d-flex flex-column">

                          <Typography className="textDate">
                            <p>{('0' + tmpDate.getDate()).slice(-2)}/{('0' + tmpDate.getMonth()).slice(-2)}/{tmpDate.getFullYear()}</p>
                          </Typography>
                        <Typography className="cash">
                          {new Intl.NumberFormat(
                            'pt-BR',
                            { style: 'currency', currency: 'BRL' },
                          ).format(e.ValorTotalCashIn)}
                        </Typography>
                        <Typography className="detailNum">
                          <p>{descriptionOrder}</p>
                        </Typography>
                        <Typography className="detailNum">
                          <p>Transação nº: {e.CodigoPedidoFastCash}</p>
                        </Typography>
                      </div>

                    </AccordionSummary>
                    <>
                      <AccordionDetails className="flex-column p-4">
                        <Typography className="detailNum">
                          <p className="mb-2">Dados para pagamento:</p>
                        </Typography>
                        <Typography className="dataPayment">
                          <p>{e.DescricaoBancoFastCash}</p>
                        </Typography>
                        <Typography className="dataPayment">
                          <p>{e.AgenciaBancaria}</p>
                        </Typography>
                        <Typography className="dataPayment">
                          <p>{e.NumeroContaBancaria}</p>
                        </Typography>
                        <Typography className="dataPayment">
                          <p>{e.DescricaoFavorecidoFastCash}</p>
                        </Typography>
                        <Typography className="dataPayment">
                          <p>{e.CnpjFavorecido}</p>
                        </Typography>
                        <Button onClick={() => {
                          setIsOpenImage(true);
                          setCodCash(e.CodigoPedido);
                          setCodFastCash(e.CodigoPedidoFastCash);
                        }}>Anexar Comprovante</Button>
                        <Button onClick={() => {
                          setCodCash(e.CodigoPedido);
                          setIsOpenAlert(true);
                        }} color="secondary">Cancelar Pedido</Button>
                      </AccordionDetails>
                    </>
                  </Accordion>
                </>

              )
            })
            :
            <div className="semDinheiro">
              <h1>Você não possui nenhuma transação!</h1>
            </div>
          }

        </Container>
        <Modal
          style={customStyles}
          isOpen={isOpenImage}
          onRequestClose={() => setIsOpenImage(false)}
          contentLabel="Alert Modal"
        >
          <Loading loading={loading} />
          <IoMdClose
            onClick={() => setIsOpenImage(false)}
            size={20}
            style={{
              color: '#672ed7',
              top: '5px',
              display: 'block',
              float: 'right',
              position: 'fixed',
              right: '5px',
              cursor: 'pointer',
            }}
          />
          <Form onSubmit={handleSubmit} ref={formRef}>
            <ContentModal>
              <h3
                style={{ fontSize: '20px', color: '#000' }}
                className="font-weight-bold text-center mb-4 pl-4 pr-4"
              >
                Comprovação
                        </h3>
              <div className="d-flex flex-column">
                <Label>Informe o valor que você pagou:</Label>
                <div className="d-flex flex-row" id="currencyInput">
                  <h1 style={{ fontSize: '', color: '#672ed7' }} className="pr-2">R$</h1>
                  <CurrencyInput
                    name="valueNumber"
                    props={{}}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-center align-items-center flex-wrap" style={{ width: '280px', display: 'block' }}>
                <p style={{ fontSize: '14px', fontWeight: 'bold' }} className="text-left mt-4">
                  Nos envie uma foto do comprovante de transferência/depósito do pedido.
                        </p>
                <p style={{ fontSize: '14px' }} className="d-flex">
                  A foto deve estar nítida para conferência da transação.
                        </p>
              </div>
              <div className="d-flex " style={{ width: '60%' }}>
                <ImageUploader
                  name="teste"
                  imgProps={{
                    style: {
                      height: '200px'
                    }
                  }}
                  onChange={onImgChange}
                />
              </div>
            </ContentModal>
            <Button type="submit">Enviar</Button>
          </Form>
        </Modal>


        <Modal
          style={customStyles}
          isOpen={isOpenAlert}
          onRequestClose={() => setIsOpenAlert(false)}
          contentLabel="Alert Modal"
        >
          <IoMdClose
            onClick={() => setIsOpenAlert(false)}
            size={20}
            style={{
              color: '#672ed7',
              top: '5px',
              display: 'block',
              float: 'right',
              position: 'fixed',
              right: '5px',
              cursor: 'pointer',
            }}
          />

          <div className="d-flex justify-content-center align-items-center flex-wrap flex-column pr-2 pl-2 pt-4 pb-4">
            <h3
              style={{ fontSize: '20px', color: '#000' }}
              className="font-weight-bold text-center mb-4 pl-4 pr-4"
            >
              Confirmar cancelamento
                        </h3>
            <FiAlertTriangle
              size={130}
              style={{ maxWidth: '150px' }}
              className=""
            />
            <p style={{ fontSize: '14px' }} className="text-center mt-4">
              Tem certeza que deseja cancelar o pedido?
                        </p>

            <div className="d-flex flex-row" style={{ width: '60%' }}>
              <Button color="secondary"
                onClick={() => setIsOpenAlert(false)}
                style={{ marginRight: '2.5px' }}
              >
                Não
            </Button>
              <Button
                onClick={() => {
                  cancelCashIn();
                  setIsOpenAlert(false);
                }}
                style={{ marginLeft: '2.5px' }}
              >
                Sim
            </Button>
            </div>
          </div>
        </Modal>
      </FunctionalityCard>
    </>
  );
};

export default PendingCash;
