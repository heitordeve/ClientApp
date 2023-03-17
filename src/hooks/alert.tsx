import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import AlertContainer from '../components/AlertContainer';
import { Subject } from 'rxjs';

export interface AlertMessage {
  id: string;
  type?: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}
export const alertService = {
  success,
  error,
  info,
  alert,
};
interface AlertContextData {
  addAlert(message: Omit<AlertMessage, 'id'>): void;
  removeAlert(id: string): void;
}
const AlertContext = createContext<AlertContextData>({} as AlertContextData);

const AlertProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<AlertMessage[]>([]);

  const addAlert = useCallback(({ type, title, description }: Omit<AlertMessage, 'id'>) => {
    const id = uuid();

    const alert = {
      id,
      type,
      title,
      description,
    };

    setMessages(state => [...state, alert]);
  }, []);

  const removeAlert = useCallback((id: string) => {
    setMessages(state => state.filter(message => message.id !== id));
  }, []);

  useEffect(() => {
    if (alertSubject.observers.length === 0) {
      alertSubject.subscribe(alert => {
        setMessages(state => {
          return [...state, alert];
        });
      });
    }
  });
  return (
    <AlertContext.Provider value={{ addAlert, removeAlert }}>
      {children}
      <AlertContainer messages={messages} />
    </AlertContext.Provider>
  );
};

function useAlert(): AlertContextData {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error('useAlert must be used within a AlertProvider');
  }

  return context;
}
const alertSubject = new Subject<AlertMessage>();

function success(title: string, message: string) {
  alert(title, message, 'success');
}

function error(title: string, message: string) {
  alert(title, message, 'error');
}

function info(title: string, message: string) {
  alert(title, message, 'info');
}

// core alert method
function alert(title: string, description: string, type: string) {
  const id = uuid();
  alertSubject.next({ id, type, title, description } as AlertMessage);
}

export { AlertProvider, useAlert };
