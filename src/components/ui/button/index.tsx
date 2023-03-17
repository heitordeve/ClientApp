import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

import { Container } from './styles';
import SelectButton from './selectButton';
import IconButton from './iconButton';
import { ColorScheme, schemeMap, Scheme } from '../../../styles/consts';
import Fab, { FabContainer } from './fab';

export interface ButtonProps
  extends Omit<
    DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
    'ref' | 'border' | 'color'
  > {
  loading?: boolean;
  theme?: 'default' | 'light' | 'outlined';
  color?: ColorScheme;
  type?: 'button' | 'submit' | 'reset';
  grow?: number | string;
  flex?: number | string;
  pointed?: boolean;
  border?: boolean;
  padding?: string;
  as?: React.ElementType;
}
interface SchemeBtn {
  background?: (scheme: Scheme) => string;
  color: (scheme: Scheme) => string;
  border?: (scheme: Scheme) => string;
}
export const schemeBtnMap = new Map<string, SchemeBtn>();
schemeBtnMap.set('default', {
  background: (scheme: Scheme) => scheme.color,
  color: (scheme: Scheme) => scheme.text,
});
schemeBtnMap.set('light', {
  background: (scheme: Scheme) => scheme.accent,
  color: (scheme: Scheme) => scheme.color,
});
schemeBtnMap.set('outlined', {
  color: (scheme: Scheme) => scheme.color,
  border: (scheme: Scheme) => `1px solid ${scheme.color}`,
});

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      loading,
      type,
      padding,
      pointed = false,
      color = 'primary',
      theme = 'default',
      border = false,
      as = 'button',
      ...rest
    },
    ref,
  ) => {
    const schemeColor = schemeMap.get(color);
    const schemeBtn = schemeBtnMap.get(theme);
    return (
      <Container
        background={schemeBtn.background?.(schemeColor)}
        textColor={schemeBtn.color(schemeColor)}
        border={border ? schemeBtn.border?.(schemeColor) : null}
        type={type ?? 'button'}
        padding={padding ?? '0px 16px'}
        ref={ref}
        as={as}
        {...rest}
      >
        {loading ? 'Carregando...' : children}
      </Container>
    );
  },
);

export { SelectButton, IconButton, Fab, FabContainer };
export default Button;
