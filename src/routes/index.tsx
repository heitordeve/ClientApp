import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { Route as ReactRoute } from 'react-router-dom';

import Route from './Route';
import Dashboard from '../pages/Dashboard';
import TransporteIndex from '../components/transporte';
import DigitalWallet from '../pages/DigitalWallet';
import TermsOfUse from '../pages/TermsOfUse';
import DigitalContent from '../pages/DigitalContent';
import Shopping from '../pages/Shopping';
import Sac from '../pages/Sac/index';
import Orders from '../pages/Orders/index';
import Faq from '../pages/FAQ/index';
import CreditCard from '../pages/CreditCard/index';
import Convenience from '../pages/Convenience/index';
import Benefits from '../pages/Benefits/index';
import Home from 'components/home';
import Perfil from 'components/Perfil';
import styled from 'styled-components';
import { PATHS } from './rotas-path';

const Containe = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  > * {
    flex: 1;
    width: 100%;
  }
`;

const Routes: React.FC = () => {
  return (
    <Containe>
      <Switch>
        <Route path={PATHS.principal} exact component={Home} title="" isPrivate />
        <Route path={PATHS.dashboard} component={Dashboard} isPrivate title="Dashboard" />
        <Route
          path={PATHS.transporte.url}
          component={TransporteIndex}
          isPrivate
          title="Transporte"
        />
        <Route
          path={PATHS.carteiraDigital}
          component={DigitalWallet}
          isPrivate
          title="Carteira Digital"
        />
        <Route path={PATHS.termosDeUso} component={TermsOfUse} isPrivate title="Termos de Uso" />
        <Route
          path={PATHS.conteudosDigitais}
          component={DigitalContent}
          isPrivate
          title="conteúdos digitais"
        />
        <Route path={PATHS.sac} component={Sac} isPrivate title="SAC" />
        <Route path={PATHS.shopping} component={Shopping} isPrivate title="Shopping" />
        <Route path={PATHS.pedidos} component={Orders} isPrivate title="Pedidos" />
        <Route path={PATHS.faq} component={Faq} isPrivate title="FAQ" />
        <Route
          path={PATHS.cartoesDeCredito}
          component={CreditCard}
          isPrivate
          title="Cartões de Crédito"
        />
        <Route path={PATHS.conveniencias} component={Convenience} isPrivate title="conveniências" />
        <Route path={PATHS.beneficios} component={Benefits} isPrivate title="Benefícios " />
        <Route path={PATHS.perfil} component={Perfil} isPrivate title="Perfil" />
        <Redirect from="/transport-recharge" to={PATHS.transporte.url} />
        <ReactRoute path="*">404</ReactRoute>
      </Switch>
    </Containe>
  );
};

export default Routes;
