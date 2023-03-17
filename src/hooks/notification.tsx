import React, { useState, useCallback, createContext, useContext } from 'react';
import { Notificacao } from 'dtos/notificacao';

interface NotificationContextData {
  setOpenNotification: (open: boolean) => void;
  toggleNotification: () => void;
  isOpen: boolean;
  notificacoes: Notificacao[];
  setNotificacoes: (notificacoes: Notificacao[]) => void;
}

const NotificationContext = createContext<NotificationContextData>({
  setOpenNotification: () => {},
  toggleNotification: () => {},
  isOpen: false,
  notificacoes: [],
  setNotificacoes: () => {},
});

export const NotificationProvider: React.FC = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [notificacoes, _setnotificacoes] = useState<Notificacao[]>([]);

  const setOpenNotification = useCallback(
    (open: boolean) => {
      setIsOpen(open);
    },
    [setIsOpen],
  );

  const toggleNotification = useCallback(async () => {
    setIsOpen(prev => !prev);
  }, [setIsOpen]);

  const setNotificacoes = useCallback(
    async (notificacoes: Notificacao[]) => {
      _setnotificacoes(notificacoes);
    },
    [_setnotificacoes],
  );

  return (
    <NotificationContext.Provider
      value={{
        setOpenNotification,
        isOpen,
        toggleNotification,
        notificacoes,
        setNotificacoes,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
