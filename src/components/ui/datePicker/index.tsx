import React, { useRef, useEffect, useState } from 'react';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import { useField } from '@unform/core';
import styled from 'styled-components';

import InputErrorAlert from '../inputErrorAlert';
import { primaryColor, gray3 } from '../../../styles/consts';

import 'react-datepicker/dist/react-datepicker.css';

export const Container = styled.div`
  position: relative;

  background: #fff;
  border-radius: 9px;
  padding: 16px;
  width: 100%;
  height: 55px;

  border: 2px solid ${gray3};
  color: ${gray3};

  display: flex;
  align-items: center;

  &:focus-within {
    border-color: ${primaryColor.color};
    color: ${primaryColor.color};
  }

  input {
    flex: 1;
    width: 100%;
    background-color: white !important;
    border: 0;
    color: #312e38;

    &::placeholder {
      color: #d1ced6;
    }
  }
  .react-datepicker {
    &__header {
      background-color: ${primaryColor.accent};
    }
    &__day&__day--keyboard-selected {
      background-color: ${primaryColor.color};
    }
    &-wrapper {
      flex-grow: 1;
    }
  }
`;
interface DatePickerProps extends Omit<ReactDatePickerProps, 'onChange'> {
  name: string;
  date?: Date;
  placeholder?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  name,
  date,
  placeholder,
  ...rest
}) => {
  const datepickerRef = useRef(null);
  const {
    fieldName,
    registerField,
    defaultValue,
    error,
    clearError,
  } = useField(name);
  const [value, setValue] = useState(date || defaultValue || null);
  useEffect(() => {
    registerField({
      name: fieldName,
      ref: datepickerRef.current,
      path: 'props.selected',
      clearValue: (ref: any) => {
        ref.clear();
      },
    });
  }, [fieldName, registerField]);
  return (
    <Container>
      <ReactDatePicker
        dateFormat="dd/MM/yyyy"
        ref={datepickerRef}
        selected={value}
        onChange={setValue}
        placeholderText={placeholder}
        {...rest}
      />
      <InputErrorAlert error={error} clearError={clearError} />
    </Container>
  );
};
export default DatePicker;
