import React, { useEffect, useRef, InputHTMLAttributes } from 'react';
import { useField } from '@unform/core';
import Label from '../label';
import { RadioContainer } from './styles';

import InputErrorAlert from '../inputErrorAlert';

export interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  divStyle?: React.CSSProperties;
  options: RadioProps[];
}

const RadioButton: React.FC<Props> = ({ name, divStyle, options, ...rest }) => {
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const { fieldName, registerField, defaultValue = '', error, clearError } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRefs.current,
      getValue: (refs: HTMLInputElement[]) => {
        return refs.find(ref => ref?.checked)?.value || '';
      },
      setValue: (refs: HTMLInputElement[], id: string) => {
        const inputRef = refs.find(ref => ref.id === id);
        if (inputRef) inputRef.checked = true;
      },
      clearValue: (refs: HTMLInputElement[]) => {
        const inputRef = refs.find(ref => ref.checked === true);
        if (inputRef) inputRef.checked = false;
      },
    });
  }, [defaultValue, fieldName, registerField]);

  return (
    <div style={divStyle}>
      {options.map((option, index) => (
        <RadioContainer>
          <input
            defaultChecked={option.defaultChecked}
            ref={ref => {
              inputRefs.current.push(ref as HTMLInputElement);
            }}
            name={name}
            value={option.value}
            type="radio"
            id={option.id}
            onClick={option.onClick}
            {...rest}
          />
          <Label htmlFor={option.id} key={option.id}>
            {option.label}
          </Label>
        </RadioContainer>
      ))}
      <InputErrorAlert error={error} clearError={clearError} />
    </div>
  );
};

export default RadioButton;

export interface CustomRadioOptionProps {
  render: (input: React.ReactNode) => React.ReactNode;
  props: {
      id: string;
      value?: string | number | readonly string[];
      defaultChecked?: boolean;
      onClick?: (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
      disabled?: boolean;
  }
}

export interface CustomRadioProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  divProps?: React.HTMLAttributes<HTMLDivElement>;
  options: CustomRadioOptionProps[];
}

export const CustomRadioButton: React.FC<CustomRadioProps> = ({ name, divProps, options, ...rest }) => {
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const { fieldName, registerField, defaultValue = '', error, clearError } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRefs.current,
      getValue: (refs: HTMLInputElement[]) => {
        return refs.find(ref => ref?.checked)?.value || '';
      },
      setValue: (refs: HTMLInputElement[], id: string) => {
        const inputRef = refs.find(ref => ref.id === id);
        if (inputRef) inputRef.checked = true;
      },
      clearValue: (refs: HTMLInputElement[]) => {
        const inputRef = refs.find(ref => ref.checked === true);
        if (inputRef) inputRef.checked = false;
      },
    });
  }, [defaultValue, fieldName, registerField]);

  return (
    <div {...divProps}>
      {options.map((option, index) =>
        option.render(
          <input
            id={option.props.id}
            value={option.props.value}
            defaultChecked={option.props.defaultChecked}
            onClick={option.props.onClick}
            disabled={option.props.disabled}
            ref={ref => {
              inputRefs.current.push(ref as HTMLInputElement);
            }}
            name={fieldName}
            type="radio"
            {...rest}
          />
        )
      )}
      <InputErrorAlert error={error} clearError={clearError} />
    </div>
  );
};
