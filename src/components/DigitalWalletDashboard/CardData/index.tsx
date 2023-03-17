import React, { useCallback, useEffect, useState } from 'react';

import api from '../../../services/api';
import { useAuth } from '../../../hooks/auth';
import { useAlert } from '../../../hooks/alert';
import Button from '../../ui/button';
import Loading from '../../ui/loading';

import Modal from 'react-modal';

import { IoMdClose } from 'react-icons/io';

import { FiAlertTriangle } from 'react-icons/fi';

import { CardHr, CreditCard, LeftCard, TitleCard } from './styles';
import { CodCanalVenda } from '../../../services/consts';
import { Column } from 'components/ui/layout';

interface WalletData {
  saldoDisponivelGlobal: number;
  valorRenda: number;
  nome: string;
}

interface VirtualCardData {
  numeroCartao: string;
  dataValidade: Date;
  cvv2: string;
  nomePlastico: string;
  idStatusCartao: number;
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
        background: '#FFFFFF',
        color: '#6B6576',
        borderRadius: '15px',
        overflow: 'auto',
      }
    : {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '480px',
        maxHeight: '532px',
        background: '#FFFFFF',
        color: '#6B6576',
        borderRadius: '15px',
        overflow: 'auto',
      },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

const CardData: React.FC = () => {
  const { user } = useAuth();
  const { addAlert } = useAlert();
  const [wallet, setWallet] = useState<WalletData>();
  const [virtualCard, setVirtualCard] = useState<VirtualCardData>();
  const [loading, setLoading] = useState(false);
  const [isOpenBlock, setIsOpenBlock] = useState(false);
  const [isOpenCancel, setIsOpenCancel] = useState(false);
  const [isOpenCreate, setIsOpenCreate] = useState(false);

  useEffect(() => {
    let cod = user.CodigoConta;
    if (typeof cod === 'number') {
      api
        .get(
          `/KimMais.Api.BuscarSaldoConta/${user.TokenUsuario}/${user.CodigoUsuario}?saldoConta=${cod}`,
        )
        .then(responseBS => {
          if (responseBS.data.Status === 0) {
            if (
              Array.isArray(responseBS.data.ListaObjeto) &&
              responseBS.data.ListaObjeto.length > 0
            ) {
              setWallet(responseBS.data.ListaObjeto[0]);
            }
          } else {
            addAlert({
              title: 'Erro',
              description: 'Erro ao buscar saldo da conta.' + responseBS.data.Mensagem,
              type: 'error',
            });
          }
        })
        .catch(() => {
          addAlert({
            title: 'Erro',
            description: 'Erro ao buscar saldo da conta, tente novamente mais tarde',
            type: 'error',
          });
        });
    } else {
      addAlert({
        title: 'Erro',
        description: 'Nenhuma carteira encontrada!',
        type: 'error',
      });
    }
  }, [user, addAlert]);

  useEffect(() => {
    api
      .get(
        `/KimMais.API.Generica/${user.TokenUsuario}/${user.CodigoUsuario}/Banco%2FConsultarCartaoVirtual`,
      )
      .then(response => {
        setVirtualCard(response.data.ListaObjeto[0]);
      })
      .catch(() => {
        addAlert({
          title: 'Erro',
          description: 'Erro ao buscar dados da conta, tente novamente mais tarde',
          type: 'error',
        });
      });
  }, [user, addAlert]);

  const handleBlockCard = useCallback(async () => {
    setLoading(true);
    if (virtualCard.idStatusCartao === 1) {
      await api
        .post(
          `/KimMais.Api.BloquearCartaoVirtual/api/BloquearCartaoVirtual?accsToken=${user.TokenUsuario}&usercode=${user.CodigoUsuario}`,
          { observacao: 'Bloqueio%20de%20cart%C3%A3o%20virtual' },
        )
        .then(response => {
          setLoading(false);
          addAlert({
            type: 'info',
            title: 'Cartão Virtual',
            description: response.data.Mensagem,
          });
          window.scrollTo(0, 0);
          window.location.reload();
        });
    } else {
      await api
        .post(
          `/KimMais.Api.DesbloquearCartaoVirtual/api/DesbloquearCartaoVirtual?accsToken=${user.TokenUsuario}&usercode=${user.CodigoUsuario}`,
          {},
        )
        .then(response => {
          setLoading(false);
          addAlert({
            type: 'info',
            title: 'Cartão Virtual',
            description: response.data.Mensagem,
          });
          window.scrollTo(0, 0);
          window.location.reload();
        });
    }
  }, [user, virtualCard, addAlert]);

  const handleCancelCard = useCallback(async () => {
    setLoading(true);
    await api
      .post(
        `/KimMais.Api.CancelarCartaoVirtual/api/CancelarCartaoVirtual?accsToken=${user.TokenUsuario}&usercode=${user.CodigoUsuario}`,
        { observacao: 'Cancelamento%20de%20cart%C3%A3o%20virtual' },
      )
      .then(response => {
        setLoading(false);
        addAlert({
          type: 'success',
          title: 'Cartão Cancelado!',
        });
        window.scrollTo(0, 0);
        window.location.reload();
      });
  }, [user, addAlert]);

  const handleCreateCard = useCallback(async () => {
    setLoading(true);
    await api
      .post(
        `/KimMais.Api.SolicitarCartaoVirtual/api/SolicitarCartaoVirtual?accsToken=${user.TokenUsuario}&usercode=${user.CodigoUsuario}`,
        { CodigoCartaoVirtual: user.CodigoUsuario },
      )
      .then(response => {
        setLoading(false);
        addAlert({
          type: 'success',
          title: 'Cartão Criado!',
        });
        window.scrollTo(0, 0);
        window.location.reload();
      });
  }, [user, addAlert]);

  return (
    <>
      <Loading loading={loading} />
      <LeftCard>
        <div className="titleCard">
          <b>Minha carteira digital</b>
        </div>
        <div>
          <div className="textSaldo">
            <h6 className="textSaldo">Saldo:</h6>
            <b>
              {wallet &&
                new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(wallet.saldoDisponivelGlobal)}
            </b>
          </div>

          {/* <div className="d-flex justify-content-center align-items-center mt-3">
            <TitleCard className="text-center">
              <h6>Renda</h6>
              <p>{wallet && new Intl.NumberFormat(
                'pt-BR',
                { style: 'currency', currency: 'BRL' },
              ).format(wallet.valorRenda)}</p>
            </TitleCard>
          </div> */}

          <CardHr />
          <h4>Meu cartão virtual</h4>

          <CreditCard>
            <b className="nameCard">{virtualCard && virtualCard.nomePlastico}</b>
            <b className="numberCard">
              {virtualCard && (
                <>
                  {virtualCard.numeroCartao.substring(0, 4)}{' '}
                  {virtualCard.numeroCartao.substring(4, 8)}{' '}
                  {virtualCard.numeroCartao.substring(8, 12)}{' '}
                  {virtualCard.numeroCartao.substring(12, 16)}
                </>
              )}
            </b>
            <div className={virtualCard ? 'd-flex justify-content-between w-100 mt-4' : 'd-none'}>
              <div className="secondCard">
                <b>Data de Vencimento</b>
                <b>
                  {virtualCard &&
                    `${new Date(virtualCard.dataValidade).getMonth() + 1} / ${new Date(
                      virtualCard.dataValidade,
                    ).getFullYear()}`}{' '}
                </b>
              </div>
              <div className="secondCard">
                <b>CVV</b>
                <b>{virtualCard && virtualCard.cvv2}</b>
              </div>
            </div>
          </CreditCard>

          <div className="buttonsCard">
            {virtualCard ? (
              <Column gap="12px">
                <Button onClick={() => setIsOpenBlock(true)}>
                  {virtualCard && virtualCard.idStatusCartao === 1
                    ? 'Bloquear Cartão Virtual'
                    : 'Desbloquear Cartão Virtual'}
                </Button>
                <Button color="danger" theme="light" onClick={() => setIsOpenCancel(true)}>
                  Cancelar Cartão
                </Button>
              </Column>
            ) : (
              <>
                <TitleCard className="text-center">
                  <h6>
                    Você não possui cartão virtual, clique em "Gerar Cartão" para solicitar um novo
                    cartão virtual!
                  </h6>
                </TitleCard>
                <Button onClick={() => setIsOpenCreate(true)}>Gerar Cartão</Button>
              </>
            )}
          </div>
        </div>
      </LeftCard>

      <Modal
        style={customStyles}
        isOpen={isOpenBlock}
        onRequestClose={() => setIsOpenBlock(false)}
        contentLabel="Alert Modal"
      >
        <Loading loading={loading} />
        <IoMdClose
          onClick={() => setIsOpenBlock(false)}
          size={20}
          style={{
            color: '#672ed7',
            top: '5px',
            display: 'block',
            float: 'right',
            position: 'fixed',
            right: '5px',
            cursor: 'pointer',
          }}
        />

        <div className="d-flex justify-content-center align-items-center flex-wrap flex-column pr-2 pl-2 pt-4 pb-4">
          <h3
            style={{ fontSize: '20px', color: '#000' }}
            className="font-weight-bold text-center mb-4 pl-4 pr-4"
          >
            Confirmar {virtualCard && virtualCard.idStatusCartao === 1 ? 'bloqueio' : 'desbloqueio'}
          </h3>
          <FiAlertTriangle size={130} style={{ maxWidth: '150px' }} className="" />
          <p style={{ fontSize: '14px' }} className="text-center mt-4">
            Tem certeza que deseja{' '}
            {virtualCard && virtualCard.idStatusCartao === 1 ? 'bloquear' : 'desbloquear'} seu
            cartão virtual?
          </p>

          <div className="d-flex flex-row" style={{ width: '60%' }}>
            <Button
              color="secondary"
              onClick={() => setIsOpenBlock(false)}
              style={{ marginRight: '2.5px' }}
            >
              Não
            </Button>
            <Button
              onClick={() => {
                handleBlockCard();
                setIsOpenBlock(false);
              }}
              style={{ marginLeft: '2.5px' }}
            >
              Sim
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        style={customStyles}
        isOpen={isOpenCancel}
        onRequestClose={() => setIsOpenCancel(false)}
        contentLabel="Alert Modal"
      >
        <Loading loading={loading} />
        <IoMdClose
          onClick={() => setIsOpenCancel(false)}
          size={20}
          style={{
            color: '#672ed7',
            top: '5px',
            display: 'block',
            float: 'right',
            position: 'fixed',
            right: '5px',
            cursor: 'pointer',
          }}
        />

        <div className="d-flex justify-content-center align-items-center flex-wrap flex-column pr-2 pl-2 pt-4 pb-4">
          <h3
            style={{ fontSize: '20px', color: '#000' }}
            className="font-weight-bold text-center mb-4 pl-4 pr-4"
          >
            Confirmar cancelamento
          </h3>
          <FiAlertTriangle size={130} style={{ maxWidth: '150px' }} className="" />
          <p style={{ fontSize: '14px' }} className="text-center mt-4">
            Tem certeza que deseja cancelar seu cartão virtual?
          </p>

          <div className="d-flex flex-row" style={{ width: '60%' }}>
            <Button
              color="secondary"
              onClick={() => setIsOpenCancel(false)}
              style={{ marginRight: '2.5px' }}
            >
              Não
            </Button>
            <Button
              onClick={() => {
                handleCancelCard();
                setIsOpenCancel(false);
              }}
              style={{ marginLeft: '2.5px' }}
            >
              Sim
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        style={customStyles}
        isOpen={isOpenCreate}
        onRequestClose={() => setIsOpenCreate(false)}
        contentLabel="Alert Modal"
      >
        <Loading loading={loading} />
        <IoMdClose
          onClick={() => setIsOpenCreate(false)}
          size={20}
          style={{
            color: '#672ed7',
            top: '5px',
            display: 'block',
            float: 'right',
            position: 'fixed',
            right: '5px',
            cursor: 'pointer',
          }}
        />

        <div className="d-flex justify-content-center align-items-center flex-wrap flex-column pr-2 pl-2 pt-4 pb-4">
          <h3
            style={{ fontSize: '20px', color: '#000' }}
            className="font-weight-bold text-center mb-4 pl-4 pr-4"
          >
            Confirmar solicitação
          </h3>
          <FiAlertTriangle size={130} style={{ maxWidth: '150px' }} className="" />
          <p style={{ fontSize: '14px' }} className="text-center mt-4">
            Tem certeza que deseja solicitar um novo cartão virtual?
          </p>

          <div className="d-flex flex-row" style={{ width: '60%' }}>
            <Button
              color="secondary"
              onClick={() => setIsOpenCreate(false)}
              style={{ marginRight: '2.5px' }}
            >
              Não
            </Button>
            <Button
              onClick={() => {
                handleCreateCard();
                setIsOpenCreate(false);
              }}
              style={{ marginLeft: '2.5px' }}
            >
              Sim
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CardData;
