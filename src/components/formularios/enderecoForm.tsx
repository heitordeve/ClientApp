import React, { useState, useCallback, useRef, useEffect } from 'react';

import { Form } from '@unform/web';

import { FormHandles } from '@unform/core';
import { Endereco, Estado } from 'dtos/endereco';
import Input from 'components/ui/input/v2';
import Select, { OptionsType } from 'components/ui/select/v2';
import Button from 'components/ui/button';
import { EstadoApi, EnderecoApi } from 'services/apis';
import { useLoad } from 'hooks';
import { EnderecoValidations } from 'validations';
import { Column, Row } from 'components/ui/layout';
import { Subhead } from 'components/ui/typography/v2';

interface FormEnderecoProps {
  endereco?: Endereco;
  onChange: (endereco: Endereco, formRef: React.MutableRefObject<FormHandles>) => void;
  submitLable: string;
}
const FormEndereco: React.FC<FormEnderecoProps> = ({ endereco, onChange, submitLable }) => {
  const formRef = useRef<FormHandles>(null);
  const [estados, setEstados] = useState<Estado[]>([]);
  const { addLoad, removeLoad } = useLoad();

  useEffect(() => {
    (async () => {
      const LOAD = 'lisarEstados';
      addLoad(LOAD);
      const tpmEstados = await EstadoApi.Listar();
      setEstados(tpmEstados);
      removeLoad(LOAD);
      formRef?.current?.setData(endereco);
    })();
  }, [setEstados, addLoad, removeLoad, endereco]);

  const handleSubmit = useCallback(
    async (data: Endereco) => {
      const valid = await EnderecoValidations.ValidarEndereco(data, formRef);
      if (valid) {
        data.Estado = estados.find(e => data.Estado.Id === e.Id);
        onChange(data, formRef);
      }
    },
    [formRef, estados, onChange],
  );

  const BuscarEndereco = useCallback(async () => {
    const cep = formRef.current.getData().Cep;
    if (cep.match(/^(\d{5})-(\d{3})$/)) {
      const LOAD = 'buscarCep';
      addLoad(LOAD);
      const enderecoTmp = await EnderecoApi.ObterPorCep(cep.replace(/\D/g, ''));
      removeLoad(LOAD);
      if (enderecoTmp) {
        let estado = estados.find(e => enderecoTmp.Estado.Sigla === e.Sigla);
        formRef.current.setData({
          ...formRef.current.getData(),
          Logradouro: enderecoTmp.Logradouro,
          Cidade: enderecoTmp.Cidade,
          Estado: { Id: estado.Id },
          Bairro: enderecoTmp.Bairro,
        });
      }
    }
  }, [formRef, estados, addLoad, removeLoad]);

  return (
    <Form className="form" onSubmit={handleSubmit} ref={formRef}>
      <Column gap="12px">
        <Column>
          <Subhead>CEP</Subhead>
          <Row gap="12px">
            <Input name="Cep" placeholder="CEP" mask="cep" onChange={BuscarEndereco} flex="1" />
            <Button onClick={BuscarEndereco} flex="0">
              Buscar CEP
            </Button>
          </Row>
        </Column>
        <Column>
          <Subhead>Endereço</Subhead>
          <Input name="Logradouro" placeholder="Endereço" />
        </Column>
        <Column>
          <Subhead>Número</Subhead>
          <Input name="Numero" placeholder="Número" />
        </Column>
        <Column>
          <Subhead>Complemento</Subhead>
          <Input name="Complemento" placeholder="Complemento" />
        </Column>
        <Column>
          <Subhead>Bairro</Subhead>
          <Input name="Bairro" placeholder="Bairro" />
        </Column>
        <Column>
          <Subhead>Cidade</Subhead>
          <Input name="Cidade" placeholder="Cidade" />
        </Column>
        <Column>
          <Subhead>UF</Subhead>
          <Select
            name="Estado.Id"
            required
            defaultValue=""
            options={estados.map(
              e => ({ value: e.Id, label: `${e.Sigla} - ${e.Nome}` } as OptionsType),
            )}
          />
        </Column>

        <Button type="submit">{submitLable}</Button>
      </Column>
    </Form>
  );
};

export default FormEndereco;
