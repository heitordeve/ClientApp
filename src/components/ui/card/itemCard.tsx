import React from 'react';
import { Card, CardProps } from '.';
import Button from '../button';
import { IcRight } from '../icons';
import { Column, Row } from '../layout';

interface AlertCardProps extends CardProps {
  children?: React.ReactNode;
  footer?: React.ReactNode;
  onClick: () => void;
}

export const ItemCard: React.FC<AlertCardProps> = ({ children, footer, onClick }) => {
  return (
    <Card className="border" flex="0">
      <Row flex="1">
        <Column flex="1" justify="center" padding="24px 18px" gap="6px">
          {children}
        </Column>
        <Column justify="center">
          <Button theme="light" onClick={() => onClick()}>
            <IcRight size="30" />
          </Button>
        </Column>
      </Row>
      {footer && <Column gap="8px">{footer}</Column>}
    </Card>
  );
};

export default ItemCard;
