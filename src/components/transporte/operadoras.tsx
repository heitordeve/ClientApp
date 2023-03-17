import React, { useState, useEffect, useCallback } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';

import { useTransporte } from '../../hooks/transporteHook';
import Card from '../ui/card';
import { Column, Row, Grid, Flex } from 'components/ui/layout';
import { Fab, FabContainer, IconButton } from '../ui/button';
import Carrossel from '../ui/carrossel';
import { BiBus, BiMapAlt } from 'react-icons/bi';
import { IconType } from 'react-icons';
import { OperadoraTranspote } from '../../dtos/operadorasTrasporte';
import {
  IcQrCode,
  IcPrimeiraVia,
  IcSegundaVia,
  IcRecargaCelular,
  IcRight,
  IcCarteira,
  IcShopping,
  IcCupom,
} from '../ui/icons';
import { MdSchool } from 'react-icons/md';
import Parametros from 'utils/parametros';
import GpsUtils from 'utils/gps';
import { media, breakpoint } from 'styles';
import { Small, Title } from 'components/ui/typography';
import { CartaoQrCodeApi } from 'services/apis';
import { Coordenadas } from 'dtos/geral';
import { PATHS } from 'routes/rotas-path';

const BoxBtn = styled(IconButton)`
  ${media.max(breakpoint.xs)} {
    max-height: 90px;
    max-width: 90px;
  }
  padding: 0 6px;
`;

const LogoOperadora = styled.img`
  object-fit: contain;
  height: 150px;
  max-width: 250px;
`;

interface BtnOperadora {
  icon: IconType;
  text: string;
  show: (operadora: OperadoraTranspote) => boolean;
  to?: ((operadora: OperadoraTranspote, url: string) => string) | string;
}
const buttonsOperadora: BtnOperadora[] = [
  {
    icon: BiBus,
    text: 'Recarga Cartão Transporte',
    show: () => true,
    to: (o, url) => `${PATHS.transporte.recarga}/${o.Codigo}`,
  },
  {
    icon: BiMapAlt,
    text: 'Meu Ônibus',
    show: o => Parametros.meuOnibusAtivo && o.TemMapa,
  },
  {
    icon: IcQrCode,
    text: 'QRCode Transporte',
    show: o => Parametros.vendaQrcodeAtivo && o.TemQRCode,
    to: o => `${PATHS.transporte.qrcode}/${o.Codigo}`,
  },
  { icon: MdSchool, text: 'Revalidação', show: o => false && o.TemRevalidacao },
  // {
  //   icon: IcPrimeiraVia,
  //   text: 'Primeira Via de Cartão',
  //   to: o => `${PATHS.transporte.primeiraVia}/${o.Codigo}`,
  //   show: o => Parametros.primeiraViaAtivo && o.TemPrimeiraVia,
  // },
  // {
  //   icon: IcSegundaVia,
  //   text: 'Segunda Via de Cartão',
  //   to: o => `${PATHS.transporte.segundaVia}/${o.Codigo}`,
  //   show: o => Parametros.segundaViaAtivo && o.TemSegundaVia,
  // },
];

interface BtnMenu {
  icon: IconType;
  text: string;
  show: () => boolean;
  to?: ((url: string) => string) | string;
}

