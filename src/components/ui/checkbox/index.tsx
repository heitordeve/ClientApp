import React, { useEffect, useRef, InputHTMLAttributes } from 'react';
import { useField } from '@unform/core';
import Label from '../label';
import { CheckboxContainer, Container } from './styles';

import InputErrorAlert from '../inputErrorAlert';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  options: {
    id: string;
    value: string;
    label: string;
  }[];
}

const Checkbox: React.FC<Props> = ({ name, options, ...rest }) => {
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const { fieldName, registerField, defaultValue = [], error, clearError } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRefs.current,
      getValue: (refs: HTMLInputElement[]) => {
        return refs.filter(ref => ref.checked).map(ref => ref.value);
      },
      clearValue: (refs: HTMLInputElement[]) => {
        refs.forEach(ref => {
          ref.checked = false;
        });
      },
      setValue: (refs: HTMLInputElement[], values: string[]) => {
        refs.forEach(ref => {
          if (values.includes(ref.id)) {
            ref.checked = true;
          }
        });
      },
    });
  }, [defaultValue, fieldName, registerField]);

  return (
    <Container>
      {options.map((option, index) => (
        <CheckboxContainer>
          <input
            defaultChecked={defaultValue.find((dv: string) => dv === option.id)}
            ref={ref => {
              inputRefs.current[index] = ref as HTMLInputElement;
            }}
            value={option.value}
            type="checkbox"
            id={option.id}
            {...rest}
          />
          <Label htmlFor={option.id} key={option.id}>
            {option.label}
          </Label>
        </CheckboxContainer>
      ))}
      <InputErrorAlert error={error} clearError={clearError} />
    </Container>
  );
};

export default Checkbox;

