import React from 'react';
import { IconType } from 'react-icons';
import { colorMap } from 'styles/consts';

export interface IconBaseProps extends React.SVGAttributes<SVGElement> {
  children?: React.ReactNode;
  size?: string | number;
  color?: string;
  title?: string;
}

export type BaseIconType = (props: IconBaseProps, component: IconType) => JSX.Element;

const BaseIcon: React.FC<IconBaseProps> = ({ size = '24px', color, children, ...rest }) => {
  const hex = colorMap.get(color);
  return (
    <svg width={size} height={size} color={hex} {...rest} xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
};

export default BaseIcon;
