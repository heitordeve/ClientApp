import React from 'react';
import styled from 'styled-components';
import {
  ColorScheme,
  colorMap,
  Scheme,
  schemeMap,
  white,
  gray3,
  TextColor,
} from '../../../styles/consts';
import { BaseFlexProps, Row } from '../layout';
import AlertCard from './alertCard';
import ItemCard from './itemCard';
import { cssIf } from 'styles';
export interface CardProps extends BaseFlexProps {
  children?: React.ReactNode;
  grow?: string;
  radius?: string;
  color?: ColorScheme;
  border?: boolean | ColorScheme;
  margin?: string;
  theme?: 'defalt' | 'light' | 'border' | 'accent';
  className?: string;
}

interface SchemeCard {
  background: (scheme: Scheme) => string;
  color: (scheme: Scheme) => string;
  border: (scheme: Scheme, isActived: boolean) => string;
}
const schemeCardMap = new Map<string, SchemeCard>();
schemeCardMap.set('defalt', {
  background: (scheme: Scheme) => scheme.color,
  color: (scheme: Scheme) => scheme.text,
  border: (scheme: Scheme, isActived: boolean) => (isActived ? gray3 : white),
});
schemeCardMap.set('accent', {
  background: (scheme: Scheme) => scheme.color,
  color: (scheme: Scheme) => scheme.accent,
  border: (scheme: Scheme, isActived: boolean) => (isActived ? scheme.accent : white),
});
schemeCardMap.set('light', {
  background: (scheme: Scheme) => scheme.accent,
  color: (scheme: Scheme) => scheme.color,
  border: (scheme: Scheme, isActived: boolean) => (isActived ? scheme.color : scheme.accent),
});
schemeCardMap.set('border', {
  background: (scheme: Scheme) => white,
  color: (scheme: Scheme) => TextColor,
  border: (scheme: Scheme, isActived: boolean) => scheme.color,
});

interface CardContainerProps extends BaseFlexProps {
  border: string;
  margin: string;
  radius: string;
  color?: string;
}

const CardContainer = styled(Row)<CardContainerProps>`
  margin: ${props => props.margin ?? '0px'};
  display: flex;
  border: 1px solid #ffffffff;
  border-color: ${props => props.border};
  border-radius: ${props => props.radius};
  background-color: ${props => props.background};
  ${({ color }) => cssIf('color', color)};
  &.border {
    border-color: ${colorMap.get('gray-2')} !important;
  }
  &.center {
    -webkit-box-align: center;
    align-items: center;
  }
  &.column {
    flex-direction: column;
  }
`;

export const Card: React.FC<CardProps> = ({
  radius,
  border,
  color = 'white',
  theme = 'defalt',
  children,
  className,
  margin,
  padding,
  colorText,
  ...rest
}) => {
  const schemeColor = schemeMap.get(color);
  const schemeCard = schemeCardMap.get(theme);
  const hexBoerder =
    typeof border === 'boolean' ? schemeCard.border(schemeColor, border) : colorMap.get(border);
  return (
    <CardContainer
      flex="1"
      radius={radius ?? '10px'}
      padding={padding ?? '10px'}
      border={hexBoerder}
      margin={margin}
      background={schemeCard.background(schemeColor)}
      color={colorText ? null : schemeCard.color(schemeColor)}
      className={className}
      colorText={colorText}
      {...rest}
    >
      {children}
    </CardContainer>
  );
};
export { AlertCard, ItemCard };
export default Card;
