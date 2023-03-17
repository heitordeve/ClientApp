import React, { useRef, useEffect, ChangeEvent } from 'react';
import ReactInputMask from 'react-input-mask';
import NumberFormat, { NumberFormatProps } from 'react-number-format';
import { useField } from '@unform/core';
import styled from 'styled-components';

import { Title } from '../../typography';
import { Row } from '../../layout';
import InputErrorAlert from '../../inputErrorAlert';
import { primaryColor, gray3, gray1 } from 'styles/consts';
import { cssIf } from 'styles';
import { BaseIconType } from 'components/ui/icons/baseIcon';
interface ContainerProps {
  flex: string;
  round: boolean;
}
export const Container = styled.div<ContainerProps>`
  position: relative;

  background: #fff;
  border-radius: 9px;
  padding: 16px;
  width: 100%;
  height: 55px;

  border: 2px solid ${gray3};
  color: ${gray3};

  display: flex;
  ${({ flex }) => cssIf('flex', flex)}
  ${({ round }) => round && 'border-radius: 28px;'}
  align-items: center;

  &:focus-within:not(.disabled) {
    border-color: ${primaryColor.color};
    color: ${primaryColor.color};
  }
  &.disabled {
    background-color: ${gray1};
  }
  input {
    flex: 1;
    width: 100%;
    background-color: #00000000 !important;
    border: 0;
    color: #312e38;

    &::placeholder {
      color: #d1ced6;
    }
  }
`;
enum TypeMask {
  ReactInputMask = 1,
  NumberFormat = 2,
}
const maskMap = new Map<string, Mask>();
maskMap.set('decimal', {
  typeMask: TypeMask.NumberFormat,
  decimalScale: 2,
  fixedDecimalScale: true,
});
maskMap.set('cvv', {
  typeMask: TypeMask.NumberFormat,
  mask: '',
  format: '####',
});
maskMap.set('cep', {
  typeMask: TypeMask.NumberFormat,
  mask: '',
  format: '#####-###',
});
maskMap.set('date', {
  mask: ['D', 'D', 'M', 'M', 'Y', 'Y', 'Y', 'Y'],
  format: '##/##/####',
  placeholder: 'DD/MM/AAAA',
  typeMask: TypeMask.NumberFormat,
});
maskMap.set('MM/YYYY', {
  mask: ['M', 'M', 'Y', 'Y', 'Y', 'Y'],
  format: '##/####',
  placeholder: 'MM/AAAA',
  typeMask: TypeMask.NumberFormat,
});

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'autoComplete'> {
  name: string;
  mask?: 'decimal' | 'date' | 'MM/YYYY' | 'cvv' | 'cep';
  prefix?: 'R$';
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
  flex?: string;
  autoComplete?: boolean;
  rigthIcon?: BaseIconType;
  leftIcon?: BaseIconType;
  round?: boolean;
}

interface Mask {
  typeMask: TypeMask;
  mask?: string | string[];
  placeholder?: string;
  format?: string;
  decimalScale?: number;
  fixedDecimalScale?: boolean;
}

const Input: React.FC<InputProps> = ({
  name,
  mask,
  prefix,
  disabled,
  flex,
  autoComplete,
  rigthIcon: RigthIcon,
  leftIcon: LeftIcon,
  round,
  ...rest
}) => {
  const inputRef = useRef(null);
  const { fieldName, registerField, defaultValue, error, clearError } = useField(name);
  const currentMask = maskMap.get(mask);
  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [inputRef, fieldName, registerField]);

  return (
    <Container className={disabled ? 'disabled' : ''} flex={flex} round={round}>
      <Row gap="8px" flex="1">
        {LeftIcon && <LeftIcon size="24px" />}
        {prefix && <Title margin="0">{prefix}</Title>}
        {currentMask?.typeMask === TypeMask.ReactInputMask && (
          <ReactInputMask
            ref={inputRef}
            defaultValue={defaultValue}
            mask={currentMask.mask}
            name={name}
            disabled={disabled}
            {...rest}
          />
        )}
        {currentMask?.typeMask === TypeMask.NumberFormat && (
          <NumberFormat
            thousandSeparator="."
            decimalSeparator=","
            mask={currentMask.mask ?? ' '}
            placeholder={currentMask.placeholder}
            format={currentMask.format}
            decimalScale={currentMask.decimalScale}
            fixedDecimalScale={currentMask.fixedDecimalScale}
            getInputRef={inputRef}
            name={name}
            {...(rest as NumberFormatProps)}
          />
        )}
        {!currentMask && (
          <input ref={inputRef} name={name} autoComplete={autoComplete ? 'on' : 'off'} {...rest} />
        )}
        <InputErrorAlert error={error} clearError={clearError} />
        {RigthIcon && <RigthIcon size="24px" />}
      </Row>
    </Container>
  );
};
export default Input;
