import React, { useEffect } from 'react';

import { FiAlertCircle, FiCheckCircle, FiInfo, FiXCircle } from 'react-icons/fi';
import { AlertMessage, useAlert } from '../../../hooks/alert';

import { Container } from './styles';

interface AlertProps {
  message: AlertMessage;
}

const icons = {
  info: <FiInfo size={24} />,
  error: <FiAlertCircle size={24} />,
  success: <FiCheckCircle size={24} />,
};

const Alert: React.FC<AlertProps> = ({ message }) => {
  const { removeAlert } = useAlert();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeAlert(message.id);
    }, Math.max(3000, message?.description?.length * 40));

    return () => {
      clearTimeout(timer);
    };
  }, [removeAlert, message]);

  return (
    <Container type={message.type} hasdescription={Number(!!message.description)}>
      {icons[message.type || 'info']}

      <div>
        <strong>{message.title}</strong>
        {message.description && <p>{message.description}</p>}
      </div>

      <button onClick={() => removeAlert(message.id)} type="button">
        <FiXCircle size={18} />
      </button>
    </Container>
  );
};

export default Alert;
