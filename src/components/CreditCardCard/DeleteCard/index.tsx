import React, { useCallback, useContext } from 'react';

import api from '../../../services/api';

import { useAuth } from '../../../hooks/auth';
import { useAlert } from '../../../hooks/alert';

import { CreditCardPageContext } from '../../../pages/CreditCard';
import { CreditCardData } from '../../../hooks/creditCard';

import Button from '../../ui/button';
import { Card, CardLabel, CardOptions } from './styles';

interface DeleteCardProps {
  creditCardData: CreditCardData;
  onClose: () => void;
}

const DeleteCard: React.FC<DeleteCardProps> = ({
  creditCardData,
  onClose: handleClose,
}) => {
  const { user } = useAuth();
  const { addAlert } = useAlert();
  const { reload, setLoading } = useContext(CreditCardPageContext);

  const handleDelete = useCallback(async () => {
    setLoading(true);
    api
      .post(
        `KimMais.Api.ExcluirCartaoCredito/${user.TokenUsuario}/${user.CodigoUsuario}`,
        {
          CodigoUsuarioCartaoCredito: creditCardData.CodigoUsuarioCartaoCredito,
        },
      )
      .then(responseECC => {
        setLoading(false);
        if (responseECC.data.Status === 0) {
          reload();
          addAlert({
            title: 'Sucesso',
            description: 'Cartão excluído com sucesso',
            type: 'success',
          });
        } else {
          addAlert({
            title: 'Erro',
            description: 'Erro ao excluir cartão de crédito, tente mais tarde',
            type: 'error',
          });
        }
      })
      .catch(() => {
        setLoading(false);
        addAlert({
          title: 'Erro',
          description: 'Erro ao excluir cartão de crédito, tente mais tarde',
          type: 'error',
        });
      });
  }, [creditCardData, user, addAlert, reload, setLoading]);

  return (
    <Card>
      <CardLabel>Realmente deseja excluir esse cartão?</CardLabel>
      <CardOptions>
        <Button color="secondary" onClick={handleClose}>
          Não
        </Button>
        <Button color="warning" onClick={handleDelete}>
          Sim
        </Button>
      </CardOptions>
    </Card>
  );
};

export default DeleteCard;
