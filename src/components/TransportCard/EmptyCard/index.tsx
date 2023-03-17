import React, { useState, useCallback, useRef } from 'react';

import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import FormControl from '@material-ui/core/FormControl';
import Modal from 'react-modal';

import { TiPlus } from 'react-icons/ti';

import api from '../../../services/api';
import { useAuth } from '../../../hooks/auth';
import { useAlert } from '../../../hooks/alert';
import { useCartaoTransporte } from '../../transporte/hooks/cartaoTransporteHook';
import getValidationErrors from '../../../utils/getValidationErrors';

import Select from '../../ui/select';
import Button from '../../ui/button';
import Input from '../../ui/input';
import Loading from '../../ui/loading';

import { Card } from './styles';
import { Column } from '../../ui/layout';

Modal.setAppElement('#root');

const isSmallWidth = window.matchMedia('(max-width: 1000px)').matches;

const isSmallHeight = window.matchMedia('(max-height: 500px)').matches;

const customStyles = {
  content: isSmallWidth
    ? {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '90vmin',
        borderRadius: '15px',
        overflow: 'visible',
        paddingLeft: '40px',
        paddingRight: '40px',
      }
    : {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        height: '550px',
        borderRadius: '15px',
        overflow: 'visible',
        paddingLeft: '90px',
        paddingRight: '90px',
      },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

interface CardFormData {
  nomeCartao: string;
  numeroCartao: string;
}

interface CityData {
  CodigoCidade: number;
  NomeCidade: string;
}

interface CardTypeData {
  CodigoTipoCartao: number;
  DescricaoDetalheOperadora: string;
  DescricaoTipoCartao: string;
}

interface ListOperatorData {
  CodigoOperadora: number;
  NomeFantasia: string;
  ListaTipoCartao: CardTypeData[];
}

interface OperatorData {
  CodigoOperadora: number;
  ListaOperadora: ListOperatorData[];
}

const EmptyCard: React.FC = () => {
  const { user } = useAuth();
  const { addAlert } = useAlert();

  const history = useHistory();
  const formRef = useRef<FormHandles>(null);
  const trContext = useCartaoTransporte();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, setCardsType] = useState<CardTypeData[]>([]);
  const [operators, setOperators] = useState<OperatorData[]>([]);

  const handleSubmit = useCallback(
    (data: CardFormData) => {
      formRef.current?.setErrors({});
      Yup.object()
        .shape({
          codigoOperadora: Yup.number()
            .typeError('Selecione uma operadora')
            .required('Selecione uma operadora'),
          nomeCartao: Yup.string()
            .required('Nome ou apelido do cartão de transporte é obrigatório')
            .max(
              20,
              'Limite de 20 caracteres para o Nome ou apelido do cartão de transporte',
            ),
          numeroCartao: Yup.string().required(
            'Número do cartão de transporte é obrigatório',
          ),
        })
        .validate(data, {
          abortEarly: false,
        })
        .then(value => {
          setLoading(true);
          api
            .post(
              `KimMais.Api.NovoCartao/${user.TokenUsuario}/${user.CodigoUsuario}`,
              {
                CodigoUsuario: user.CodigoUsuario,
                CodigoOperadora: value.codigoOperadora,
                NumeroCartao: value.numeroCartao,
                NomeCartao: value.nomeCartao,
              },
            )
            .then(response => {
              setLoading(false);
              if (response.data.Status === 0) {
                history.go(0);
                addAlert({
                  title: 'Sucesso',
                  description: 'Cartão cadastrado com sucesso',
                  type: 'success',
                });
              } else {
                setLoading(false);
                addAlert({
                  title: 'Erro',
                  description:
                    'Erro ao enviar dados. ' + response.data.Mensagem,
                  type: 'error',
                });
                window.scrollTo(0, 0);
              }
            })
            .catch(() => {
              setLoading(false);
              addAlert({
                title: 'Erro',
                description: 'Erro ao enviar dados, tente mais tarde',
                type: 'error',
              });
              window.scrollTo(0, 0);
            });
        })
        .catch(error => {
          if (error instanceof Yup.ValidationError) {
            formRef.current.setErrors(getValidationErrors(error));
            setTimeout(() => {
              formRef.current.setErrors({});
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
    [user, history, addAlert],
  );

  const handleChangeCity = useCallback(
    (event: React.ChangeEvent<{ value: unknown }>) => {
      api
        .get(
          `/KimMais.Api.ObterOperadorasPorCidade/${user.TokenUsuario}/${user.CodigoUsuario}?idcidade=${event.target.value}`,
        )
        .then(response => {
          if (response.data.Status === 0) {
            setOperators(response.data.ListaObjeto);
          } else {
            addAlert({
              title: 'Erro',
              description: 'Erro ao buscar operadoras, tente mais tarde',
              type: 'error',
            });
          }
        })
        .catch(() => {
          addAlert({
            title: 'Erro',
            description: 'Erro ao buscar operadoras, tente mais tarde',
            type: 'error',
          });
        });
    },
    [user, addAlert],
  );

  const handleChangeOperators = useCallback(
    (event: React.ChangeEvent<{ value: unknown }>) => {
      const operator = operators.find(
        x => x.CodigoOperadora === event.target.value,
      );
      if (operator) {
        setCardsType(operator.ListaOperadora[0].ListaTipoCartao);
      }
    },
    [operators],
  );

  return (
    <>
      <Card
        onClick={() => setIsOpen(true)}
        className="cursor-pointer"
        style={{ background: '#E7E5E5' }}
      >
        <div className="d-flex align-items-center justify-content-center">
          <TiPlus style={{ color: '#FFFFFF' }} size={80} />
        </div>
      </Card>
      <Modal style={customStyles} isOpen={isOpen} contentLabel="Example Modal">
        <Loading loading={loading} />
        <Form onSubmit={handleSubmit} ref={formRef}>
          {isSmallHeight ? (
            <p className="text-center">Cadastro de cartão de transporte</p>
          ) : (
            <h3 className="text-center">Cadastro de cartão de transporte</h3>
          )}
          <FormControl variant="outlined" style={{ display: 'flex' }}>
            <Select name="cidade" onChange={handleChangeCity} id="cidade">
              <option
                aria-label="Operadoras"
                value=""
                disabled={true}
                selected={true}
              >
                Cidade
              </option>
              {trContext.cidades.map(city => {
                return (
                  <option key={city.CodigoCidade} value={city.CodigoCidade}>
                    {city.NomeCidade}
                  </option>
                );
              })}
            </Select>
          </FormControl>
          <FormControl
            variant="outlined"
            style={{ marginTop: 10, marginBottom: 10, display: 'flex' }}
          >
            <Select
              name="codigoOperadora"
              id="codigoOperadora"
              onChange={handleChangeOperators}
              disabled={operators.length > 0 ? false : true}
            >
              <option aria-label="Operadoras" value="" selected={true}>
                Operadora
              </option>
              {operators.map(operator => {
                return operator.ListaOperadora.map(op => {
                  return (
                    <option key={op.CodigoOperadora} value={op.CodigoOperadora}>
                      {op.NomeFantasia}
                    </option>
                  );
                });
              })}
            </Select>
          </FormControl>
          <Input
            name="numeroCartao"
            props={{
              placeholder: 'Número do cartão de transporte',
              type: 'text',
              maxLength: 15,
            }}
          />
          <Input
            name="nomeCartao"
            props={{
              placeholder: 'Nome ou apelido do cartão de transporte',
              type: 'text',
            }}
          />
          <Column gap="12px">
            <Button type="submit">Adicionar</Button>
            <Button theme="light" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
          </Column>
        </Form>
      </Modal>
    </>
  );
};

export default EmptyCard;
