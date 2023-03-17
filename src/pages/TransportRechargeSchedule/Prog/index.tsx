import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import { Link } from 'react-router-dom';

import Modal from 'react-modal';
import { DropdownItem, UncontrolledTooltip } from 'reactstrap';
import { BsPencil, BsTrash } from 'react-icons/bs';
import { FaRegCheckCircle } from 'react-icons/fa';

import api from 'services/api';
import { useAuth, useAlert } from 'hooks';
import { CreditCardData } from '../../../hooks/creditCard';

import { NumberToReais } from 'utils/printHelper';
import getValidationErrors from 'utils/getValidationErrors';

import { CreditCardSelect } from 'components/ui/select';
import Input, { CurrencyInput } from 'components/ui/input';
import FunctionalityCard, { FunctionalityCardComponents } from 'components/FunctionalityCard';
import Button from 'components/ui/button';
import Loading from 'components/ui/loading';
import { Title } from 'components/ui/typography';
import { Column } from 'components/ui/layout';

import { DeleteModalStyle, TransportRechargeScheduleContext } from '../';

import {
  ButtonsContainer,
  EmptyContainer,
  EmptyPlusIcon,
  ScheduleCardForm,
  ViewContainer,
  CreditCardContainer,
  CreditCardIcon,
  AboutContainer,
  AlertContainer,
  AlertHolder,
  InnerHeaderOne,
  InnerHeaderTwo,
  InnerLabel,
  InnerParagraph,
  InputLabel,
} from '../styles';
import { RecargaProgramada } from 'dtos/Recarga';
import { PATHS } from 'routes/rotas-path';

Modal.setAppElement('#root');

enum CardStateEnum {
  empty,
  create,
  confirmCreate,
  alertCreate,
  view,
  edit,
  confirmEdit,
  alertEdit,
}

export interface ProgScheduleData {
  CodigoRecargaProgramada: string | null;
  CodigoUsuarioCartao: number;
  UsuarioCartaoCredito: CreditCardData;
  ValorRecargaProgramada: number;
  DiaRecargaProgramada: number;
}

interface ProgTrandportRechargeScheduleProps {
  data?: RecargaProgramada;
}

function validarOutroValor(outroValor: string, valorMinimo: number, valorMaximo: number) {
  let tmpOutroValor = Number(outroValor);

  return tmpOutroValor >= valorMinimo && tmpOutroValor <= valorMaximo;
}

