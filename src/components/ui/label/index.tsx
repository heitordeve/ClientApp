import React, { LabelHTMLAttributes } from 'react';
import { Container } from './style';

const Label: React.FC<LabelHTMLAttributes<HTMLLabelElement>> = ( {children, ...rest} ) => {
  return (
    <Container {...rest}>
      {children}
    </Container>
  );
}

export default Label;
