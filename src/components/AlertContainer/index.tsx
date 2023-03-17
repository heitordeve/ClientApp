import React from 'react';
import Alert from './Alert';
import { AlertMessage } from '../../hooks/alert';
import { Container } from './styles';

interface AlertContainerProps {
  messages: AlertMessage[];
}

const AlertContainer: React.FC<AlertContainerProps> = ({ messages }) => {
  return (
    <Container>
      {messages.map((message, i) => (
        <Alert key={'alert-' + i} message={message} />
      ))}
    </Container>
  );
};

export default AlertContainer;
