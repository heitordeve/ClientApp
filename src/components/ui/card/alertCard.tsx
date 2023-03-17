import React from 'react';
import { Card, CardProps } from '.';
import { Column } from '../layout';
import { Title, Small } from '../typography';

interface AlertCardProps extends CardProps {
  titulo: string;
  texto?: string;
  children?: React.ReactNode;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  color = 'warning',
  titulo,
  texto,
  children,
  ...rest
}) => {
  return (
    <Card color={color} theme="light" {...rest} flex="0">
      <Column padding="12px">
        <Title>{titulo}</Title>
        <Small>{texto ?? children}</Small>
      </Column>
    </Card>
  );
};

export default AlertCard;
