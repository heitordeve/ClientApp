import React, { useEffect, useRef, InputHTMLAttributes, useCallback } from 'react';
import { IoEyeSharp, IoEyeOffSharp } from 'react-icons/io5';
import InputMask, { Props as InputMaskProps, InputState, MaskOptions } from 'react-input-mask';

import { useField, UnformField } from '@unform/core';
import InputErrorAlert from '../inputErrorAlert';

import { mascaraCpf, mascaraCnpj } from 'utils/printHelper';

import { Container } from './styles';

import InputImage from './inputImage';
import { gray6 } from 'styles/consts';

export interface InputProps {
  name: string;
  styles?: React.CSSProperties;
  props?: InputHTMLAttributes<HTMLInputElement> | InputMaskProps;
  changeType?: () => void;
}

export interface InputCPFCNPJProps {
  name: string;
  props?: InputHTMLAttributes<HTMLInputElement>;
}

interface NormalInputProps extends InputHTMLAttributes<HTMLInputElement> {
  fieldname: string;
  defaultValue: any;
  registerfield: <T>(field: UnformField<T>) => void;
}

interface MaskedInputProps extends InputMaskProps {
  fieldname: string;
  defaultValue: any;
  registerfield: <T>(field: UnformField<T>) => void;
}

export interface CurrencyInputProps {
  name: string;
  props?: InputHTMLAttributes<HTMLInputElement>;
}

export type beforeMaskedValueChangeFunc = (
  newState: InputState,
  oldState: InputState,
  userInput: string,
  maskOptions: MaskOptions,
) => InputState;

const NormalInput: React.FC<NormalInputProps> = ({ fieldname, registerfield, ...props }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    registerfield({
      name: fieldname,
      ref: inputRef.current,
      path: 'value',
    });
  }, [inputRef, fieldname, registerfield]);

  return <input ref={inputRef} defaultValue={props.defaultValue} {...props} />;
};

const MaskedInput: React.FC<MaskedInputProps> = ({ fieldname, registerfield, ...props }) => {
  const inputRef = useRef<InputMask>(null);
  useEffect(() => {
    registerfield({
      name: fieldname,
      ref: inputRef.current,
      path: 'value',
    });
  }, [inputRef, fieldname, registerfield]);
  return (
    <InputMask name={props.name} ref={inputRef} defaultValue={props.defaultValue} {...props} />
  );
};

const Input: React.FC<InputProps> = ({ name, props, styles, changeType }) => {
  const { fieldName, defaultValue, registerField, error, clearError } = useField(name);

  const render = useCallback(() => {
    let result: React.ReactNode;
    if (props && 'mask' in props) {
      result = (
        <>
          <MaskedInput
            name={name}
            fieldname={fieldName}
            defaultValue={defaultValue}
            registerfield={registerField}
            {...props}
          />
          {props?.type === 'password' && typeof changeType === 'function' ? (
            <IoEyeOffSharp
              onClick={changeType}
              style={{ marginLeft: 'auto', cursor: 'pointer' }}
              color={gray6}
              size={24}
            />
          ) : props?.type === 'normal' && typeof changeType === 'function' ? (
            <IoEyeSharp
              onClick={changeType}
              style={{ marginLeft: 'auto', cursor: 'pointer' }}
              color={gray6}
              size={24}
            />
          ) : null}
        </>
      );
    } else {
      result = (
        <>
          <NormalInput
            name={name}
            fieldname={fieldName}
            defaultValue={defaultValue}
            registerfield={registerField}
            {...props}
          />
          {props?.type === 'password' && typeof changeType === 'function' ? (
            <IoEyeOffSharp
              onClick={changeType}
              style={{ marginLeft: 'auto', cursor: 'pointer' }}
              color={gray6}
              size={24}
            />
          ) : props?.type === 'normal' && typeof changeType === 'function' ? (
            <IoEyeSharp
              onClick={changeType}
              style={{ marginLeft: 'auto', cursor: 'pointer' }}
              color={gray6}
              size={24}
            />
          ) : null}
        </>
      );
    }
    return result;
  }, [fieldName, defaultValue, registerField, name, props]);

  return (
    <Container style={styles}>
      {render()}
      <InputErrorAlert error={error} clearError={clearError} />
    </Container>
  );
};

export default Input;

export const SimpleInput: React.FC<InputProps> = ({ name, props }) => {
  const { fieldName, defaultValue, registerField } = useField(name);

  const render = useCallback(() => {
    let result: React.ReactNode;
    if ('mask' in props) {
      result = (
        <MaskedInput
          name={name}
          fieldname={fieldName}
          defaultValue={defaultValue}
          registerfield={registerField}
          {...props}
        />
      );
    } else {
      result = (
        <NormalInput
          name={name}
          fieldname={fieldName}
          defaultValue={defaultValue}
          registerfield={registerField}
          {...props}
        />
      );
    }
    return result;
  }, [fieldName, defaultValue, registerField, name, props]);

  return <>{render()}</>;
};

export const CurrencyInput: React.FC<CurrencyInputProps> = ({ name, props }) => {
  const inputRef = useRef(null);
  const { fieldName, defaultValue, registerField, error, clearError } = useField(name);

  const handleCurrencyInput: React.ChangeEventHandler<HTMLInputElement> = useCallback(i => {
    let v = i.currentTarget.value.replace(/\D/g, '');
    v = (Number(v) / 100).toFixed(2) + '';
    v = v.replace('.', ',');
    v = v.replace(/(\d)(\d{3})(\d{3}),/g, '$1.$2.$3,');
    v = v.replace(/(\d)(\d{3}),/g, '$1.$2,');
    i.currentTarget.value = 'R$ ' + v;
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [inputRef, fieldName, registerField]);

  return (
    <Container>
      <input
        {...props}
        name={name}
        ref={inputRef}
        defaultValue={defaultValue}
        onChange={handleCurrencyInput}
      />
      <InputErrorAlert error={error} clearError={clearError} />
    </Container>
  );
};

export const InputCPFCNPJ: React.FC<InputCPFCNPJProps> = ({ name, props }) => {
  const { fieldName, defaultValue, registerField, error, clearError } = useField(name);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(event => {
    let value = event.currentTarget.value.replace(/\D/g, '');
    if (value.length > 11) {
      value = mascaraCnpj(value);
    } else {
      value = mascaraCpf(value);
    }
    event.currentTarget.value = value;
  }, []);

  return (
    <Container>
      <NormalInput
        {...props}
        name={name}
        fieldname={fieldName}
        defaultValue={defaultValue}
        registerfield={registerField}
        onChange={handleChange}
        maxLength={18}
      />
      <InputErrorAlert error={error} clearError={clearError} />
    </Container>
  );
};

export { InputImage };
