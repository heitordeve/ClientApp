import React, { useState, useEffect } from 'react';
import { Form } from '@unform/web';

import { useAuth } from 'hooks/auth';

import { UsuarioEnderecoApi } from 'services/apis';

import EditAdress from './EditAdress';
import EditPassword from './EditPassword';

import { UsuarioEndereco } from 'dtos/endereco';
import { mascaraCpf, mascaraCnpj } from 'utils/printHelper';

import { Row, Column } from 'components/ui/layout';
import BackMain from 'components/ui/main/back-main';
import Input from 'components/ui/input/v2';
import { Label } from 'components/ui/typography';

const Perfil: React.FC = () => {
  const { user } = useAuth();
  const [endereco, setEndereco] = useState<UsuarioEndereco>(null);
  useEffect(() => {
    (async () => {
      const tmpEnderecos = await UsuarioEnderecoApi.Listar();
      setEndereco(tmpEnderecos[0]);
    })();
  }, []);

  return (
    <BackMain title="Perfil">
      <Form onSubmit={() => {}}>
        <Column gap="12px">
          <Column>
            <Label>Nome</Label>
            <Input
              name="name"
              placeholder="Digite seu nome"
              value={user.NomeUsuario}
              disabled={true}
            />
          </Column>
          <Column>
            <Label>{user.CnpjUsuario ? 'CPNJ' : 'CPF'}</Label>
            <Input
              name="cpf"
              value={
                user.CnpjUsuario
                  ? mascaraCnpj(user.CnpjUsuario)
                  : mascaraCpf(user.CpfUsuario)
              }
              disabled={true}
            />
          </Column>
          <Column>
            <Label>Email</Label>
            <Input
              name="email"
              id="email"
              placeholder="Digite seu E-mail"
              value={user.EmailUsuario}
              disabled={true}
            />
          </Column>
          <Column>
            <Label>Telefone</Label>
            <Input
              name="tel"
              id="tel"
              placeholder="Digite seu Telefone"
              value={`(${user.NumeroDDD}) ${user.NumeroTelefone}`}
              disabled={true}
            />
          </Column>
          <Column>
            <Label>Cep</Label>
            <Input name="cep" id="cep" value={endereco?.CEP} disabled={true} />
          </Column>
          <Column>
            <Label>Endereço</Label>
            <Input
              name="end"
              id="end"
              value={endereco?.Logradouro}
              disabled={true}
            />
          </Column>
          <Column>
            <Label>Bairro</Label>
            <Input
              name="bairro"
              id="bairro"
              value={endereco?.NomeBairro}
              disabled={true}
            />
          </Column>
          <Column>
            <Label>Nº</Label>
            <Input
              name="number"
              id="number"
              value={endereco?.Numero}
              disabled={true}
            />
          </Column>
          <Column>
            <Label>Cidade</Label>
            <Input
              name="cidade"
              id="cidade"
              value={endereco?.NomeMunicipio}
              disabled={true}
            />
          </Column>
          <Row gap="12px">
            <EditAdress />
            <EditPassword />
          </Row>
        </Column>
      </Form>
    </BackMain>
  );
};

export default Perfil;
