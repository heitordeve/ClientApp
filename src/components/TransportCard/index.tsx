import React, { useCallback, useState, useRef } from 'react';

import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import Modal from 'react-modal';

import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { BsThreeDotsVertical, BsPencil, BsLock, BsTrash } from 'react-icons/bs';
import { FaGraduationCap } from 'react-icons/fa';
import { FiCalendar } from 'react-icons/fi';
import { Dropdown, DropdownToggle, DropdownItem } from 'reactstrap';

import { alertService, useAlert } from '../../hooks/alert';
import getValidationErrors from '../../utils/getValidationErrors';

import Loading from '../ui/loading';
import Input from '../ui/input';
import Button from '../ui/button';
import Card from './Card';
import EditCard from './EditCard';
import EmptyCard from './EmptyCard';

import { TextValues } from './Card/styles';
import { CardLabel, CardOptions } from '../DigitalWalletDashboard/styles';
import { CardItem, ButtonDropDown, TransportRechargeDropdown } from './styles';
import DropdownItemLink from '../DropdownItemLink';
import { CartaoTransporte } from '../../dtos/CartaoTransporte';
import CartaoTransporteApi from '../../services/apis/cartaoTransporteApi';
import { useCartaoTransporte } from '../transporte/hooks/cartaoTransporteHook';
import { Column } from 'components/ui/layout';
import { PATHS } from 'routes/rotas-path';

Modal.setAppElement('#root');

interface TrasnportCardProps {
  card: CartaoTransporte;
}

interface PasswordFormData {
  password: string;
}

const isSmallWidth = window.matchMedia('(max-width: 1000px)').matches;

const customStyles = {
  content: isSmallWidth
    ? {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '90vmin',
        borderRadius: '15px',
        overflow: 'visible',
        paddingLeft: '40px',
        paddingRight: '40px',
      }
    : {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        height: '350px',
        borderRadius: '15px',
        overflow: 'visible',
        paddingLeft: '90px',
        paddingRight: '90px',
      },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

const CloseAccountModalStyle: Modal.Styles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: isSmallWidth
    ? {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        width: '90vmin',
        textAlign: 'center',
      }
    : {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        maxWidth: '350px',
        textAlign: 'center',
      },
};

