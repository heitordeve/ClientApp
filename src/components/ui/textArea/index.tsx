import React, { useEffect, useRef, TextareaHTMLAttributes, useCallback } from 'react';
import { useField } from '@unform/core';
import { Container } from './styles';
import InputErrorAlert from '../inputErrorAlert';

export interface TextAreaMaskProps {
  name: string;
  props: TextareaHTMLAttributes<HTMLTextAreaElement>;
}

export const TextAreaMask: React.FC<TextAreaMaskProps> = ({
  name,
  props
}) => {
  const textAreaRef = useRef(null);
  const { fieldName, defaultValue, registerField, error, clearError } = useField(name);

  const handleTextAreaMask: React.ChangeEventHandler<HTMLTextAreaElement> = useCallback(i => {
    i.currentTarget.value = i.currentTarget.value.replace(/\D/g, '').replace(/(\d{5})(\d{5})(\d{5})(\d{6})(\d{5})(\d{6})(\d)(\d{14})/g, "$1.$2 $3.$4 $5.$6 $7 $8");
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: textAreaRef.current,
      path: 'value'
    });
  }, [textAreaRef, fieldName, registerField]);

  return (
    <Container>
      <textarea
        {...props}
        name={name}
        ref={textAreaRef}
        defaultValue={defaultValue}
        onChange={handleTextAreaMask}
      />
      <InputErrorAlert error={error} clearError={clearError} />
    </Container>
  );
}

export default TextAreaMask;
