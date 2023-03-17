import React, { useState, useMemo } from 'react';
import { PedidoResumido } from '../../dtos/Pedidos';
import Card from '../ui/card';
import Button from '../ui/button';
import { FiChevronRight } from 'react-icons/fi';
import { Title, BodySpan, Small, UnordenedList } from '../ui/typography';
import { getNomeTipoPagamento } from '../../models/pagamentos';
import SendProof from './sendProof';
import CancelOrder from './cancelOrder';
import { NumberToReais } from '../../utils/printHelper';
import EmailApi from '../../services/apis/emailApi';
import { alertService } from '../../hooks/alert';
import { Column, Row } from '../ui/layout';
import { TipoPagamentoEnum } from 'enuns/tipoPagamentoEnum';

interface OrdersResumedProps {
  pedido: PedidoResumido;
  onOpen: (id: number) => void;
  onChange: (id: number) => void;
}

const OrdersResumed: React.FC<OrdersResumedProps> = ({ pedido, onOpen, onChange }) => {
  const [envioComprovante, setEnvioComprovante] = useState<boolean>(false);
  const [cancelar, setCancelar] = useState<boolean>(false);

  const envioEmail = async () => {
    var result = await EmailApi.EnvioBoleto(pedido.CodigoPedido);
    if (result) {
      alertService.success('Envio Email', 'Email Enviado com sucesso!');
    }
  };

  const isEmAberto = pedido.CodigoStatusPedido === 1;
  const exibirComprovante =
    isEmAberto &&
    [TipoPagamentoEnum.Transferencia, TipoPagamentoEnum.Deposito].includes(
      pedido.CodigoFormaPagamento,
    );
  const exibirEnvioEmail = isEmAberto && TipoPagamentoEnum.Boleto === pedido.CodigoFormaPagamento;

  const cancelavel = useMemo(
    () =>
      [
        TipoPagamentoEnum.Boleto,
        TipoPagamentoEnum.Transferencia,
        TipoPagamentoEnum.Deposito,
      ].includes(pedido.CodigoFormaPagamento) && isEmAberto,
    [isEmAberto, pedido.CodigoFormaPagamento],
  );

  return (
    <Card className="border flex-column">
      <Row>
        <Column grow="1">
          <Title color="primary">{NumberToReais(pedido.ValorTotalPedido)}</Title>
          <BodySpan>
            {getNomeTipoPagamento(pedido.CodigoFormaPagamento)} - {pedido.DescricaoStatusPedido}
          </BodySpan>
          <Small>Pedido Nº {pedido.CodigoPedido}</Small>

          <Small>
            <UnordenedList>
              {pedido.ListaItemPedido.map(item => (
                <li key={item.CodigoItemPedido}>{item.NomeProduto ?? item.TipoPedidoDescricao}</li>
              ))}
            </UnordenedList>
          </Small>
        </Column>
        <Column justify="center" grow="0">
          <Button
            theme="light"
            onClick={() => {
              onOpen(pedido.CodigoPedido);
            }}
          >
            <FiChevronRight size="30" />
          </Button>
        </Column>
      </Row>
      <Column gap="8px">
        {exibirComprovante && (
          <Button color="primary" onClick={() => setEnvioComprovante(true)}>
            Anexar Comprovante
          </Button>
        )}
        {exibirEnvioEmail && (
          <Button color="primary" onClick={() => envioEmail()}>
            Enviar Boleto pro E-mail
          </Button>
        )}
        {cancelavel && (
          <Button color="danger" theme="light" onClick={() => setCancelar(true)}>
            Cancelar pedido
          </Button>
        )}
      </Column>
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
              onChange(pedido.CodigoPedido);
            }
          }}
        />
      )}
    </Card>
  );
};

export default OrdersResumed;
