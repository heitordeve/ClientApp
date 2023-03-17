import React from 'react';
import styled from 'styled-components';

import { ButtonProps, schemeBtnMap } from './index';
import { Container } from './styles';
import { schemeMap } from '../../../styles/consts';
import { Column } from '../layout';
import { media, breakpoint, zIndex } from 'styles';

export const FabContainer = styled(Column).attrs(props => ({ gap: '12px', align: 'center' }))`
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: ${zIndex.fab};
  ${media.max(breakpoint.md)} {
    bottom: 75px;
  }
`;

interface ContainerBtnProps {
  size: number;
}

const ContainerBtn = styled(Container)<ContainerBtnProps>`
  height: ${({ size }) => size}px;
  width: ${({ size }) => size}px;
  border-radius: 50%;
  min-height: unset;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  svg {
    height: 24px;
    width: 24px;
  }
`;
interface BoxButtonProps extends Omit<ButtonProps, 'border' | 'width' | 'height'> {
  size?: 48 | 56;
}

const Fab: React.FC<BoxButtonProps> = ({
  color = 'primary',
  theme = 'default',
  size = 56,
  children,
  as = 'button',
  ...rest
}) => {
  const schemeColor = schemeMap.get(color);
  const schemeBtn = schemeBtnMap.get(theme);
  return (
    <ContainerBtn
      background={schemeBtn.background?.(schemeColor)}
      textColor={schemeBtn.color(schemeColor)}
      type={'button'}
      size={size}
      as={as}
      {...rest}
    >
      {children}
    </ContainerBtn>
  );
};

export default Fab;
