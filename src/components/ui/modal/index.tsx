import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import ReactModal from 'react-modal';
import { IcClose, IcLeft } from '../icons';
import { OverLoading } from '../loading';
import { Column, Row } from '../layout';
import { Title } from '../typography';
import { Card } from '../card';
import ModalAlert from './modalAlert';
import { breakpoint, media, cssIf } from 'styles';
export interface ModalProps {
  title?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  loading?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  popup?: boolean;
  padding?: string;
}
interface ContainerProps {
  minWidthh?: string;
  maxWidthh?: string;
  minHeight?: string;
}
const Container = styled(Column)<ContainerProps>`
  flex: 1;
  max-height: calc(100vh - 20px);
  ${media.min(breakpoint.md)} {
    ${({ minWidthh }) => cssIf('min-width', minWidthh)}
    ${({ maxWidthh }) => cssIf('max-width', maxWidthh)}
    ${({ minHeight }) => cssIf('min-heigh', minHeight)}
  }
`;

const Grid = styled(Column)`
  display: grid;
  overflow: auto;
`;

const Content = styled(Column)`
  ${({ padding }) => cssIf('padding', padding)}
  grid-column: 1;
  grid-row: 1;
  height: 100%;
  width: 100%;
  overflow: auto;
`;

const BoxBack = styled.div`
  margin-right: '-20px';
  &.popup {
    display: none;
  }
  ${media.min(breakpoint.lg)} {
    display: none;
  }
`;
const BoxClose = styled.div`
  ${media.max(breakpoint.md)} {
    &:not(.popup) {
      display: none;
    }
  }
`;

const CardModal = styled(Card)`
  ${media.max(breakpoint.sm)} {
    border-radius: 0px;
    width: 100%;
    flex: 1;
  }
`;

const Modal: React.FC<ModalProps> = ({
  children,
  title,
  loading = false,
  isOpen = true,
  minWidth,
  maxWidth,
  minHeight,
  onClose,
  footer,
  padding,
  popup = false,
}) => {
  const [open, setOpen] = useState<boolean>(isOpen);
  const close = useCallback(() => {
    onClose?.();
    setOpen(false);
  }, [setOpen, onClose]);
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);
  return (
    <ReactModal
      overlayClassName="kim-modal d-flex"
      className={`kim-modal__Content ${popup ? 'popup' : ''}`}
      isOpen={open}
      onRequestClose={() => close()}
    >
      <CardModal flex="0" margin="0" justify="center" grow="0">
        <OverLoading loading={loading}>
          <Container minWidthh={minWidth} minHeight={minHeight} maxWidthh={maxWidth}>
            <Row align="center" grow="0" color="primary" padding="0 0 6px">
              <BoxBack className={popup ? 'popup' : ''}>
                <IcLeft size="30" onClick={() => close()} />
              </BoxBack>
              <Title grow="1" justify="center">
                {title}
              </Title>
              <BoxClose className={popup ? 'popup' : ''}>
                <IcClose
                  onClick={() => close()}
                  size="20"
                  style={{
                    cursor: 'pointer',
                    flexGrow: 0,
                    marginLeft: '-20px',
                  }}
                />
              </BoxClose>
            </Row>
            <Grid flex="1">
              <Content padding={padding}>
                <Column align="stretch" flex="1" maxHeight="100%">
                  {children}
                </Column>
                {footer}
              </Content>
            </Grid>
          </Container>
        </OverLoading>
      </CardModal>
    </ReactModal>
  );
};
export { ModalAlert };
export default Modal;
