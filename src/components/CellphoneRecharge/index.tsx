import React, { useState, useEffect, useCallback, useRef } from 'react';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import FormControl from '@material-ui/core/FormControl';
import Select from '../ui/select';
import RadioButton from '../ui/radioButton';

import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import Input from '../ui/input';

import { useAlert } from '../../hooks/alert';
import { useShoppingBag } from '../../hooks/shoppingBag';

import getValidationErrors from '../../utils/getValidationErrors';

import { CardHr, CardSubtitle, ContentCard } from './styles';

import 'bootstrap/dist/css/bootstrap.min.css';

import Loading from '../ui/loading';

import FunctionalityCard from '../FunctionalityCard';
import { TipoPedidoEnum } from '../../enuns/tipoPedidoEnum';

interface ObterListaOperadorasResponse {
  CodigoOperadora: number;
  NomeFantasia: string;
  ListaTipoCartao: {
    CodigoTipoCartao: number;
  }[];
}

interface Operator {
  CodigoOperadora: number;
  NomeFantasia: string;
  CodigoTipoCartao: number;
}

interface OperatorValue {
  CodigoTipoCartao: number;
  CodigoTipoCartaoValor: number;
  DescCodigoExterno: string;
  ValorTipoCartao: number;
}

interface CellphoneRechargeFormSubmit {
  CodigoAssinante: string;
  CodigoUsuarioCartao: number;
  ValorRecarga: number;
  TipoPedido: number;
  CreditoConfianca: number;
  CodigoTipoCartao: number;
  dddCelRecarga: string;
  NumeroCelRecarga: string;
  TipoCartaoValor: number;
  NomeOperadora: string;
  CodigoOperadora: number;
}

