import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface DeactivatableProps {
  disabled: boolean;
}
const Container = styled.div<DeactivatableProps>`
  ${({ disabled }) => disabled && 'cursor: pointer;'}
  justify-content: center;
  display:flex;

  height: 100%;
  border-radius: 10px;
  overflow: hidden;
`;
const Conteudo = styled.div<DeactivatableProps>`
  ${({ disabled }) => disabled && 'pointer-events:none;'}
  display:flex;
  flex: 1;
`;

interface CarrosselItemProps {
  children: ReactNode;
  isActive: boolean;
  className: string;
  onclick: () => void;
}

const CarrosselItem: React.FC<CarrosselItemProps> = ({
  children,
  isActive,
  onclick,
  className,
}) => {
  return (
    <Container
      disabled={!isActive}
      className={className}
      onClick={e => {
        if (!isActive) {
          e.stopPropagation();
          onclick();
        }
      }}
    >
      <Conteudo disabled={!isActive}>{children}</Conteudo>
    </Container>
  );
};

export default CarrosselItem;
