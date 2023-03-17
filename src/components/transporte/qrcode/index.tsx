import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiChevronRight } from 'react-icons/fi';
import { BiHide, BiShow } from 'react-icons/bi';

import { Link, useRouteMatch, useParams } from 'react-router-dom';
import Button from '../../ui/button';
import Card from '../../ui/card';
import { Column, Row } from '../../ui/layout';
import { BodyP, Title, Small } from '../../ui/typography';
import BackMain from '../../ui/main/back-main';

import CompraQrCode from './compraQrCode';
import UsarQrCode from './usarQrCode';
import MeusQrCodes from './meusQrCodes';
import DetalhesQrCode from './detalhesQrCode';
import { useTransporte } from '../../../hooks/transporteHook';
import { OperadoraTranspote } from '../../../dtos/operadorasTrasporte';

interface CardAcao {
  titulo: string;
  descricao: string;
  route: string;
}
const CardsAcoes: CardAcao[] = [
  {
    titulo: 'Comprar QRCode',
    descricao: 'Comprar créditos para gerar um novo QRCode',
    route: 'compra',
  },
  {
    titulo: 'Usar QRCode',
    descricao: 'Gerar um QRCode para usá-lo no ônibus',
    route: 'gerar',
  },
  {
    titulo: 'Meus QRCodes',
    descricao: 'Ver um QRCode já emitido para usá-lo no ônibus',
    route: 'emitidos',
  },
];
interface TransporteQrCodeProps {
  codigoOperadora: string;
}

const LogoOperadora = styled.img`
  max-height: 125px;
`;

const TransporteQrCode: React.FC = () => {
  const { operadorasTranspote, setCartaoQrcode } = useTransporte();
  let { codigoOperadora } = useParams<TransporteQrCodeProps>();
  const { url } = useRouteMatch();
  const [operadora, setOperadora] = useState<OperadoraTranspote>(null);
  const [showInfo, setShowInfo] = useState<boolean>(false);

  const exibirSaldo = useCallback(async () => {
    await setCartaoQrcode(operadora.Codigo);
    setShowInfo(true);
  }, [setCartaoQrcode, operadora]);

  useEffect(() => {
    const tmpOperadora = operadorasTranspote.find(o => o.Codigo === Number(codigoOperadora));
    setOperadora(tmpOperadora);
  }, [codigoOperadora, operadorasTranspote]);
  const cartao = operadora?.CartaoQrcode;
  const saldo = showInfo ? (cartao?.Saldo ?? 0).toDecimalString() : '•,••';
  const numCard = showInfo && cartao ? cartao.Numero : '•••••••••••••••';
  return (
    <BackMain title="QRcode Transporte" backUrl="/">
      <Column gap="6px">
        <Card color="primary" flex="0 0 145px">
          <Row justify="center" basis="50%">
            <LogoOperadora src={operadora?.Logo} alt={operadora?.Nome} />
          </Row>
          <Column justify="center" basis="50%">
            <BodyP>Saldo QRCode</BodyP>
            <Row grow="0" gap="12px" align="center">
              <Small>R$ {saldo}</Small>
              {showInfo ? (
                <BiShow
                  onClick={() => {
                    setShowInfo(false);
                  }}
                />
              ) : (
                <BiHide
                  onClick={() => {
                    exibirSaldo();
                  }}
                />
              )}
            </Row>
            <Small>{numCard}</Small>
          </Column>
        </Card>
        {CardsAcoes.map(({ titulo, descricao, route }, i) => (
          <Card border={true} key={i}>
            <Column padding="12px" flex="1">
              <Title color="primary">{titulo}</Title>
              <Small>{descricao}</Small>
            </Column>
            <Column justify="center" grow="0" color="primary">
              <Link to={`${url}/${route}`}>
                <Button theme="light">
                  <FiChevronRight size="30" />
                </Button>
              </Link>
            </Column>
          </Card>
        ))}
        <Card color="warning" theme="light">
          <Column padding="12px">
            <Title>Atenção</Title>
            <Small>
              O QRCode não é válido para acesso às linhas de integração e transferência e não
              contempla o desconto da integração.
            </Small>
          </Column>
        </Card>
      </Column>
    </BackMain>
  );
};
export { CompraQrCode, UsarQrCode, MeusQrCodes, DetalhesQrCode };
export default TransporteQrCode;