const ProgTrandportRechargeSchedule: React.FC<ProgTrandportRechargeScheduleProps> = ({ data }) => {
  const { user } = useAuth();
  const trsContext = useContext(TransportRechargeScheduleContext);

  const [state, setState] = useState<CardStateEnum>(CardStateEnum.empty);
  const [componets, setComponents] = useState<FunctionalityCardComponents>();
  const [body, setBody] = useState<React.ReactNode>();
  const [deleteIsOpen, setDeleteIsOpen] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);

  const [tmpDataHolder, setTmpDataHolder] = useState<ProgScheduleData>();

  const formRef = useRef<FormHandles>();

  const { addAlert } = useAlert();

  //#region "goTo" callbacks

  const goToEmpty = useCallback(() => {
    setState(CardStateEnum.empty);
  }, []);

  const goToCreate = useCallback(() => {
    setState(CardStateEnum.create);
  }, []);

  const goToConfirmCreate = useCallback(() => {
    setState(CardStateEnum.confirmCreate);
  }, []);

  const goToAlertCreate = useCallback(() => {
    setState(CardStateEnum.alertCreate);
  }, []);

  const goToView = useCallback(() => {
    setState(CardStateEnum.view);
  }, []);

  const goToEdit = useCallback(() => {
    setState(CardStateEnum.edit);
  }, []);

  const goToConfirmEdit = useCallback(() => {
    setState(CardStateEnum.confirmEdit);
  }, []);

  const goToAlertEdit = useCallback(() => {
    setState(CardStateEnum.alertEdit);
  }, []);

  //#endregion

  //#region "validateData" callbacks

  const validateData = useCallback(
    async (callback: () => void) => {
      formRef.current.setErrors({});
      try {
        await Yup.object()
          .required()
          .shape({
            UsuarioCartaoCredito: Yup.string().required('Selecione um cartão'),
            ValorRecargaProgramada: Yup.string()
              .required()
              .transform(value => value.replace(/[^,\d]/g, '').replace(',', '.'))
              .test(
                'valorValido',
                `Digite um valor entre ${NumberToReais(
                  trsContext.cardData.ValorRecargaMinima,
                )} e ${NumberToReais(trsContext.cardData.ValorRecargaMaxima)}`,
                value =>
                  validarOutroValor(
                    value,
                    trsContext.cardData.ValorRecargaMinima,
                    trsContext.cardData.ValorRecargaMaxima,
                  ),
              ),
            DiaRecargaProgramada: Yup.number()
              .typeError('Informe o dia da recarga')
              .required('Informe o dia da recarga')
              .min(1, 'Informe um dia válido')
              .max(31, 'Informe um dia válido'),
          })
          .validate(formRef.current.getData(), {
            abortEarly: false,
          })
          .then(value => {
            let card: CreditCardData = trsContext.cardList.find(
              e => e.CodigoUsuarioCartaoCredito.toString() === value.UsuarioCartaoCredito,
            );
            if (typeof card != 'undefined') {
              setTmpDataHolder({
                CodigoRecargaProgramada: data?.Codigo?.toString(),
                CodigoUsuarioCartao: trsContext.cardData.Codigo,
                UsuarioCartaoCredito: card,
                ValorRecargaProgramada: Number(value.ValorRecargaProgramada),
                DiaRecargaProgramada: value.DiaRecargaProgramada,
              });
              callback();
            } else {
              addAlert({
                title: 'Erro',
                description: 'Cartão de crédito não encontrado',
                type: 'error',
              });
            }
          });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          setTimeout(() => {
            formRef.current?.setErrors({});
          }, 3000);
        }
        window.scrollTo(0, 0);
        addAlert({
          title: 'Erro',
          description: 'Erro ao submeter dados',
          type: 'error',
        });
      }
    },
    [data, trsContext, formRef, addAlert],
  );

  const validateDataCreate = useCallback(
    async (isAlerting: boolean, callback: (status: boolean) => void) => {
      validateData(goToConfirmCreate);
      callback(false);
    },
    [validateData, goToConfirmCreate],
  );

  const validateDataEdit = useCallback(
    (isAlerting: boolean, callback: (status: boolean) => void) => {
      validateData(goToConfirmEdit);
      callback(false);
    },
    [validateData, goToConfirmEdit],
  );

  //#endregion

  //#region modal callbacks

  const openDeleteModal = useCallback(() => {
    setDeleteIsOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleteIsOpen(false);
  }, []);

  //#endregion

  //#region submit callbacks

  const submitCreate = useCallback(
    (isAlerting: boolean, callback: (status: boolean) => void) => {
      trsContext.setLoading(true);
      api
        .post(`/KimMais.Api.SalvarRecargaProgramada/${user.TokenUsuario}/${user.CodigoUsuario}`, {
          ...tmpDataHolder,
          UsuarioCartaoCredito: {
            AnoCartaoCredito: tmpDataHolder.UsuarioCartaoCredito.AnoCartaoCredito,
            BandeiraCartaoCredito: tmpDataHolder.UsuarioCartaoCredito.BandeiraCartaoCredito,
            ChaveCartaoCredito: tmpDataHolder.UsuarioCartaoCredito.CodigoUsuarioCartaoCredito,
            MesCartaoCredito: tmpDataHolder.UsuarioCartaoCredito.MesCartaoCredito,
            NomeCartaoCredito: tmpDataHolder.UsuarioCartaoCredito.NomeCartaoCredito,
            NumeroCartaoCredito: tmpDataHolder.UsuarioCartaoCredito.UltimosDigitos,
          },
        })
        .then(response => {
          trsContext.setLoading(false);
          if (response.data.Status === 0) {
            trsContext.reload();
            addAlert({
              title: 'Sucesso',
              description: 'Agendamento criado com sucesso!',
              type: 'success',
            });
            goToAlertCreate();
            callback(true);
          } else {
            window.scrollTo(0, 0);
            addAlert({
              title: 'Erro',
              description: 'Erro ao submeter dados. ' + response.data.Mensagem,
              type: 'error',
            });
          }
        })
        .catch(error => {
          window.scrollTo(0, 0);
          trsContext.setLoading(false);
          addAlert({
            title: 'Erro',
            description: 'Erro ao submeter dados, tente novamente mais tarde',
            type: 'error',
          });
        });
    },
    [user, trsContext, tmpDataHolder, addAlert, goToAlertCreate],
  );

  const submitEdit = useCallback(
    (isAlerting: boolean, callback: (status: boolean) => void) => {
      setLoading(true);
      api
        .post(
          `/KimMais.Api.AlterarRecargaProgramada/${user.TokenUsuario}/${user.CodigoUsuario}`,
          tmpDataHolder,
        )
        .then(response => {
          if (response.data.Status === 0) {
            setLoading(false);
            trsContext.reload();
            goToAlertEdit();
            callback(true);
          } else {
            setLoading(false);
            addAlert({
              title: 'Erro',
              description: 'Erro ao submeter dados. ' + response.data.Mensagem,
              type: 'error',
            });
          }
          window.scrollTo(0, 0);
        })
        .catch(error => {
          window.scrollTo(0, 0);
          addAlert({
            title: 'Erro',
            description: 'Erro ao submeter dados, tente novamente mais tarde',
            type: 'error',
          });
          callback(false);
        });
    },
    [user, trsContext, tmpDataHolder, addAlert, goToAlertEdit],
  );

  const submitDelete = useCallback(() => {
    closeDeleteModal();
    trsContext.setLoading(true);
    api
      .post(`/KimMais.Api.ExcluirRecargaProgramada/${user.TokenUsuario}/${user.CodigoUsuario}`, {
        CodigoRecargaProgramada: data.Codigo,
      })
      .then(response => {
        trsContext.setLoading(false);
        if (response.data.Status === 0) {
          trsContext.reload();
          goToEmpty();
        } else {
          addAlert({
            title: 'Erro',
            description: 'Erro ao excluir recarga, tente novamente mais tarde',
            type: 'error',
          });
        }
      })
      .catch(() => {
        trsContext.setLoading(false);
        addAlert({
          title: 'Erro',
          description: 'Erro ao excluir recarga, tente novamente mais tarde',
          type: 'error',
        });
      });
  }, [data, user, trsContext, addAlert, goToEmpty, closeDeleteModal]);

  //#endregion

  const finish = useCallback(
    (isAlerting: boolean, callback: (status: boolean) => void) => {
      goToView();
      callback(false);
    },
    [goToView],
  );

  useEffect(() => {
    setState(prev => (prev === CardStateEnum.empty && data ? CardStateEnum.view : prev));
  }, [data]);

  useEffect(() => {
    switch (+state) {
      case CardStateEnum.view:
        setComponents({
          options: {
            optionsContent: (
              <>
                <DropdownItem onClick={goToEdit}>
                  <BsPencil /> Alterar
                </DropdownItem>
                <DropdownItem onClick={openDeleteModal}>
                  <BsTrash /> Excluir
                </DropdownItem>
              </>
            ),
          },
        });
        setBody(
          <>
            {data && (
              <ViewContainer>
                <CreditCardContainer>
                  <InnerHeaderOne>
                    <CreditCardIcon />
                    Cartão vinculado
                  </InnerHeaderOne>
                  <Column>
                    <InnerHeaderTwo>Número</InnerHeaderTwo>
                    <InnerLabel>
                      **** **** ****{' '}
                      {data.CartaoCredito.Numero
                        ? data.CartaoCredito.Numero
                        : trsContext.cardList.find(
                            e => e.NomeCartaoCredito === data.CartaoCredito.Numero,
                          )?.UltimosDigitos}
                    </InnerLabel>
                  </Column>
                </CreditCardContainer>
                <AboutContainer>
                  <Column>
                    <InnerHeaderTwo>Dia do mês para recarga</InnerHeaderTwo>
                    <InnerLabel>{data.Dia}</InnerLabel>
                  </Column>
                  <Column>
                    <InnerHeaderTwo>Valor da recarga</InnerHeaderTwo>
                    <InnerLabel>{NumberToReais(data.Valor)}</InnerLabel>
                  </Column>
                </AboutContainer>
              </ViewContainer>
            )}
          </>,
        );
        break;
      case CardStateEnum.create:
        setComponents({
          action: {
            text: 'Continuar',
            onClick: validateDataCreate,
          },
          cancel: {
            id: 'CancelButton',
            onClick: goToEmpty,
            cancelAppend: (
              <UncontrolledTooltip placement="right" target="CancelButton">
                Cancelar
              </UncontrolledTooltip>
            ),
          },
          progressBar: {
            current: 0,
            size: 2,
          },
        });
        setBody(EditAgendamento());
        break;
      case CardStateEnum.confirmCreate:
        setComponents({
          action: {
            text: 'Concluír',
            onClick: submitCreate,
          },
          cancel: {
            id: 'CancelButton',
            onClick: goToEmpty,
            cancelAppend: (
              <UncontrolledTooltip placement="right" target="CancelButton">
                Cancelar
              </UncontrolledTooltip>
            ),
          },
          progressBar: {
            current: 1,
            size: 2,
          },
        });
        setBody(
          <>
            <InnerHeaderOne>Novo agendamento</InnerHeaderOne>
            <ViewContainer>
              <CreditCardContainer>
                <InnerHeaderOne>
                  <CreditCardIcon />
                  Cartão vinculado
                </InnerHeaderOne>
                <InnerParagraph>
                  <InnerHeaderTwo>Número</InnerHeaderTwo>
                  <InnerLabel>
                    **** **** **** {tmpDataHolder.UsuarioCartaoCredito.UltimosDigitos}
                  </InnerLabel>
                </InnerParagraph>
                <InnerParagraph>
                  <InnerHeaderTwo>Validade</InnerHeaderTwo>
                  <InnerLabel>
                    {tmpDataHolder.UsuarioCartaoCredito.MesCartaoCredito}/
                    {tmpDataHolder.UsuarioCartaoCredito.AnoCartaoCredito}
                  </InnerLabel>
                </InnerParagraph>
              </CreditCardContainer>
              <AboutContainer>
                <InnerParagraph>
                  <InnerHeaderTwo>Dia do mês para recarga</InnerHeaderTwo>
                  <InnerLabel>{tmpDataHolder.DiaRecargaProgramada}</InnerLabel>
                </InnerParagraph>
                <InnerParagraph>
                  <InnerHeaderTwo>Valor da recarga</InnerHeaderTwo>
                  <InnerLabel>{NumberToReais(tmpDataHolder.ValorRecargaProgramada)}</InnerLabel>
                </InnerParagraph>
              </AboutContainer>
            </ViewContainer>
          </>,
        );
        break;
      case CardStateEnum.alertCreate:
        setComponents({
          action: {
            text: 'Concluír',
            onClick: finish,
            alertText: 'Continuar',
            alertContent: (
              <AlertContainer>
                <h3>Agendamento de recarga criado com sucesso!</h3>
                <FaRegCheckCircle />
              </AlertContainer>
            ),
          },
          progressBar: {
            current: 1,
            size: 2,
          },
        });
        setBody(<AlertHolder></AlertHolder>);
        break;
      case CardStateEnum.edit:
        setComponents({
          action: {
            text: 'Concluír',
            onClick: validateDataEdit,
          },
          cancel: {
            id: 'CancelButton',
            onClick: goToView,
            cancelAppend: (
              <UncontrolledTooltip placement="right" target="CancelButton">
                Cancelar
              </UncontrolledTooltip>
            ),
          },
          progressBar: {
            current: 1,
            size: 2,
          },
        });
        setBody(EditAgendamento());
        break;
      case CardStateEnum.confirmEdit:
        setComponents({
          action: {
            text: 'Concluír',
            onClick: submitEdit,
          },
          cancel: {
            id: 'ProgCancelButton',
            onClick: goToEmpty,
            cancelAppend: (
              <UncontrolledTooltip placement="right" target="CancelButton">
                Cancelar
              </UncontrolledTooltip>
            ),
          },
          progressBar: {
            current: 1,
            size: 2,
          },
        });
        setBody(
          <>
            <InnerHeaderOne>Alterar agendamento</InnerHeaderOne>
            <ViewContainer>
              <CreditCardContainer>
                <InnerHeaderOne>
                  <CreditCardIcon />
                  Cartão vinculado
                </InnerHeaderOne>
                <InnerParagraph>
                  <InnerHeaderTwo>Número</InnerHeaderTwo>
                  <InnerLabel>
                    **** **** **** {tmpDataHolder.UsuarioCartaoCredito.UltimosDigitos}
                  </InnerLabel>
                </InnerParagraph>
                <InnerParagraph>
                  <InnerHeaderTwo>Validade</InnerHeaderTwo>
                  <InnerLabel>
                    {tmpDataHolder.UsuarioCartaoCredito.MesCartaoCredito}/
                    {tmpDataHolder.UsuarioCartaoCredito.AnoCartaoCredito}
                  </InnerLabel>
                </InnerParagraph>
              </CreditCardContainer>
              <AboutContainer>
                <InnerParagraph>
                  <InnerHeaderTwo>Dia do mês para recarga</InnerHeaderTwo>
                  <InnerLabel>{tmpDataHolder.DiaRecargaProgramada}</InnerLabel>
                </InnerParagraph>
                <InnerParagraph>
                  <InnerHeaderTwo>Valor da recarga</InnerHeaderTwo>
                  <InnerLabel>{NumberToReais(tmpDataHolder.ValorRecargaProgramada)}</InnerLabel>
                </InnerParagraph>
              </AboutContainer>
            </ViewContainer>
          </>,
        );
        break;
      case CardStateEnum.alertEdit:
        setComponents({
          action: {
            text: 'Concluír',
            onClick: finish,
            alertText: 'Continuar',
            alertContent: (
              <AlertContainer>
                <h3>Agendamento de recarga alterado com sucesso!</h3>
                <FaRegCheckCircle />
              </AlertContainer>
            ),
          },
          progressBar: {
            current: 1,
            size: 2,
          },
        });
        setBody(<AlertHolder></AlertHolder>);
        break;
      default:
        setComponents(undefined);
        setBody(
          <EmptyContainer className="flex-column" onClick={goToCreate}>
            <p className="text-center font-weight-bold mr-3 ml-3" style={{ color: '#707070' }}>
              Todo o mês o KIM vai fazer uma recarga no dia e no valor que você escolher.
            </p>
            <EmptyPlusIcon />
          </EmptyContainer>,
        );
        break;
    }

    function EditAgendamento(): React.SetStateAction<React.ReactNode> {
      return (
        <ScheduleCardForm ref={formRef} onSubmit={() => {}}>
          <Column gap="12px" colorText="gray-4">
            <Title>Selecione o valor da recarga:</Title>
            <div>
              <CurrencyInput
                name="ValorRecargaProgramada"
                props={{ placeholder: 'Valor da recarga' }}
              />
              <InputLabel>
                Valor mínimo de {NumberToReais(trsContext.cardData.ValorRecargaMinima)} e máximo de{' '}
                {NumberToReais(trsContext.cardData.ValorRecargaMaxima)}
              </InputLabel>
            </div>
            <Title>A recarga será realizada mensalmente no dia:</Title>
            <div>
              <Input
                name="DiaRecargaProgramada"
                props={{
                  type: 'number',
                  max: 31,
                  min: 1,
                  placeholder: 'Dia do mês entre 1 e 31',
                }}
              />
            </div>
            <Title>Agora, selecione o cartão de crédito:</Title>
            <div>
              <CreditCardSelect
                name="UsuarioCartaoCredito"
                options={trsContext.cardList.map(e => ({
                  id: 'shopping-bag-cc-' + e.CodigoUsuarioCartaoCredito,
                  value: e.CodigoUsuarioCartaoCredito,
                  brand: e.BandeiraCartaoCredito,
                  children: `**** **** **** ${e.UltimosDigitos}`,
                }))}
              />
              <InputLabel>
                Selecione o cartão de crédito ou cadastre um{' '}
                <Link to={PATHS.cartoesDeCredito}>aqui</Link>
              </InputLabel>
            </div>
          </Column>
        </ScheduleCardForm>
      );
    }
  }, [
    data,
    state,
    formRef,
    trsContext,
    tmpDataHolder,
    finish,
    goToView,
    goToEdit,
    goToEmpty,
    goToCreate,
    submitEdit,
    submitCreate,
    openDeleteModal,
    validateDataEdit,
    validateDataCreate,
  ]);

  return (
    <>
      <Loading loading={loading} />
      <FunctionalityCard
        title="Recarga Programada"
        color="#15CDF9"
        components={componets}
        minHeight="320px"
      >
        {body}
      </FunctionalityCard>
      <Modal isOpen={deleteIsOpen} style={DeleteModalStyle} onRequestClose={closeDeleteModal}>
        <InnerHeaderOne>Confirmar exclusão</InnerHeaderOne>
        <InnerLabel>Tem certeza que deseja excluir este agendamento?</InnerLabel>
        <ButtonsContainer>
          <Button color="secondary" onClick={closeDeleteModal}>
            Não
          </Button>
          <Button color="warning" onClick={submitDelete}>
            Sim
          </Button>
        </ButtonsContainer>
      </Modal>
    </>
  );
};

export default ProgTrandportRechargeSchedule;
