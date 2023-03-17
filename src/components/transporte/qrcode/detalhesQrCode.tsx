import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useParams, useHistory } from 'react-router-dom';

import { AlertCard } from '../../ui/card';
import BackMain from '../../ui/main/back-main';
import { useTransporte } from '../../../hooks/transporteHook';
import { QrCode } from 'dtos/cartaoQrcode';
import { Title, Strong, BodySpan, SSmall } from '../../ui/typography';
import { Column, Row } from 'components/ui/layout';
import { ModalAlert } from 'components/ui/modal';
import Button from 'components/ui/button';
import { alertService } from 'hooks/alert';
import { PATHS } from 'routes/rotas-path';

export const QRcode = styled.img`
  min-width: 300px;
  max-width: 350px;
`;

interface DetalhesQrCodeParams {
  codigoQrcode: string;
  codigoOperadora: string;
  compra: string;
}

const DetalhesQrCode: React.FC = () => {
  let { codigoQrcode, codigoOperadora, compra } = useParams<DetalhesQrCodeParams>();
  const { getQrcodes } = useTransporte();
  const [qrcode, setQrcode] = useState<QrCode>(null);
  const history = useHistory();

  const getAviso = useCallback(() => {
    const data = qrcode?.DataValidadeCarga?.format('dd/MM/yyyy') ?? '';
    const hora = qrcode?.DataValidadeCarga?.format('HH:mm') ?? '';
    return (
      `Este QRCode expirará no dia ${data} às ${hora} horas. ` +
      `Você pode visualizá-lo em Meus QRCodes, no menu QRCode.`
    );
  }, [qrcode]);

  const getModal = useCallback(
    (back: () => void, cancel: () => void) => {
      if (compra) {
        const data = qrcode?.DataValidadeCarga?.format('dd/MM/yyyy') ?? '';
        const hora = qrcode?.DataValidadeCarga?.format('HH:mm') ?? '';
        return (
          <ModalAlert title="Atenção">
            <SSmall>
              O QRCode gerado estará disponível para uso até o dia {data} às {hora} horas. Você pode
              encontrá-lo também em Meus QRCodes, no menu QRCode. Deseja concluir a operação?
            </SSmall>
            <Row gap="12px">
              <Button flex="1" theme="light" onClick={() => cancel()}>
                Não
              </Button>
              <Button flex="1" onClick={() => back()}>
                Sim
              </Button>
            </Row>
          </ModalAlert>
        );
      }
      back();
    },
    [compra, qrcode],
  );

  const exibir = useCallback(async () => {
    const tempQrcode = getQrcodes()?.find(q => q.CodigoQRCode === Number(codigoQrcode));
    if (tempQrcode) {
      setQrcode(tempQrcode);
    } else {
      alertService.error('Erro', 'Erro ao exibir Qrcode');
      history.replace(`${PATHS.transporte.qrcode}/${codigoOperadora}/emitidos`);
    }
  }, [getQrcodes, codigoQrcode, setQrcode, history, codigoOperadora]);

  useEffect(() => {
    exibir();
  }, [exibir]);

  return (
    <BackMain
      title="Usar QRCode"
      backUrl={`${PATHS.transporte.qrcode}/${codigoOperadora}/emitidos`}
      beforeBack={getModal}
    >
      <Column align="center" gap="12px">
        <Strong>
          Toque no QRCode da tela do validador e aponte o código abaixo para liberar sua passagem.
        </Strong>
        <Title>Linha {qrcode?.Linha}</Title>
        <QRcode src={qrcode?.ImagemBase64} alt="QRcode" />
        <BodySpan>Tarifa: R$ {qrcode?.Valor.toDecimalString()}</BodySpan>
        <AlertCard titulo="Aviso" texto={getAviso()} />
      </Column>
    </BackMain>
  );
};

export default DetalhesQrCode;
