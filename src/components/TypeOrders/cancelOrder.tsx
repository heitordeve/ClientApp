import React from 'react';
import { Column, Row } from 'components/ui/layout';
import { Small } from 'components/ui/typography';
import Button from 'components/ui/button';
import { ModalAlert } from 'components/ui/modal';
import { PedidoApi } from 'services/apis';
import { alertService } from 'hooks/alert';

interface CancelOrderProps {
  numPedido: number;
  onClose: (cancelado: boolean) => void;
}

const CancelOrder: React.FC<CancelOrderProps> = ({ numPedido, onClose }) => {
  const cancelar = async () => {
    var cancelado = await PedidoApi.Cancelar(numPedido);
    if (cancelado) {
      alertService.success('Sucesso', 'Pedido cancelado!');
      onClose(true);
    }
  };
  return (
    <ModalAlert title="Confirmar cancelamento" onClose={() => onClose(false)} minWidth="450px">
      <Column justify="center" gap="12px">
        <Small justify="center">Tem certeza que deseja cancelar o pedido?</Small>
        <Row gap="12px">
          <Button theme="light" onClick={() => onClose(false)}>
            Não
          </Button>
          <Button color="danger" onClick={() => cancelar()}>
            Sim
          </Button>
        </Row>
      </Column>
    </ModalAlert>
  );
};

export default CancelOrder;
