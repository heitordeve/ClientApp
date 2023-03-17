import React from 'react';
import styled from 'styled-components';

import { Column } from '../layout';
import Badge from '../badge';
import { IconType } from 'react-icons';
import { ButtonProps, schemeBtnMap } from './index';
import { Container } from './styles';
import { schemeMap } from '../../../styles/consts';
import { cssIf } from 'styles';

interface ContainerBtnProps {
  height: string;
  width: string;
}

const ContainerBtn = styled(Container)<ContainerBtnProps>`
  ${({ height }) => cssIf('height', height)}
  ${({ width }) => cssIf('width', width)}
  padding: 0 6px;
  white-space: normal;
`;
interface LabelProps {
  size: number;
}
const Label = styled.label<LabelProps>`
  height: ${({ size }) => size}px;
  font-size: ${({ size }) => size}px;
`;
interface BoxButtonProps extends ButtonProps {
  icone: IconType;
  label: string;
  size?: number;
  height?: string;
  width?: string;
  fontSize?: number;
  badge?: number;
}

const IconButton: React.FC<BoxButtonProps> = ({
  color = 'primary',
  theme = 'default',
  type,
  icone: Icon,
  label,
  size,
  height,
  width,
  fontSize = 12,
  badge = 0,
  border = false,
  ...rest
}) => {
  const schemeColor = schemeMap.get(color);
  const schemeBtn = schemeBtnMap.get(theme);
  if (!size && !height && !width) {
    size = 100;
  }
  if (size) {
    height = size + 'px';
    width = size + 'px';
  }
  return (
    <ContainerBtn
      background={schemeBtn.background?.(schemeColor)}
      textColor={schemeBtn.color(schemeColor)}
      border={border ? schemeBtn.border?.(schemeColor) : null}
      type={type ?? 'button'}
      height={height}
      width={width}
      {...rest}
    >
      <Column align="center">
        <Badge count={badge}>
          <Icon size={24} />
        </Badge>
        <Label size={fontSize}>{label}</Label>
      </Column>
    </ContainerBtn>
  );
};

export default IconButton;
