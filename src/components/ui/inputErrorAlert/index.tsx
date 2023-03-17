import React from 'react';
import { RiCloseFill } from 'react-icons/ri';
import {
  ErrorAlert,
  ErrorMessage
} from './styles';

interface InputErrorAlertProps {
  error?: string;
  clearError?: () => void;
}

const InputErrorAlert: React.FC<InputErrorAlertProps> = ({ error, clearError }) => {
  return (
    <>
      {
        error &&
        <ErrorAlert>
          <ErrorMessage>
            {error}
            <RiCloseFill onClick={clearError} className="btn-close"/>
          </ErrorMessage>
        </ErrorAlert>
      }
    </>
  );
};

export default InputErrorAlert;
