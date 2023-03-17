import React, { useCallback, useRef } from 'react';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import Input from 'components/ui/input/v2';
import Select, { Options } from 'components/ui/select/v2';
import Button from 'components/ui/button';
import { Column } from 'components/ui/layout';
import DatePicker from 'components/ui/datePicker';
import { Subhead } from 'components/ui/typography/v2';

import { useAuth, useLoad } from 'hooks';
import { DadosUsoCartao } from 'dtos/usuarios';
import UsuarioApi from 'services/apis/usuarioApi';
import UsuarioValid from 'validations/usuarioValid';

interface FormDadosComplementaresProps {
  onChange?: () => void;
  submitLable: string;
}
const LOAD = 'editarDadosComplementares';
const FormDadosComplementares: React.FC<FormDadosComplementaresProps> = ({
  onChange,
  submitLable,
}) => {
  const formRef = useRef<FormHandles>(null);
  const { user, updateUser } = useAuth();
  const { addLoad, removeLoad } = useLoad();

  const handleSubmit = useCallback(
    async (data: DadosUsoCartao) => {
      if (await UsuarioValid.validardadosUsoCartao(data, formRef)) {
        addLoad(LOAD);
        const result = await UsuarioApi.EditarDadosObrigatoriosCartao(data);
        removeLoad(LOAD);
        if (result) {
          updateUser({ ...user, ...data });
          onChange?.();
        }
      }
    },
    [updateUser, user, addLoad, removeLoad, onChange],
  );

  return (
    <Form onSubmit={handleSubmit} ref={formRef}>
      <Column gap="12px">
        <Column gap="12px">
          <Column>
            <Subhead>Como se chama sua mãe ?</Subhead>
            <Input name="NomeMae" placeholder="Nome da Mãe" defaultValue={user.NomeMae} />
          </Column>
          <Column>
            <Subhead>Qual o seu sexo?</Subhead>
            <Select
              name="SexoUsuario"
              placeholder="Sexo"
              defaultValue={Options.sexo.find(({ value }) => value === user.SexoUsuario)}
              options={Options.sexo}
            />
          </Column>
          <Column>
            <Subhead>Quando você nasceu?</Subhead>
            <DatePicker
              name="DataNascimentoUsuario"
              placeholder="Data de Nascimento"
              maxDate={new Date().addYears(-18)}
              date={user.DataNascimentoUsuario}
              showYearDropdown
            />
          </Column>
        </Column>
        <Button type="submit">{submitLable}</Button>
      </Column>
    </Form>
  );
};

export default FormDadosComplementares;
