import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Logo } from './styles';
import ModalRecarga from './modalRecarga';
import ModalEditar from './modalEditar';
import ModalBloquear from './modalBloquear';
import ModalExcluir from './modalExcluir';

import Button from 'components/ui/button';
import DropMenu from 'components/ui/drop-menu';
import Card from 'components/ui/card';
import { Column, Row } from 'components/ui/layout';
import { P, Caption, Subhead } from 'components/ui/typography/v2';
import {
  IcCalendario,
  IcEditar,
  IcRevalidar,
  IcLock,
  IcFavorite,
  IcFavorited,
  IcExcluir,
  IcMoedaLine,
  IcBlock,
} from 'components/ui/icons';

import { CartaoTransporte, SaldoCartao } from 'dtos/CartaoTransporte';
import { useCartaoTransporte } from 'components/transporte/hooks/cartaoTransporteHook';
import { useLoad } from 'hooks';
import { CartaoTransporteApi } from 'services/apis';
import { BaseIconType } from 'components/ui/icons/baseIcon';
import HideText from 'components/ui/hide-content/hide-text';
import Tooltip from 'components/ui/tooltip';
import { PATHS } from 'routes/rotas-path';

type Actions = 'recarga' | 'block' | 'segundaVia';
interface BtnAction {
  text: string;
  icon?: BaseIconType;
  onClick: () => void;
}

interface CartaoTransporteProps {
  card: CartaoTransporte;
  action?: Actions;
  onActionClick?: (card: CartaoTransporte) => void;
  menu?: boolean;
}

const CartaoDeTransporte: React.FC<CartaoTransporteProps> = ({
  card,
  onActionClick,
  action = 'recarga',
  menu = true,
}) => {
  const { requestOpenMPE } = useCartaoTransporte();
  const { addLoad, removeLoad } = useLoad();
  const history = useHistory();

  const [btnAction, setBtnAction] = useState<BtnAction>(null);

  const [isOpenRecarga, setIsOpenRecarga] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenBlock, setIsOpenBlock] = useState(false);
  const [isOpenExcluir, setIsOpenExcluir] = useState(false);
  const [saldo, setSaldo] = useState<SaldoCartao>();

  const handleChangeFavorite = useCallback(
    async (CodigoUsuarioCartao: number) => {
      addLoad('FavoritarCartao');
      const favoritado = await CartaoTransporteApi.Favoritar(CodigoUsuarioCartao);
      if (favoritado) {
        history.go(0);
      }
      removeLoad('FavoritarCartao');
    },
    [history, addLoad, removeLoad],
  );

  const ataulizarSaldo = useCallback(async () => {
    const saldoTmp = await CartaoTransporteApi.ObterSaldo(
      card.CodigoOperadora,
      card.Codigo,
      card.Numero,
    );
    if (saldoTmp) {
      setSaldo(saldoTmp);
    }
    return !!saldo;
  }, [saldo, setSaldo, card.CodigoOperadora, card.Codigo, card.Numero]);

  useEffect(() => {
    if (action === 'block') {
      setBtnAction({ text: 'Bloquear', icon: IcBlock, onClick: () => setIsOpenBlock(true) });
    } else if (action === 'segundaVia') {
      setBtnAction({ text: 'Solicitar 2ª via', onClick: () => onActionClick(card) });
    } else {
      setBtnAction({
        text: 'Recarregar',
        icon: IcMoedaLine,
        onClick: () => setIsOpenRecarga(true),
      });
    }
  }, [action, onActionClick, card]);

  return (
    <Card
      align="center"
      flex="none"
      maxWidth="410px"
      height="262px"
      width="100%"
      className="shadow-1"
      border="gray-1"
    >
      <Column flex="1" height="100%" justify="space-between">
        <Row gap="12px">
          <div>
            <Logo src={card.urlLogoOperadora} alt={card.urlLogoOperadora} />
          </div>
          <Column flex="1">
            <Subhead color="primary">{card.Nome}</Subhead>
            <P>{card.Numero}</P>
          </Column>
          {menu && (
            <DropMenu
              itens={[
                {
                  text: 'Agendar recarga',
                  to: {
                    pathname: `${PATHS.transporte.agendamento}/${card.Codigo}`,
                    state: card,
                  },
                  icon: IcCalendario,
                  show: card.HasRecargaAutomatica || card.HasRecargaProgramada,
                },

                { text: 'Editar', icon: IcEditar, onClick: () => setIsOpenEdit(true) },
                {
                  text: 'Revalidar MPE',
                  icon: IcRevalidar,
                  show: card?.HasRevalidacaoCartao,
                  onClick: () => requestOpenMPE(card),
                },
                { text: 'Bloquear', icon: IcLock, onClick: () => setIsOpenBlock(true) },
                {
                  text: 'Desfavoritar',
                  icon: IcFavorite,
                  onClick: () => handleChangeFavorite(card.Codigo),
                  show: card.IsFavorito,
                },
                {
                  text: 'Favoritar',
                  icon: IcFavorited,
                  onClick: () => handleChangeFavorite(card.Codigo),
                  show: !card.IsFavorito,
                },
                {
                  text: 'Excluir',
                  icon: IcExcluir,
                  onClick: () => setIsOpenExcluir(true),
                },
              ]}
            />
          )}
        </Row>
        <Row justify="space-between">
          <Tooltip
            color="primary"
            title={
              saldo && (
                <Column>
                  <P>Saldo no ônibus: {saldo?.SaldoPendente?.toMoneyString()}</P>
                  {saldo?.Mensagem && <Caption color="primary">saldo?.Mensagem</Caption>}
                </Column>
              )
            }
          >
            <Column>
              <P>Saldo estimado</P>

              <HideText
                mask="R$ 00,00"
                text={saldo?.Saldo?.toMoneyString()}
                defalutHiden={false}
                onShow={ataulizarSaldo}
                iconColor="primary"
                typograph="Span"
              />
            </Column>
          </Tooltip>
          <Column>
            <P>Último uso</P>
            <P>{card.DataUltimoUso?.format('dd/MM/yyyy HH:mm')}</P>
          </Column>
        </Row>

        <Button className="btnRecharge font-weight-bold" onClick={btnAction?.onClick}>
          {btnAction?.icon && <btnAction.icon size={25} />} {btnAction?.text}
        </Button>
      </Column>
      {isOpenRecarga && <ModalRecarga card={card} onClose={() => setIsOpenRecarga(false)} />}
      {isOpenEdit && <ModalEditar card={card} onClose={() => setIsOpenEdit(false)} />}
      {isOpenBlock && (
        <ModalBloquear
          card={card}
          onClose={() => {
            setIsOpenBlock(false);
            if (action === 'block') {
              onActionClick(card);
            }
          }}
        />
      )}
      {isOpenExcluir && <ModalExcluir card={card} onClose={() => setIsOpenExcluir(false)} />}
    </Card>
  );
};

export default CartaoDeTransporte;
