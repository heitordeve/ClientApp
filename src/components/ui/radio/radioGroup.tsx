import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';

import InputErrorAlert from '../inputErrorAlert';
import { Flex } from '../layout';
import { useField } from '@unform/core';
import { RadioGroup as RadioGroupMd } from '@material-ui/core';

const Container = styled(Flex)`
  position: relative;
`;
const Goup = styled(RadioGroupMd)`
  &.MuiFormGroup-root {
    flex: 1;
    gap: 8px;
  }
`;

interface RadioGrouprops {
  name: string;
  ariaLabel: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: string | number) => void;
}

const RadioGroup: React.FC<RadioGrouprops> = ({
  name,
  ariaLabel,
  defaultValue,
  onChange,
  children,
}) => {
  const [value, setValue] = useState<string | number>(defaultValue ?? null);
  const [_error, _setError] = useState<string>();
  const groupRef = useRef<HTMLInputElement>();
  const { fieldName, registerField, error, clearError } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: groupRef.current,
      clearValue: () => {
        setValue(undefined);
      },
      getValue: () => value,
      setValue: (ref: any, value: string) => {
        setValue(value);
      },
    });
  }, [groupRef, fieldName, registerField, setValue, value]);

  const handleChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>, val: string | number) => {
      setValue(val);
      onChange?.(event, val);
    },
    [setValue, onChange],
  );

  return (
    <Container gap="6px">
      <Goup ref={groupRef} aria-label={ariaLabel} name={name} value={value} onChange={handleChange}>
        {children}
      </Goup>

      <InputErrorAlert
        error={error || _error}
        clearError={() => {
          clearError();
          _setError(undefined);
        }}
      />
    </Container>
  );
};

export default RadioGroup;
