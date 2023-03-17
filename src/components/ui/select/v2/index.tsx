import React, { useRef, useEffect } from 'react';
import { useField } from '@unform/core';
import ReactSelect, { OptionTypeBase, Props as ReactSelectProps } from 'react-select';
import styled from 'styled-components';
import { gray3, primaryColor } from 'styles/consts';
import InputAlertError from '../../inputErrorAlert';
import Options from './options';

export const Container = styled.div`
  position: relative;
  .select__control {
    background: #fff;
    border-radius: 9px;
    padding: 0px 8px 0px 16px;
    width: 100%;
    height: 55px;

    border: 2px solid ${gray3};
    color: ${gray3};

    display: flex;
    align-items: center;
    box-shadow: none;
    &:focus-within {
      border-color: ${primaryColor.color};
      color: ${primaryColor.color};
    }
    .select__indicator-separator {
      display: none;
    }
    .select__placeholder {
      color: #d0cdd5;
    }
    .select__value-container {
      padding: 0px;
    }
  }
  .select__menu {
    border-radius: 9px;
    overflow: hidden;
    border: 1px solid ${primaryColor.color};
    background: ${primaryColor.accent};
    .select__menu-list {
      padding: 0px;

      .select__option {
        &.select__option--is-selected {
          background-color: ${primaryColor.color};
        }
        &.select__option--is-focused:not(.select__option--is-selected) {
          background-color: ${primaryColor.color}80;
          color: white;
        }
      }
    }
  }
`;
type Value = string | number;
export type OptionsType = {
  value: Value;
  label: string;
};

export interface SelectProps extends Omit<ReactSelectProps<OptionTypeBase>, 'defaultValue'> {
  name: string;
  options?: OptionsType[];
}

const Select: React.FC<SelectProps> = ({ name, options, ...rest }) => {
  const selectRef = useRef(null);

  const { fieldName, registerField, defaultValue, error, clearError } = useField(name);
  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectRef.current,
      getValue: (ref: any) => {
        if (rest.isMulti) {
          if (!ref.state.value) {
            return [];
          }
          return ref.state.value.map((option: OptionTypeBase) => option.value);
        }
        if (!ref.state.value) {
          return '';
        }
        return ref.state.value.value;
      },
      setValue: (ref: any, value: Value | Value[]) => {
        const options = ref.props.options;
        const op = Array.isArray(value)
          ? options.filter((o: OptionsType) => value.includes?.(o.value))
          : options.find((o: OptionsType) => value === o.value);
        ref?.select?.setValue(op);
      },
    });
  }, [fieldName, registerField, rest.isMulti]);

  return (
    <Container>
      <ReactSelect
        defaultValue={defaultValue}
        ref={selectRef}
        classNamePrefix="select"
        options={options}
        {...rest}
      />
      <InputAlertError error={error} clearError={clearError} />
    </Container>
  );
};

export { Options };
export default Select;
