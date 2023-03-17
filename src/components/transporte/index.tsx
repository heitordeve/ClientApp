import React from 'react';

import { Route, Switch, useRouteMatch, Redirect } from 'react-router-dom';
import TransporteQrCode, { CompraQrCode, UsarQrCode, MeusQrCodes, DetalhesQrCode } from './qrcode';
import TransportRechargeSchedule from '../../pages/TransportRechargeSchedule';
import OperadorasTransporte from './operadoras';
import CartoesTransporte from './cartoes';
import { Column, Row } from '../ui/layout';
import { Title } from '../ui/typography';
import Parametros from 'utils/parametros';
import PrimeiraVia from './vias/primeiraVia';
import SegundaVia from './vias/segundaVia';

const TransporteIndex: React.FC = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Redirect from={`${path}/schedule/:id`} to={`${path}/agendamento/:id`} />

      {!Parametros.vendaQrcodeAtivo && <Redirect from={`/`} exact to={`/dashboard`} />}
      <Route path={`${path}/qrcode/:codigoOperadora`} exact>
        <TransporteQrCode />
      </Route>
      <Route path={`${path}/qrcode/:codigoOperadora/compra`}>
        <CompraQrCode />
      </Route>
      <Route path={`${path}/qrcode/:codigoOperadora/gerar`}>
        <UsarQrCode />
      </Route>
      <Route path={`${path}/qrcode/:codigoOperadora/emitidos`}>
        <MeusQrCodes />
      </Route>
      <Route path={`${path}/qrcode/:codigoOperadora/detalhes/:codigoQrcode/:compra?`}>
        <DetalhesQrCode />
      </Route>
      <Route path={`/`} exact>
        <OperadorasTransporte />
      </Route>
      <Route path={`${path}`} exact>
        <CartoesTransporte />
      </Route>
      <Route path={`${path}/recarga/:codigoOperadora`} exact>
        <CartoesTransporte />
      </Route>
      <Route path={`${path}/agendamento/:id`}>
        <TransportRechargeSchedule />
      </Route>
      <Route path={`${path}/via/primeira/:codigoOperadora`}>
        <PrimeiraVia />
      </Route>
      <Route path={`${path}/via/segunda/:codigoOperadora`}>
        <SegundaVia />
      </Route>

      <Route path="*">
        <Column justify="center">
          <Row justify="center" grow="0">
            <Title>Página não encontrada</Title>
          </Row>
        </Column>
      </Route>
    </Switch>
  );
};

export default TransporteIndex;