const CellphoneRecharge: React.FC = () => {
  const { user } = useAuth();
  const { addAlert } = useAlert();

  const [pagina, setPagina] = useState<number>(0);
  const [formData, setFormData] = useState<CellphoneRechargeFormSubmit | null>(null);

  const [operators, setOperators] = useState<Operator[]>();
  const [selectedOperator, setSelectedOperator] = useState<Operator>();

  const [operatorsValues, setOperatorsValues] = useState<OperatorValue[]>([]);
  const [selectedOperatorValue, setSelectedOperatorValue] = useState<OperatorValue>();

  const [loading, setLoading] = useState(true);

  const formRef = useRef<FormHandles>(null);

  const { addShoppingBag } = useShoppingBag();

  useEffect(() => {
    api.get(`KimMais.Api.Generica/${user.TokenUsuario}/${user.CodigoUsuario}/%2FOperadora%2FObterListaOperadoraRecargaCelular`)
      .then(response => {
        if (response.data.Status === 0) {
          if (Array.isArray(response.data.ListaObjeto) && response.data.ListaObjeto.length > 0) {
            setOperators((response.data.ListaObjeto as ObterListaOperadorasResponse[]).map(e => ({
              CodigoOperadora: e.CodigoOperadora,
              CodigoTipoCartao: e.ListaTipoCartao[0].CodigoTipoCartao,
              NomeFantasia: e.NomeFantasia
            } as Operator)));
          }
        } else {
          addAlert({
            title: 'Erro',
            description: 'Erro ao buscar operadoras. ' + response.data.Mensagem,
            type: 'error'
          });
        }
        setLoading(false);
      }).catch(() => {
        addAlert({
          title: 'Erro',
          description: 'Erro ao buscar operadoras, tente mais tarde',
          type: 'error'
        });
        setLoading(false);
      });
  }, [user, addAlert]);

  useEffect(() => {
    if (selectedOperator?.CodigoTipoCartao) {
      api.get(`KimMais.Api.Generica/${user.TokenUsuario}/${user.CodigoUsuario}/%2FTipoCartao%2FObterTipoCartaoValor%3FIdTipoCartao%3D${selectedOperator.CodigoTipoCartao}`)
        .then(response => {
          if (response.data.Status === 0 || response.data.Status === 200) {
            if (Array.isArray(response.data.ListaObjeto) && response.data.ListaObjeto.length > 0) {
              setOperatorsValues(response.data.ListaObjeto[0].itens);
            }
          } else {
            addAlert({
              title: 'Erro',
              description: 'Erro ao buscar valores. ' + response.data.Mensagem,
              type: 'error'
            });
          }
        }).catch(() => {
          addAlert({
            title: 'Erro',
            description: 'Erro ao buscar valores, tente mais tarde',
            type: 'error'
          });
        });
    }
  }, [user, selectedOperator, addAlert]);

  const handleCellphoneRecharge = useCallback(
    async (callback: (status: boolean) => void) => {
      if (formData != null) {
        callback(true);
        window.scrollTo(0, 0);
        addShoppingBag({
          Nome: 'Recarga de Celular',
          Detalhes: `Celular: (${formData.dddCelRecarga}) ${formData.NumeroCelRecarga} | Operadora: ${formData.NomeOperadora}`,
          CodigoAssinante: formData.CodigoAssinante,
          CodigoUsuarioCartao: 0,
          CodigoUsuario: user.CodigoUsuario,
          ValorRecarga: formData.ValorRecarga,
          TipoPedido: formData.TipoPedido,
          CodigoTipoCartao: formData.CodigoTipoCartao,
          TipoCartaoValor: formData.TipoCartaoValor,
          CodigoOperadora: formData.CodigoOperadora,
          DDDCelRecarga: formData.dddCelRecarga,
          NumeroCelRecarga: formData.NumeroCelRecarga,
        });
      } else {
        callback(false);
      }
    },
    [user, formData, addShoppingBag],
  );

  const handleChangeOperators = useCallback((
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    if (operators) {
      let tmpCodOp = Number(event.target.value);
      const operator = operators.find(
        x => x.CodigoOperadora === tmpCodOp,
      );
      if (operator) {
        setSelectedOperator(operator);
      }
    }
  }, [operators]);

  const handleChangeOperatorsValues = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (operatorsValues) {
      let tmpCodTipoCartaoVal = Number(event.target.value);
      const operatorValue = operatorsValues.find(
        x => x.CodigoTipoCartaoValor === tmpCodTipoCartaoVal,
      );
      if (operatorValue) {
        setSelectedOperatorValue(operatorValue);
      }
    }
  }, [operatorsValues]);

  const handleSubmit = useCallback(async (data: any) => {
    try {
      formRef.current?.setErrors({});
      data.Operadora = selectedOperator;
      data.ValorRecarga = selectedOperatorValue;

      const schema = Yup.object()
        .required()
        .shape({
          Operadora: Yup.object()
            .required('Selecione uma operadora')
            .shape({
              CodigoOperadora: Yup.number().required('Selecione uma operadora').min(0, 'Selecione uma operadora'),
              NomeFantasia: Yup.string().required('Selecione uma operadora'),
              CodigoTipoCartao: Yup.number().required('Selecione uma operadora').min(0, 'Selecione uma operadora')
            }),
          ValorRecarga: Yup.object()
            .required('Selecione um valor de recarga')
            .shape({
              CodigoTipoCartao: Yup.number().required('Selecione um valor de recarga').min(0, 'Selecione um valor de recarga'),
              CodigoTipoCartaoValor: Yup.number().required('Selecione um valor de recarga'),
              DescCodigoExterno: Yup.string(),
              ValorTipoCartao: Yup.number().required('Selecione um valor de recarga').min(0, 'Selecione um valor de recarga')
            })
        });

      await schema
        .validate(data, {
          abortEarly: false,
        })
        .then(value => {
          setFormData({
            CodigoUsuarioCartao: 0,
            ValorRecarga: value.ValorRecarga.ValorTipoCartao,
            TipoPedido: TipoPedidoEnum.RecargaCelular,
            CreditoConfianca: 0,
            CodigoTipoCartao: value.ValorRecarga.CodigoTipoCartao,
            dddCelRecarga: user.NumeroDDD,
            NumeroCelRecarga: `${user.NumeroTelefone}`,
            TipoCartaoValor: value.ValorRecarga.CodigoTipoCartaoValor,
            NomeOperadora: value.Operadora.NomeFantasia,
            CodigoOperadora: value.Operadora.CodigoOperadora,
            CodigoAssinante: ''
          });
          setPagina(1);
        });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        const errors = getValidationErrors(error);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        formRef.current?.setErrors(errors);
        setTimeout(() => { formRef.current?.setErrors({}); }, 3000);
      }
    }
  }, [user, formRef, selectedOperator, selectedOperatorValue]);

  const renderPage = useCallback(() => {
    let result: React.ReactNode;

    switch (pagina) {
      case 1:
        result = (
          <FunctionalityCard
            color="#672ED7"
            title="Recarga de Celular"
            components={{
              action: {
                text: 'Adicionar ao carrinho',
                onClick: (isAlerting, callback) => {
                  if (!isAlerting) {
                    handleCellphoneRecharge((status) => {
                      if (status) {
                        addAlert({
                          title: "Recarga adicionada ao carrinho",
                          type: 'success',
                        })
                        callback(true);
                      } else {
                        setPagina(0);
                        setFormData(undefined);
                        setSelectedOperator(undefined);
                        setOperatorsValues([]);
                        addAlert({
                          title: "Erro ao adicionar ao carrinho",
                          type: 'error',
                        })
                        callback(false);
                      }
                    });
                  } else {
                    setPagina(0);
                    setFormData(undefined);
                    setSelectedOperator(undefined);
                    setOperatorsValues([]);
                    callback(false);
                  }
                },
                alertContent: (
                  <div className="text-center">
                    <h3>
                      Recarga adicionada ao carrinho!
                    </h3>
                  </div>
                ),
                alertText: 'Concluir',
              },
              progressBar: {
                current: pagina,
                size: 2,
              },
            }}
          >
            <ContentCard>
              <CardSubtitle>Você está recarregando</CardSubtitle>
              <button
                type="button"
                className="btn btn-outline-secondary noHover"
              >
                <h5>R${formData.ValorRecarga},00</h5>
              </button>

              <CardSubtitle>Número de telefone</CardSubtitle>
              <button
                type="button"
                className="btn btn-outline-secondary noHover"
              >
                <h5>
                  ({formData.dddCelRecarga}) {formData.NumeroCelRecarga}
                </h5>
              </button>

              <CardSubtitle>Operadora</CardSubtitle>
              <button
                type="button"
                className="btn btn-outline-secondary noHover"
              >
                <h5>{formData.NomeOperadora}</h5>
              </button>

              <CardHr />
            </ContentCard>
          </FunctionalityCard>
        );
        break;

      default:
        result = (
          <>
          <Loading loading={loading} />
          <FunctionalityCard
            color="#672ED7"
            title="Recarga de Celular"
            components={{
              action: {
                text: 'Continuar',
                onClick: (isAlerting, callback) => {
                  formRef.current?.submitForm();
                  callback(false);
                },
              },
              progressBar: {
                current: pagina,
                size: 2,
              },
            }}
          >
            <Form onSubmit={handleSubmit} ref={formRef}>
              <ContentCard>
                <CardSubtitle>
                  Número que será recarregado
                </CardSubtitle>
                <div className="inputCellphone mb-4">
                    <Input
                      name="DDDCelRecarga"
                      props={{ type: 'text', value: user.NumeroDDD, disabled: true }}
                    />
                    <Input
                      name="NumeroCelRecarga"
                      props={{
                        type: 'text',
                        value: user.NumeroTelefone,
                        disabled: true,
                      }}

                    />
                </div>
                <CardSubtitle>Qual é a sua operadora?</CardSubtitle>
                <FormControl className="selectOperadoras">
                  <Select
                    value={selectedOperator?.CodigoOperadora}
                    onChange={handleChangeOperators}
                    name="Operadora"
                    id="operadora"
                  >
                    <option aria-label="Operadoras" value="" />
                    {operators?.map(operator =>
                      <option key={operator.CodigoOperadora} value={operator.CodigoOperadora}>
                        {operator.NomeFantasia}
                      </option>)}
                  </Select>
                </FormControl>

                <CardSubtitle>Qual é o valor de sua recarga?</CardSubtitle>
                <section className="mb-4">
                  <div className="radioAlign">
                    <RadioButton
                      name="ValorRecarga"
                      onChange={handleChangeOperatorsValues}
                      options={operatorsValues.map(operatorValue => {
                        return {
                          label: `R$ ${operatorValue.ValorTipoCartao}`,
                          value: operatorValue.CodigoTipoCartaoValor,
                          id: `valorOperadora_${operatorValue.CodigoTipoCartaoValor}`,
                        };
                      })}
                    />
                  </div>
                </section>
                <CardHr />
              </ContentCard>
            </Form>
          </FunctionalityCard>
          </>
        );
        break;
    }

    return result;
  }, [
    user,
    pagina,
    formRef,
    loading,
    formData,
    operators,
    operatorsValues,
    selectedOperator,
    addAlert,
    handleSubmit,
    handleChangeOperators,
    handleCellphoneRecharge,
    handleChangeOperatorsValues
  ]);

  return <>{renderPage()}</>;
};

export default CellphoneRecharge;
