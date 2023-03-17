import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { alertService } from 'hooks/alert';

import Button from 'components/ui/button';
import { ModalAlert } from 'components/ui/modal';
import { BodyP } from 'components/ui/typography';

import { CartaoTransporte } from 'dtos/CartaoTransporte';
import CartaoTransporteApi from 'services/apis/cartaoTransporteApi';
import { useLoad } from 'hooks';
import { Column, Row } from 'components/ui/layout';

interface ModalExcluirProps {
  card: CartaoTransporte;
  onClose: () => void;
}

const ModalExcluir: React.FC<ModalExcluirProps> = ({ card, onClose }) => {
  const history = useHistory();
  const { addLoad, removeLoad } = useLoad();

  const handleRemoveCard = useCallback(async () => {
    addLoad('excluirCartao');
    const excluido = await CartaoTransporteApi.Excluir(card.Codigo);
    removeLoad('excluirCartao');
    if (excluido) {
      const msg = 'Seu cartão foi excluído com sucesso';
      alertService.success('Cartão excluído', msg);
      history.go(0);
    }
  }, [history, card, addLoad, removeLoad]);

  return (
    <ModalAlert isOpen={true} onClose={onClose} title="Confirmar exclusão">
      <Column gap="12px">
        <BodyP>Tem certeza que deseja excluir este cartão?</BodyP>
        <Row gap="12px">
          <Button color="secondary" onClick={() => onClose()}>
            Não
          </Button>
          <Button className="warning-colors" onClick={handleRemoveCard}>
            Sim
          </Button>
        </Row>
      </Column>
    </ModalAlert>
  );
};

export default ModalExcluir;