const buttonsMenu: BtnMenu[] = [
  {
    icon: BiBus,
    text: 'Recarga Cartão Transporte',
    show: () => true,
    to: () => PATHS.transporte.url,
  },
  {
    icon: BiMapAlt,
    text: 'Meu Ônibus',
    show: () => Parametros.meuOnibusAtivo,
  },
  {
    icon: IcRecargaCelular,
    text: 'Recarga Celular',
    show: () => true,
    to: () => PATHS.dashboard,
  },
  { icon: MdSchool, text: 'Notificações', show: () => false },
  {
    icon: IcCarteira,
    text: 'Carteira Digital',
    show: () => true,
    to: () => PATHS.carteiraDigital,
  },
  {
    icon: IcShopping,
    text: 'Shopping',
    show: () => true,
    to: () => PATHS.shopping,
  },
  {
    icon: IcCupom,
    text: 'Conteúdos Digitais',
    show: () => true,
    to: () => PATHS.conteudosDigitais,
  },
];
const OperadorasTransporte: React.FC = () => {
  const { operadorasTranspote, setCartaoQrcode, getQrcodes } = useTransporte();
  const { url } = useRouteMatch();
  const [qrcodeOperadora, setQrcodeOperadora] = useState<number>(null);
  const [coordenadas, setCoordenadas] = useState<Coordenadas>({ Latitude: 0, Longitude: 0 });

  const exibirFabQrcode = useCallback(
    async (operadoras: OperadoraTranspote[]) => {
      const opQrcode = operadoras.find(o => o.TemQRCode);
      if (opQrcode) {
        const qrcodes = getQrcodes();
        if (qrcodes.some(q => q.DataValidadeCarga > new Date())) {
          setQrcodeOperadora(opQrcode.Codigo);
          return;
        }
        if (!opQrcode.CartaoQrcode) {
          await setCartaoQrcode(opQrcode.Codigo);
        }
        if (opQrcode.CartaoQrcode) {
          const qrCodes = await CartaoQrCodeApi.QrCodeDisponiveis({
            CodOperadora: opQrcode.Codigo,
            CodExtCartao: opQrcode.CartaoQrcode.Numero,
            QtdPag: 5,
            Pag: 1,
          });
          if (qrCodes.length > 0) {
            setQrcodeOperadora(opQrcode.Codigo);
          }
        }
      }
    },
    [setQrcodeOperadora, setCartaoQrcode, getQrcodes],
  );

  useEffect(() => {
    exibirFabQrcode(operadorasTranspote);
  }, [operadorasTranspote, exibirFabQrcode]);

  useEffect(() => {
    (async () => {
      const coos = await GpsUtils.getCoordenadasAsync();
      setCoordenadas(coos);
    })();
  }, []);
  return (
    <>
      <Column gap="12px" background="white" padding="12px 0">
        <Carrossel height="320px">
          {operadorasTranspote
            .order(o => GpsUtils.getDistanciaEmKm(o.AreaAtuacao, coordenadas))
            .map(o => (
              <Card key={o.Codigo} id={`${o.Codigo}`} color="primary" width="100%">
                <Column align="center" gap="12px" flex="1" width="312px" maxWidth="100%">
                  <Column maxHeight="170px" justify="center">
                    <LogoOperadora src={o.Logo} />
                  </Column>
                  <Grid gap="6px" templateColumns="auto auto auto">
                    {buttonsOperadora.map(
                      (btn, i) =>
                        btn.show(o) &&
                        (btn.to ? (
                          <Link key={i} to={typeof btn.to === 'function' ? btn.to(o, url) : btn.to}>
                            <BoxBtn color="gray-1" label={btn.text} icone={btn.icon} />
                          </Link>
                        ) : (
                          <BoxBtn key={i} color="gray-1" label={btn.text} icone={btn.icon} />
                        )),
                    )}
                  </Grid>
                </Column>
              </Card>
            ))}
        </Carrossel>
        <Row justify="center">
          <Flex direction="row" sm="col" grow="0" gap="12px" maxWidth="650px">
            <Row gap="6px" wrapp justify="center" maxWidth="100vw" flex="1">
              {buttonsMenu.map(
                (btn, i) =>
                  btn.show() && (
                    <Link key={i} to={typeof btn.to === 'function' ? btn.to(url) : btn.to ?? '#'}>
                      <BoxBtn color="primary" theme="light" label={btn.text} icone={btn.icon} />
                    </Link>
                  ),
              )}
            </Row>
            {false && (
              <Column flex="1">
                <Title>Favoritos</Title>
                <Card border grow="0" align="center">
                  <Row colorText="primary">
                    <IcRecargaCelular size="30px" />
                  </Row>
                  <Column flex="1">
                    <Small>Recarga Celular</Small>
                    <Small color="secondary">Meu Celular</Small>
                    <Small color="primary">(99)99887-6655</Small>
                  </Column>
                  <IcRight />
                </Card>
              </Column>
            )}
          </Flex>
        </Row>
        {qrcodeOperadora && (
          <FabContainer>
            <Link to={`${PATHS}/${qrcodeOperadora}/emitidos`}>
              <Fab size={56} color="secondary">
                <IcQrCode />
              </Fab>
            </Link>
          </FabContainer>
        )}
      </Column>
    </>
  );
};

export default OperadorasTransporte;
