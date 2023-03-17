import React, { useCallback } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';

import Card from '../../ui/card';
import { Column, Row } from '../../ui/layout';
import { Strong, Small, BodySpan } from '../../ui/typography';
import { AiOutlineQrcode } from 'react-icons/ai';
import { primary, gray3 } from '../../../styles/consts';
import { IcRecargaQrcode, IcRight } from 'components/ui/icons';
import { QrCode } from 'dtos/cartaoQrcode';
import { StausQrCode } from 'models/qrcode';
import Button from 'components/ui/button';
interface CardQrCodeProps {
  qrCode: QrCode;
  disponiveis: boolean;
}
const CardQrCode: React.FC<CardQrCodeProps> = ({ qrCode, disponiveis }) => {
  const { url } = useRouteMatch();
  const history = useHistory();

  const abrirQrcode = useCallback(async () => {
    history.push(url.replace('emitidos', `detalhes/${qrCode.CodigoQRCode}`));
  }, [qrCode, history, url]);

  const recarga = qrCode.TipoEvento === 'C';
  const Icon = recarga ? IcRecargaQrcode : AiOutlineQrcode;
  const desativado = ['1', '2'].includes(qrCode.StatusUso);
  const status = StausQrCode.get(qrCode.StatusUso);
  return (
    <Card
      border
      align="center"
      padding="20px 15px"
      gap="12px"
      colorText={desativado ? 'gray-3' : 'gray-4'}
    >
      <Icon size="30" color={desativado ? gray3 : primary} />
      <Column grow="1">
        <Strong wordBreak="break-all" color={desativado ? 'gray-3' : 'primary'}>
          {recarga ? 'QRCode Transporte' : `${qrCode.IcEstacao ? '' : 'Linha'} ${qrCode.Linha}`}
        </Strong>
        <Small>Emissão: {(qrCode.DataEvento ?? qrCode.DataGeracao).format('HH:mm')}H</Small>
        <Small>
          {recarga ? 'Valor' : 'Tarifa'}: R$ {qrCode.Valor.toDecimalString()}
        </Small>
        {disponiveis && (
          <Small>
            Validade: R${' '}
            {(qrCode.DataValidadeCarga ?? qrCode.DataEvento)?.format('dd/MM/yyyy HH:mm hs')}
          </Small>
        )}
      </Column>
      {!disponiveis && (
        <Row align="center" grow={0}>
          {status.lebel(recarga) && (
            <Card border={true} grow="0" radius="40px">
              <BodySpan margin="0 10px" color={status.color(recarga)} whiteSpace="nowrap">
                <Small>{status.lebel(recarga)}</Small>
              </BodySpan>
            </Card>
          )}
        </Row>
      )}
      {disponiveis && (
        <Column justify="center" grow="0" color="primary">
          <Button theme="light" onClick={() => abrirQrcode()}>
            <IcRight size="30" />
          </Button>
        </Column>
      )}
    </Card>
  );
};

export default CardQrCode;
