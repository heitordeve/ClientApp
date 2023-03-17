import React, { useState, useEffect, useCallback, useRef } from 'react';

import { useNotification, useLoad, useAuth } from 'hooks';
import { NotificacaoApi } from 'services/apis';
import { Card, CardBody, CardFooter, CardHeader } from 'reactstrap';

import Button from '../button';
import { RiNewspaperLine } from 'react-icons/ri';
import { AiFillCloseCircle } from 'react-icons/ai';

import {
  Container,
  Contents,
  NotificationCardHolder,
  NotificationCardHeader,
  NotificationCounterHolder,
  TextUndefined,
} from './styles';

import { Notificacao } from 'dtos/notificacao';

interface NotificationCounterProps {
  notificationCount: number;
}

const NotificationCounter: React.FC<NotificationCounterProps> = ({ notificationCount }) => {
  return (
    <NotificationCounterHolder className="pop">
      {notificationCount > 9 ? '9+' : notificationCount}
    </NotificationCounterHolder>
  );
};

interface NotificationCardProps {
  notificacao: Notificacao;
  onDelete: (id: number) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ onDelete, notificacao }) => {
  const handleClose = useCallback(() => {
    onDelete(notificacao.Id);
  }, [notificacao, onDelete]);

  return (
    <NotificationCardHolder>
      <div className="notificationBody">
        <NotificationCardHeader>
          <RiNewspaperLine color="#FF5F00" />
          <h2>{notificacao.Titulo}</h2>
          <div>
            <button onClick={handleClose}>
              <AiFillCloseCircle color="#6B6576" />
            </button>
          </div>
        </NotificationCardHeader>
        <p>{notificacao.Mensagem}</p>
        <span>{notificacao.Data.toLocaleDateString()}</span>
      </div>
    </NotificationCardHolder>
  );
};

interface NotificationListCardProps {
  notifications: Notificacao[];
  onClear: () => void;
  onDelete: (id: number) => void;
}

const NotificationListCard: React.FC<NotificationListCardProps> = ({
  notifications,
  onClear,
  onDelete,
}) => {
  return (
    <Card>
      <CardHeader>
        <NotificationCounter notificationCount={notifications?.length ?? 0} />
        Notificações
      </CardHeader>
      <CardBody>
        {notifications?.length > 0 ? (
          notifications.map(ntf => (
            <NotificationCard key={ntf.Id} notificacao={ntf} onDelete={onDelete} />
          ))
        ) : (
          <TextUndefined>Não há nada por aqui!</TextUndefined>
        )}
      </CardBody>
      <CardFooter>
        <Button onClick={() => onClear()} className="small">
          Limpar
        </Button>
      </CardFooter>
    </Card>
  );
};

const Notification: React.FC<React.HTMLAttributes<HTMLDivElement>> = props => {
  const { notificacoes, setNotificacoes, setOpenNotification, isOpen } = useNotification();
  const { addLoad, removeLoad } = useLoad();
  const { user } = useAuth();
  const contentsRef = useRef<HTMLDivElement>();
  const [right, setRight] = useState<number>(null);

  const getNotifications = useCallback(async () => {
    const tmpNotifications = await NotificacaoApi.Listar();
    setNotificacoes(tmpNotifications);
  }, [setNotificacoes]);

  const Excluir = useCallback(
    async (idNotificacao?: number) => {
      const load = 'ExcluirNotificacoes';
      addLoad(load);
      const success = await NotificacaoApi.Excluir(idNotificacao);
      if (success) {
        await getNotifications();
      }
      removeLoad(load);
    },
    [addLoad, removeLoad, getNotifications],
  );

  useEffect(() => {
    if (user) {
      getNotifications();
    }
  }, [getNotifications, user]);

  const reposicionar = useCallback(() => {
    const btnRect = document.getElementById('btnOpenNotifications').getBoundingClientRect();
    const contentRect = contentsRef.current.getBoundingClientRect();
    const tmpRight =
      window.innerWidth - (btnRect.right - btnRect.width / 2 + contentRect.width / 2);
    setRight(Math.max(tmpRight, 0));
  }, [contentsRef]);

  useEffect(() => {
    if (isOpen) {
      reposicionar();
    }
    const handleResize = () => {
      if (isOpen) {
        reposicionar();
      } else {
        setRight(null);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, reposicionar]);
  return isOpen ? (
    <Container align="flex-end" {...props} onClick={() => setOpenNotification(false)}>
      <Contents
        ref={contentsRef}
        right={right}
        className={right === null ? 'hide' : ''}
        onClick={e => e.stopPropagation()}
      >
        <NotificationListCard
          notifications={notificacoes?.map(e => {
            return {
              ...e,
              onClose: () => {
                Excluir(e.Id);
              },
            };
          })}
          onClear={Excluir}
          onDelete={Excluir}
        />
      </Contents>
    </Container>
  ) : (
    <></>
  );
};

export default Notification;
