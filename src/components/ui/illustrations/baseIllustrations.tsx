import React from 'react';
import { colorMap } from 'styles/consts';

export interface IllustrationBaseProps extends React.SVGAttributes<SVGElement> {
  children?: React.ReactNode;
  size?: string | number;
  color?: string;
  title?: string;
}
export declare type IllustrationType = (props: IllustrationBaseProps) => JSX.Element;

const BaseIllustrations: React.FC<IllustrationBaseProps> = ({ size, color, children, ...rest }) => {
  const hex = colorMap.get(color);
  return (
    <svg width={size} height={size} color={hex} {...rest} xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
};

export default BaseIllustrations;
