import styled from 'styled-components';
import { shade } from 'polished';
import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import { cssIf } from 'styles';
import { gray2, gray4 } from 'styles/consts';

interface ContainerProps extends DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> {
  background: string;
  textColor: string;
  grow?: string | number;
  flex?: string | number;
  border?: string;
  pointed?: boolean;
}
const transparente = '#00000000'
export const Container = styled.button<ContainerProps>`
  color: ${props => props.textColor};
  ${({ grow }) => cssIf('flex-grow', grow)}
  ${({ flex }) => cssIf('flex', flex)}
  background:${({ background }) => background ?? transparente};
  border-radius: ${({ pointed }) => pointed ? 0 : 10}px;
  border: ${({ border }) => border ?? 'none'};
  margin:0;
  min-height: 42px;
  width: 100%;
  font-weight: 500;
  outline: none;
  text-align: center;
  transition: background-color 0.5s linear;
  transition: color 0.5s linear;
  white-space: nowrap;
  align-items: center;
  justify-content: center;
  &:disabled{
    background: ${gray2};
    color: ${gray4};
    cursor: not-allowed;
}
  &:focus {
    outline: none;
  }

  &:hover:not(:disabled) {
    background: ${({ background }) => shade(0.2, background ?? transparente)};
  }
  &.small {
    height: auto !important;
    min-height: 30px;
  }
`;
