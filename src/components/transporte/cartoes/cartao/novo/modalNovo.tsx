import React, { useState, useCallback, useRef } from 'react';

import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import api from 'services/api';
import { useAuth } from 'hooks/auth';
import { useAlert } from 'hooks/alert';
import { useCartaoTransporte } from '../../../hooks/cartaoTransporteHook';
import getValidationErrors from 'utils/getValidationErrors';

import Select, { OptionsType } from 'components/ui/select/v2';
import Button from 'components/ui/button';
import Input from 'components/ui/input/v2';

import { Column, Row } from 'components/ui/layout';
import Modal from 'components/ui/modal';

interface CardFormData {
  codigoOperadora: number;
  nomeCartao: string;
  numeroCartao: string;
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
interface ModalNovoCartaoProps {
  onClose: () => void;
}
const ModalNovoCartao: React.FC<ModalNovoCartaoProps> = ({ onClose }) => {
  const { user } = useAuth();
  const { addAlert } = useAlert();

  const history = useHistory();
  const formRef = useRef<FormHandles>(null);
  const trContext = useCartaoTransporte();

  const [loading, setLoading] = useState(false);
  const [loadOperadoras, setLoadOperadoras] = useState(false);
  const [, setCardsType] = useState<CardTypeData[]>([]);
  const [operators, setOperators] = useState<OperatorData[]>([]);

  const handleSubmit = useCallback(
    (data: CardFormData) => {
      formRef.current?.setErrors({});
      Yup.object<CardFormData>()
        .shape({
          codigoOperadora: Yup.number()
            .typeError('Selecione uma operadora')
            .required('Selecione uma operadora'),
          nomeCartao: Yup.string()
            .required('Nome ou apelido do cartão de transporte é obrigatório')
            .max(30, 'Limite de 20 caracteres para o Nome ou apelido do cartão de transporte'),
          numeroCartao: Yup.string().required('Número do cartão de transporte é obrigatório'),
        })
        .validate(data, {
          abortEarly: false,
        })
        .then(value => {
          setLoading(true);
          api
            .post(`KimMais.Api.NovoCartao/${user.TokenUsuario}/${user.CodigoUsuario}`, {
              CodigoUsuario: user.CodigoUsuario,
              CodigoOperadora: value.codigoOperadora,
              NumeroCartao: value.numeroCartao,
              NomeCartao: value.nomeCartao,
            })
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
                  description: 'Erro ao enviar dados. ' + response.data.Mensagem,
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
    (option: OptionsType) => {
      formRef.current.setFieldValue('codigoOperadora', undefined);
      if (!option) return;
      setLoadOperadoras(true);
      const url = `/KimMais.Api.ObterOperadorasPorCidade/${user.TokenUsuario}/${user.CodigoUsuario}?idcidade=${option.value}`;
      api
        .get(url)
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
          setLoadOperadoras(false);
        })
        .catch(() => {
          setLoadOperadoras(false);
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
    (event: OptionsType) => {
      if (!event) return;
      const operator = operators.find(x => x.CodigoOperadora === event.value);
      if (operator) {
        setCardsType(operator.ListaOperadora[0].ListaTipoCartao);
      }
      const nomeCartao = formRef.current.getFieldValue('nomeCartao');
      const de = ` de ${user.NomeUsuario.split(' ')[0]}`;
      if (nomeCartao && !nomeCartao.endsWith(de)) {
      }
      formRef.current.setFieldValue('nomeCartao', `${event.label}${de}`.substring(0, 30));
    },
    [operators, user.NomeUsuario],
  );

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Cadastro de cartão de transporte"
      minWidth="350px"
      loading={loading}
    >
      <Form onSubmit={handleSubmit} ref={formRef} className="flex flex-1">
        <Column gap="12px" padding="1rem 0 0" flex="1">
          <Column gap="12px" flex="1" scroll>
            <Select
              name="cidade"
              onChange={handleChangeCity}
              defaultValue=""
              options={trContext.cidades?.map(c => ({
                value: c.CodigoCidade,
                label: c.NomeCidade,
              }))}
            />

            <Select
              name="codigoOperadora"
              onChange={handleChangeOperators}
              disabled={operators.length > 0 ? false : true}
              defaultValue=""
              isLoading={loadOperadoras}
              options={operators
                .map(operator =>
                  operator.ListaOperadora.map(op => ({
                    value: op.CodigoOperadora,
                    label: op.NomeFantasia,
                  })),
                )
                .flat()}
            />
            <Input
              name="numeroCartao"
              placeholder="Número do cartão de transporte"
              maxLength={15}
            />
            <Input
              name="nomeCartao"
              placeholder="Nome ou apelido do cartão de transporte"
              maxLength={30}
            />
          </Column>
          <Row gap="12px">
            <Button theme="light" onClick={e => onClose()}>
              Cancelar
            </Button>
            <Button type="submit">Adicionar</Button>
          </Row>
        </Column>
      </Form>
    </Modal>
  );
};

export default ModalNovoCartao;
