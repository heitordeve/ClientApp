import React from 'react';
import { Switch } from 'react-router-dom';
import { Route as ReactRoute } from 'react-router-dom';

import Route from './Route';
import SignUp from '../pages/SignUp';
import ForgotPassword from '../pages/ForgotPassword';
import PessoaFisica from '../pages/SignUp/PessoaFisica';
import PessoaJuridica from '../pages/SignUp/PessoaJuridica';
import Map from '../pages/Map';
import { OverLoading } from 'components/ui/loading';
import { useAuth, useLoad } from 'hooks';
import styled from 'styled-components';
import RecuracaoDeSenha from 'pages/recuperar-senha';
import SignIn from 'pages/SignIn';
import { PATHS } from './rotas-path';

const Containe = styled.div`
  width: 100vw;
  height: 100vh;
`;
const RotasPublicas: React.FC = ({ children }) => {
  const { isloading } = useLoad();
  const { user } = useAuth();

  return (
    <OverLoading loading={isloading}>
      <Containe>
        <Switch>
          <Route path={PATHS.cadastro} exact component={SignUp} title="Cadastro" />
          <Route path={PATHS.mapa} exact component={Map} title="Mapa" />
          <Route
            path={PATHS.recuperarSenha}
            component={RecuracaoDeSenha}
            title="recuperação de senha"
          />
          <Route
            path={PATHS.esqueciSenha}
            exact
            component={ForgotPassword}
            title="Esqueci minha senha"
          />

          {!user && <Route path={PATHS.principal} exact component={SignIn} title="" />}
          <ReactRoute path="*">{children}</ReactRoute>
        </Switch>
      </Containe>
    </OverLoading>
  );
};

export default RotasPublicas;
