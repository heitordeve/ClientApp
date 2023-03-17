import React, { useState, useCallback, useEffect, useRef, InputHTMLAttributes } from 'react';
import { useField } from '@unform/core';
import InputAlertError from '../inputErrorAlert';

import { getBrandLogo } from '../../CreditCardCard/index';

import {
  Container,
  SmallContainer,
  CreditCardContainer,
  CreditCardSelector,
  CreditCardOption,
  CreditCardToggle,
} from './styles';

export interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  name: string;
  styles?: React.CSSProperties;
}

const Select: React.FC<SelectProps> = ({ name, styles, ...rest }) => {
  const inputRef = useRef(null);

  const { fieldName, defaultValue, registerField, error, clearError } = useField(name);
  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <Container style={styles}>
      <select name={name} ref={inputRef} defaultValue={defaultValue} {...rest} />
      <InputAlertError error={error} clearError={clearError} />
    </Container>
  );
};

export default Select;

export const SimpleSelect: React.FC<SelectProps> = ({ name, ...rest }) => {
  const inputRef = useRef(null);

  const { fieldName, defaultValue, registerField } = useField(name);
  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return <select name={name} ref={inputRef} defaultValue={defaultValue} {...rest} />;
};

export const SmallSelect: React.FC<SelectProps> = ({ name, ...rest }) => {
  const inputRef = useRef(null);

  const { fieldName, defaultValue, registerField, error, clearError } = useField(name);
  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <SmallContainer>
      <select name={name} ref={inputRef} defaultValue={defaultValue} {...rest} />
      <InputAlertError error={error} clearError={clearError} />
    </SmallContainer>
  );
};

interface CreditCardOptionValue {
  id: string;
  value: any;
  brandLogo?: React.ReactNode;
  children?: React.ReactNode;
}

interface CreditCardOptionProps extends InputHTMLAttributes<HTMLOptionElement> {
  brand: string;
  id: string;
}

export interface CreditCardSelectProps extends SelectProps {
  options: CreditCardOptionProps[];
}

export const CreditCardSelect: React.FC<CreditCardSelectProps> = ({
  name,
  options: optionsProps,
  onChange,
  ...rest
}) => {
  const inputRef = useRef<HTMLSelectElement>(null);

  const [isOpen, setIsOpen] = useState<boolean>();
  const [options, setOptions] = useState<CreditCardOptionValue[]>([]);
  const [selectedOption, setSelectedOption] = useState<CreditCardOptionValue>();

  const { fieldName, defaultValue, registerField, error, clearError } = useField(name);

  useEffect(() => {
    if (inputRef) {
      inputRef.current.value = selectedOption?.value;
      let event = new Event('change', { bubbles: true, cancelable: true });
      inputRef.current.dispatchEvent(event);
    }
  }, [inputRef, selectedOption]);

  const clear = useCallback(() => {
    if (options.length > 0) {
      if (defaultValue) {
        setSelectedOption(prev => {
          let result = prev;
          if (!prev) {
            result = options.find(e => e.value === defaultValue);
          }
          return result;
        });
      } else {
        setSelectedOption(prev => {
          let result = prev;
          if (!prev) {
            result = options[0];
          }
          return result;
        });
      }
    }
  }, [options, defaultValue]);

  useEffect(() => {
    clear();
  }, [clear]);

  useEffect(() => {
    setOptions(
      optionsProps.map(e => ({
        id: e.id,
        value: e.value,
        brandLogo: getBrandLogo(e.brand),
        children: e.children,
      })),
    );
  }, [optionsProps]);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
      setValue: (ref: any, value: any) => {
        setOptions(val => {
          setSelectedOption(val.find(e => e.value === value));
          return val;
        });
      },
      clearValue: () => {
        setSelectedOption(undefined);
      },
    });
  }, [fieldName, registerField]);

  const toggleSelect = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleOptionClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
      setSelectedOption(options.find(e => e.id === event.currentTarget.id));
    },
    [options],
  );

  return (
    <CreditCardContainer tag="div" isOpen={isOpen} toggle={toggleSelect}>
      <CreditCardToggle tag="span">
        {selectedOption?.brandLogo}
        <select onChange={onChange} {...rest} name={name} ref={inputRef} disabled>
          {optionsProps.map(e => (
            <option {...e} />
          ))}
        </select>
        <InputAlertError error={error} clearError={clearError} />
      </CreditCardToggle>
      <CreditCardSelector tag="span">
        {options.map(e => (
          <CreditCardOption tag="div" id={e.id} onClick={handleOptionClick}>
            {e.brandLogo}
            {e.children}
          </CreditCardOption>
        ))}
      </CreditCardSelector>
    </CreditCardContainer>
  );
};