const TransportCard: React.FC<TrasnportCardProps> = ({ card }) => {
  const { addAlert } = useAlert();

  const history = useHistory();
  const formRef = useRef<FormHandles>(null);
  const trContext = useCartaoTransporte();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenBlock, setIsOpenBlock] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCloseAccountModalOpen, setIsCloseAccountModalOpen] = useState<boolean>(false);

  const toggleDropdown = useCallback(() => {
    setDropdownOpen(prev => !prev);
  }, []);

  const toggleCloseAccountModal = useCallback(() => {
    setIsCloseAccountModalOpen(prev => !prev);
  }, []);

  const renderCards = useCallback(() => {
    return card && card.Numero ? <Card card={card} /> : <EmptyCard />;
  }, [card]);

  const handleChangeFavorite = useCallback(
    async (CodigoUsuarioCartao: number) => {
      setLoading(true);
      const favoritado = await CartaoTransporteApi.Favoritar(CodigoUsuarioCartao);
      if (favoritado) {
        history.go(0);
      }
      setLoading(false);
    },
    [history],
  );

  const handleRemoveCard = useCallback(async () => {
    setLoading(true);
    const excluido = await CartaoTransporteApi.Excluir(card.Codigo);
    if (excluido) {
      const msg = 'Seu cartão foi excluído com sucesso';
      alertService.success('Cartão excluído', msg);
      history.go(0);
    }
  }, [history, card]);

  const handleRevalidarMPE = useCallback(() => {
    trContext.requestOpenMPE(card);
  }, [card, trContext]);

  const handleSubmitBlock = useCallback(
    async (data: PasswordFormData) => {
      formRef.current?.setErrors({});
      Yup.object()
        .shape({
          password: Yup.string().required('Senha obrigatória'),
        })
        .validate(data, {
          abortEarly: false,
        })
        .then(async value => {
          setLoading(true);
          const bloquaeio = await CartaoTransporteApi.Bloquear({
            CodigoUsuarioCartao: card.Codigo,
            Senha: value.password,
          });
          if (bloquaeio) {
            alertService.info('Bloqueio de cartão', bloquaeio);
            window.scrollTo(0, 0);
            setIsOpenBlock(false);
            history.go(0);
          } else {
            window.scrollTo(0, 0);
          }
        })
        .catch(error => {
          if (error instanceof Yup.ValidationError) {
            formRef.current?.setErrors(getValidationErrors(error));
            setTimeout(() => {
              formRef.current?.setErrors({});
            }, 3000);
          } else {
            addAlert({
              type: 'error',
              title: 'Erro',
              description: 'Erro ao buscar dados de Bloqueio Cartão, tente mais tarde',
            });
          }
        });
    },
    [card, history, addAlert],
  );

  return (
    <CardItem>
      {card && card.Numero && (
        <Dropdown
          direction={isSmallWidth ? 'left' : 'right'}
          className="treePoints"
          isOpen={dropdownOpen}
          toggle={toggleDropdown}
        >
          <DropdownToggle>
            <BsThreeDotsVertical size={25} />
          </DropdownToggle>
          <TransportRechargeDropdown>
            <DropdownItemLink
              to={{
                pathname: `${PATHS.transporte.agendamento}/${card.Codigo}`,
                state: card,
              }}
            >
              <FiCalendar /> Agendar recarga
            </DropdownItemLink>
            <DropdownItem>
              <ButtonDropDown onClick={() => setIsOpen(true)}>
                <BsPencil /> Editar
              </ButtonDropDown>
            </DropdownItem>
            {card?.HasRevalidacaoCartao && (
              <DropdownItem>
                <ButtonDropDown onClick={handleRevalidarMPE}>
                  <FaGraduationCap /> Revalidar MPE
                </ButtonDropDown>
              </DropdownItem>
            )}
            <DropdownItem>
              <ButtonDropDown onClick={() => setIsOpenBlock(true)}>
                <BsLock /> Bloquear
              </ButtonDropDown>
            </DropdownItem>
            <DropdownItem>
              <ButtonDropDown
                onClick={() => {
                  card && handleChangeFavorite(card.Codigo);
                }}
              >
                {card.IsFavorito ? (
                  <>
                    <AiFillStar /> Desfavoritar
                  </>
                ) : (
                  <>
                    <AiOutlineStar /> Favorito
                  </>
                )}
              </ButtonDropDown>
            </DropdownItem>
            <DropdownItem>
              <ButtonDropDown onClick={toggleCloseAccountModal}>
                <BsTrash /> Excluir
              </ButtonDropDown>
            </DropdownItem>
          </TransportRechargeDropdown>
        </Dropdown>
      )}
      <Modal style={CloseAccountModalStyle} isOpen={isCloseAccountModalOpen}>
        <Loading loading={loading} />
        <CardLabel className="mb-4">Confirmar exclusão</CardLabel>
        <TextValues className="font-weight-bold">
          Tem certeza que deseja excluir este cartão?
        </TextValues>
        <CardOptions>
          <Button color="secondary" onClick={toggleCloseAccountModal}>
            Não
          </Button>
          <Button className="warning-colors" onClick={handleRemoveCard}>
            Sim
          </Button>
        </CardOptions>
      </Modal>
      <Modal
        style={customStyles}
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        contentLabel=""
      >
        <div className="centralizado" style={{ width: '100%' }}>
          <EditCard codeUserNumber={card && card.Codigo} />
          <Button
            color="secondary"
            style={{
              height: '50px',
            }}
            onClick={() => setIsOpen(false)}
          >
            Cancelar
          </Button>
        </div>
      </Modal>
      <Modal
        style={customStyles}
        isOpen={isOpenBlock}
        onRequestClose={() => setIsOpenBlock(false)}
        contentLabel=""
      >
        <Form onSubmit={handleSubmitBlock} ref={formRef} style={{ marginTop: '30px' }}>
          <Column justify="center" gap="12px">
            <h3 className="text-center">Bloquear Cartão</h3>
            <Input name="password" props={{ placeholder: 'Senha usuário', type: 'password' }} />
            <Button type="submit">Bloquear</Button>
            <Button theme="light" onClick={() => setIsOpenBlock(false)}>
              Cancelar
            </Button>
          </Column>
        </Form>
      </Modal>
      {renderCards()}
      <Loading loading={loading} />
    </CardItem>
  );
};

export default TransportCard;
