import React from 'react';
import { Column } from '../layout';
import Modal, { ModalProps } from './index';

interface ModalAlertProps extends Omit<ModalProps, 'popup'> {
  width?: string;
}

const ModalAlert: React.FC<ModalAlertProps> = ({ children, width = '350px', ...rest }) => {
  return (
    <Modal popup {...rest} maxWidth={width} minWidth={width}>
      <Column justify="center" padding="12px 25px 6px" gap="12px">
        {children}
      </Column>
    </Modal>
  );
};

export default ModalAlert;
