import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Pedido } from 'dtos/Pedidos';

import BackMain from 'components/ui/main/back-main';
import Button from 'components/ui/button';
import Card from 'components/ui/card';
import { Column, Row, Hr } from 'components/ui/layout';
import { Title, Subtitle, BodySpan, Small } from 'components/ui/typography';

import { QRcode, LogoOperadora, LogoOperadoraDiv } from './styles';
import { getNomeStatusPagamento, getNomeTipoPagamento } from 'models/pagamentos';
import { URL_API_ASSETS } from 'services/apiBase';
import { NumberToReais } from 'utils/printHelper';
import SendProof from './sendProof';
import CancelOrder from './cancelOrder';
import { alertService } from 'hooks';
import { EmailApi, PedidoApi } from 'services/apis';
import { TipoPagamentoEnum } from 'enuns/tipoPagamentoEnum';

interface OrderDetailsProps {
  numPedido: number;
  voltar: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ numPedido, voltar }) => {
  const [pedido, setPedido] = useState<Pedido>(null);
  const [envioComprovante, setEnvioComprovante] = useState<boolean>(false);
  const [cancelar, setCancelar] = useState<boolean>(false);

  const ObterPedido = useCallback(async () => {
    const tmpPedido = await PedidoApi.Obter(numPedido);
    if (tmpPedido) {
      setPedido(tmpPedido);
    } else {
      voltar();
    }
  }, [numPedido, voltar]);

  const copyPix = () => {
    navigator.clipboard.writeText(pedido.EMVPix);
    alertService.success('Sucesso', 'Pix copiado!');
  };
  const copyBoleto = () => {
    navigator.clipboard.writeText(pedido.CodigoBarrasBoleto);
    alertService.success('Sucesso', 'Código de barras copiado!');
  };

  const envioEmail = async () => {
    var result = await EmailApi.EnvioBoleto(pedido.CodigoPedido);
    if (result) {
      alertService.success('Envio Email', 'Email Enviado com sucesso!');
    }
  };

  useEffect(() => {
    ObterPedido();
  }, [ObterPedido]);

  const cardBoleto = () => (
    <Card border={true}>
      <Column>
        <BodySpan>
          <strong>Utilize o número do código de barras abaixo para realizar o pagamento:</strong>
        </BodySpan>
        <BodySpan>{pedido.LinhaDigitavelBoleto}</BodySpan>
        <Small>{pedido.DataVencimentoBoleto}</Small>
        <Column gap="8px">
          <Button onClick={() => copyBoleto()} theme="light">
            Copiar Numero
          </Button>
          <Button onClick={() => envioEmail()}>Enviar Boleto pro E-mail</Button>
        </Column>
      </Column>
    </Card>
  );

  const transferenciaInfo = (lable: string, value: string) => (
    <BodySpan>
      {lable}: <strong> {value}</strong>
    </BodySpan>
  );

  const cardTransferencia = () => (
    <Card color="success">
      <Column gap="5px">
        <Small>Conclua o pagamento do seu pedido realizando uma transferência para:</Small>
        {transferenciaInfo('Banco', pedido.FastCashBank.Bank)}
        {transferenciaInfo('Agência', pedido.FastCashBank.Agency)}
        {transferenciaInfo('Conta', pedido.FastCashBank.Account)}
        {transferenciaInfo('Favorecido', pedido.FastCashBank.AccountHolder)}
        {transferenciaInfo('CNPJ', pedido.FastCashBank.AccountHolderDocument)}
        <Button onClick={() => setEnvioComprovante(true)}>Anexar comprovante</Button>
      </Column>
    </Card>
  );
  const cardPix = () => (
    <>
      <Card border={true}>
        <Column flex="1" align="center">
          <QRcode src={`data:image/png;base64, ${pedido.QRCodePix}`} alt="QRcode" />
          <Button onClick={copyPix} theme="light">
            PIX copia e cola
          </Button>
        </Column>
      </Card>
      <Card color="warning" theme="light">
        <Column>
          <Title>Atenção</Title>
          <Small>
            Este pedido via PIX só será concluído utilizando o PIX COPIA E COLA. Favor não utilizar
            a chave CNPJ do KIM.
          </Small>
        </Column>
      </Card>
    </>
  );
  const tipoPagamentoEls = new Map<number, () => JSX.Element>();
  tipoPagamentoEls.set(TipoPagamentoEnum.Boleto, cardBoleto);
  tipoPagamentoEls.set(TipoPagamentoEnum.Transferencia, cardTransferencia);
  tipoPagamentoEls.set(TipoPagamentoEnum.Deposito, cardTransferencia);
  tipoPagamentoEls.set(TipoPagamentoEnum.Pix, cardPix);

  const cancelavel = useMemo(
    () =>
      [
        TipoPagamentoEnum.Boleto,
        TipoPagamentoEnum.Transferencia,
        TipoPagamentoEnum.Deposito,
      ].includes(pedido?.CodigoFormaPagamento) && pedido?.CodigoStatusPedido === 1,
    [pedido],
  );

  return (
    <BackMain title="Detalhes do Pedido" loading={pedido == null}>
      {pedido !== null && pedido !== undefined && (
        <Column gap="10px">
          <Row>
            <Column flex="1">
              <Title>{getNomeTipoPagamento(pedido.CodigoFormaPagamento)}</Title>
              <BodySpan>Pedido nº {pedido.CodigoPedido}</BodySpan>
              <BodySpan>Emissão: {pedido.DataHoraPedido}</BodySpan>
            </Column>
            <Row align="center">
              <Card border={true} radius="40px">
                <BodySpan margin="0 10px" color="success" whiteSpace="nowrap">
                  {getNomeStatusPagamento(pedido.CodigoStatusPedido)}
                </BodySpan>
              </Card>
            </Row>
          </Row>
          {tipoPagamentoEls.get(pedido.CodigoFormaPagamento)?.()}
          <Title>Itens do Pedido</Title>
          {pedido.ListaItemPedido?.map(item => (
            <Card key={item.CodigoItemPedido} border={true}>
              <Column justify="center" grow="0">
                <LogoOperadoraDiv>
                  <LogoOperadora src={URL_API_ASSETS + item.LogoOperadora} />
                </LogoOperadoraDiv>
              </Column>
              <Column justify="space-around" flex="1">
                <Subtitle>{item.TipoPedidoDescricao}</Subtitle>
                <BodySpan>{item.NomeProduto}</BodySpan>
              </Column>
              <Column justify="center">
                <Title>{NumberToReais(item.ValorProduto)}</Title>
              </Column>
            </Card>
          ))}
          <Column>
            <Row justify="space-between">
              <Title>Subtotal</Title>
              <Title>{NumberToReais(pedido.ValorPedido)}</Title>
            </Row>
            <Row justify="space-between">
              <BodySpan>Conveniência</BodySpan>
              <BodySpan>{NumberToReais(pedido.ValorTaxa)}</BodySpan>
            </Row>
            <Row justify="space-between">
              <BodySpan>Cupon de Desconto</BodySpan>
              <BodySpan>{NumberToReais(pedido.ValorDesconto)}</BodySpan>
            </Row>
          </Column>
          <Hr />
          <Row justify="space-between">
            <Title color="primary">Total</Title>
            <Title color="primary">{NumberToReais(pedido.ValorTotalPedido)}</Title>
          </Row>
          {cancelavel && (
            <Button onClick={() => setCancelar(true)} color="danger" theme="light">
              Cancelar pedido
            </Button>
          )}
        </Column>
      )}

      {envioComprovante && (
        <SendProof
          numPedido={pedido.CodigoPedido}
          onClose={() => {
            setEnvioComprovante(false);
          }}
        />
      )}
      {cancelar && (
        <CancelOrder
          numPedido={pedido.CodigoPedido}
          onClose={(cancelado: boolean) => {
            setCancelar(false);
            if (cancelado) {
              voltar();
            }
          }}
        />
      )}
    </BackMain>
  );
};

export default OrderDetails;
