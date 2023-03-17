import React from 'react';
import { ShoppingBagResume } from './models';
import { Column, Row } from 'components/ui/layout';
import { Caption, P } from 'components/ui/typography/v2';

interface ResumeItemsProps {
  resume: ShoppingBagResume;
}

const ResumeValue: React.FC<ResumeItemsProps> = ({ resume }) => {
  const subtotal = resume.total ?? 0;
  const valorEntrega = resume.valorEntrega ? resume.valorEntrega : 0;
  const conveniencias = resume.totalTaxas ? resume.totalTaxas : 0;
  const total = subtotal + valorEntrega + conveniencias;
  return (
    <Column gap="6px">
      <Row justify="space-between">
        <Caption>Subtotal</Caption>
        <Caption>{subtotal.toMoneyString()}</Caption>
      </Row>
      <Row justify="space-between">
        <Caption>Entrega</Caption>
        <Caption>{valorEntrega.toMoneyString()}</Caption>
      </Row>
      <Row justify="space-between">
        <Caption>Conveniência</Caption>
        <Caption>{conveniencias.toMoneyString()}</Caption>
      </Row>
      <hr />
      <Row justify="space-between">
        <P size="B">Total</P>
        <P size="B">{total.toMoneyString()}</P>
      </Row>
    </Column>
  );
};

export default ResumeValue;
