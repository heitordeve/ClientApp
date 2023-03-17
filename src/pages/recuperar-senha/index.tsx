import React, { useLayoutEffect, useState, useCallback } from 'react';
import { Column, Row } from 'components/ui/layout';
import { Subhead, Caption } from 'components/ui/typography/v2';
import { useAuth } from 'hooks';
import kimLogo from '../../assets/logos/kim-321x150.png';
import styled from 'styled-components';
import { BackMain } from 'components/ui/main';
import Input from 'components/ui/input/v2';
import { Form } from 'components/ui/form';
import Button from 'components/ui/button';
import { success } from 'styles/consts';
import { validatePassword } from 'utils/inputValidator';
import { useHistory, useParams } from 'react-router';
import UsuarioApi from 'services/apis/usuarioApi';
import md5 from 'crypto-js/md5';

const LogoImg = styled.img`
  max-height: 150px;
  max-width: 150px;
`;
const Ul = styled.ul`
  list-style-position: inside;
  .ok {
    color: ${success};
  }
`;
interface RecuracaoDeSenhaProps {
  token: string;
}
class Validations {
  letras: boolean = false;
  numeros: boolean = false;
  caracteres: boolean = false;
  igual: boolean = false;
  isValid = () => this.letras && this.numeros && this.caracteres && this.igual;
}

const RecuracaoDeSenha: React.FC = () => {
  const { user, signOut } = useAuth();
  let { token } = useParams<RecuracaoDeSenhaProps>();
  const { replace } = useHistory();

  const [validations, setValidations] = useState<Validations>(new Validations());
  const [senha, setSenha] = useState<string>();
  const [confirmacao, setConfirmacao] = useState<string>();

  const onchangeSenha = useCallback(
    (value: string) => {
      setValidations(prev => {
        prev.letras = RegExp(/([a-z]|[A-Z])/g).test(value);
        prev.numeros = RegExp(/\d/g).test(value);
        prev.caracteres = value.length.between(6,15);
        prev.igual = value === confirmacao;
        return prev;
      });
      setSenha(value);
    },
    [setValidations, setSenha, confirmacao],
  );
  const onchangeConfirmacao = useCallback(
    (value: string) => {
      setValidations(prev => {
        prev.igual = value === senha;
        return prev;
      });
      setConfirmacao(value);
    },
    [setValidations, setConfirmacao, senha],
  );

  const onSubmit = useCallback(
    async ({ senha }: { senha: string }) => {
      if (validatePassword(senha)) {
        const result = await UsuarioApi.RecuperarSenha(md5(senha).toString(), token);
        if (result) {
          replace('/');
        }
      }
    },
    [token, replace],
  );

  useLayoutEffect(() => {
    if (user) {
      signOut();
    }
  }, [user, signOut]);
  return (
    <Column align="stretch">
      <Row justify="center" background="white" className="no-sm">
        <LogoImg src={kimLogo} alt="logo" />
      </Row>
      <BackMain title="Recuperar senha" maxWidth="350px">
        <Form onSubmit={onSubmit}>
          <Column gap="1rem" flex="1">
            <Subhead size="SB"> Informe sua nova senha de login:</Subhead>
            <Input
              data-testid="senha"
              name="senha"
              placeholder="Senha"
              onKeyUp={e => onchangeSenha((e.target as any).value)}
              onChange={e => onchangeSenha((e.target as any).value)}
              type="password"
            />
            <Column>
              <Input
                data-testid="confima-senha"
                name="confima-senha"
                placeholder="Confimar Senha"
                onKeyUp={e => onchangeConfirmacao((e.target as any).value)}
                onChange={e => onchangeConfirmacao((e.target as any).value)}
                type="password"
              />
              <Caption>
                <Ul data-testid="senha-feedback">
                  <li className={validations.letras ? 'ok' : ''}>Pelo menos uma letra</li>
                  <li className={validations.numeros ? 'ok' : ''}>Pelo menos um número</li>
                  <li className={validations.caracteres ? 'ok' : ''}>Entre 6 a 15 caracteres</li>
                  <li className={validations.igual ? 'ok' : ''}>Confirmação confere com a senha</li>
                </Ul>
              </Caption>
            </Column>
          </Column>
          <Button type="submit" disabled={!validations.isValid()} data-testid="senha-btn">
            Confirmar Senha
          </Button>
        </Form>
      </BackMain>
    </Column>
  );
};

export default RecuracaoDeSenha;
