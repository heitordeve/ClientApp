import React, { useState, useCallback, useEffect } from 'react';

import { useAuth } from 'hooks/auth';
import { alertService, useAlert } from 'hooks/alert';
import { useShoppingBag } from 'hooks/shoppingBag';
import { CartaoTransporte } from 'dtos/CartaoTransporte';
import { NumberToReais } from 'utils/printHelper';
import toBase64 from 'utils/toBase64';
import ImageUploader from 'components/ui/imageUploader';
import Button from 'components/ui/button';

import { TipoPedidoEnum } from 'enuns/tipoPedidoEnum';
import { RevalidacaoCartaoEstudanteApi } from 'services/apis';
import Modal from 'components/ui/modal';
import { Column, Row } from 'components/ui/layout';
import { AlertCard } from 'components/ui/card';

interface MPERevalidationProps {
  requestOpenProvider(requestOpen: (card: CartaoTransporte) => void): void;
  setLoading(loading: boolean): void;
}

const MPERevalidation: React.FC<MPERevalidationProps> = ({ requestOpenProvider, setLoading }) => {
  const { user } = useAuth();
  const { addAlert } = useAlert();
  const { addShoppingBag, getShoppingBag } = useShoppingBag();

  const [img, setImg] = useState<string>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [card, setCard] = useState<CartaoTransporte>();

  const toggleModal = useCallback(() => {
    setIsOpen(prev => {
      return !prev;
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      setImg(null);
    }
  }, [isOpen]);

  useEffect(() => {
    requestOpenProvider(async cardParam => {
      if (
        !getShoppingBag().some(
          e =>
            e.TipoPedido === TipoPedidoEnum.RevalidacaoMPE &&
            e.CodigoUsuarioCartao === cardParam.Codigo,
        )
      ) {
        setLoading(true);
        var result = await RevalidacaoCartaoEstudanteApi.Consulta(cardParam.Codigo);
        setLoading(false);
        if (result) {
          if (result.HasAtualizacaoFoto) {
            const msg =
              'Para efetuar a revalidação será necessário enviar uma self, para isso entre no aplicativo em "Recarga de Transporte" selecione esse cartão e clique em "Revalidação MPE"';
            alertService.info('Revalidação MPE', msg);
          } else if (result.Situacao !== 'S') {
            const msg = 'Cartão não está apto para revalidar MPE. ' + result.Mensagem;
            alertService.info('Revalidação MPE', msg);
          } else {
            setCard(cardParam);
            setIsOpen(true);
          }
        }
      } else {
        const msg = 'Validação já adicionada no carrinho, efetue o pagamento';
        alertService.info('Revalidação MPE', msg);
      }
    });
  }, [user, addAlert, setLoading, toggleModal, requestOpenProvider, getShoppingBag]);

  const handleChange = useCallback(
    (img: File, callback: (rejectImage?: boolean) => void) => {
      if (card) {
        toBase64(img)
          .then(response => {
            setImg(response.toString());
            callback(false);
          })
          .catch(() => {
            callback(true);
            addAlert({
              title: 'Erro',
              description: 'Erro ao converter imagem, tente enviar outo arquivo',
              type: 'error',
            });
          });
      }
    },
    [card, addAlert],
  );

  const handleSubmit = useCallback(() => {
    if (!img) {
      addAlert({
        title: 'Alerta',
        description: 'Foto do comprovante obrigatória!',
        type: 'error',
      });
      return;
    }
    addShoppingBag({
      Nome: `Revalidação MPE no cartão de transporte "${card.Nome}"`,
      Detalhes: `Revalidação de ${NumberToReais(card.ValorRevalidacaoOperadora)} na operadora ${
        card.NomeOperadora
      }`,
      CodigoUsuarioCartao: card.Codigo,
      CodigoUsuario: user.CodigoUsuario,
      ValorRecarga: card.ValorRevalidacaoOperadora,
      TipoPedido: TipoPedidoEnum.RevalidacaoMPE,
      CodigoTipoCartao: card.CodigoTipoCartao,
      NumeroCartao: card.Numero,
      ValorSaldo: card.Saldo,
      CodigoOperadora: card.CodigoOperadora,
      CodigoAssinante: '',
      GedRevalidacao: {
        CodigoOperadora: card.CodigoOperadora,
        Documento64: img?.replace(/^data:image\/[a-z]+;base64,/, ''),
        NumeroCartao: card.Numero,
      },
    });
    addAlert({
      title: 'Sucesso',
      description: 'Revalidação MPE adicionada no carrinho com sucesso!',
      type: 'success',
    });
    setIsOpen(false);
  }, [user, card, img, addAlert, addShoppingBag]);

  return (
    <>
      {card && (
        <Modal isOpen={isOpen} onClose={toggleModal} minWidth="400px" title="Revalidação MPE">
          <Column gap="12px" flex="1">
            <Column gap="12px" flex="1">
              <h2>Comprovante de matrícula</h2>
              <p>
                Nos envie a foto do seu comprovante de matricula de {new Date().getFullYear()}.
                (OBS: a foto deverá estar nítida para ser aprovada).
              </p>
              <ImageUploader onChange={handleChange} name="FotoComprovante" />
              <AlertCard titulo="Atenção">
                O valor da convêniência da Revalidação da operadora {card.NomeOperadora} é de{' '}
                {NumberToReais(card.ValorRevalidacaoOperadora)}
              </AlertCard>
            </Column>
            <Row gap="12px">
              <Button flex="1" color="secondary" theme="light" onClick={toggleModal}>
                Cancelar
              </Button>
              <Button flex="1" onClick={handleSubmit}>
                Adicionar ao carrinho
              </Button>
            </Row>
          </Column>
        </Modal>
      )}
    </>
  );
};

export default MPERevalidation;
