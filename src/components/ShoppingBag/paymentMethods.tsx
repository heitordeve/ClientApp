import React from 'react';
import FunctionalityCard from '../FunctionalityCard/index';
import {
  CardBox,
  CardBoxTail,
  InnerTiltle,
  ScrollBox,
  ProductLabel,
  PaymentHeader,
} from './styles';
import { FiChevronLeft } from 'react-icons/fi';
import { ReturnIconHolder } from './styles';
import { CustomRadioButton, CustomRadioOptionProps } from '../ui/radioButton/index';
import { ShoppingBagData } from '../../dtos/ShoppingBagData';
import { ShoppingBagResume } from './models';
import ResumeValue from './resumeValue';
import { Column, Row } from 'components/ui/layout';
import { P, Caption, Subhead } from 'components/ui/typography/v2';

interface PaymentMethodsProps {
  goToList: () => void;
  renderPayments: () => CustomRadioOptionProps[];
  goAfterPayment: () => void;
  shoppingBag: ShoppingBagData[];
  resume: ShoppingBagResume;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  goToList,
  renderPayments,
  goAfterPayment,
  shoppingBag,
  resume,
}) => {
  return (
    <>
      <FunctionalityCard title="Formas de Pagamento" color="#672ED7">
        <PaymentHeader>
          <ReturnIconHolder>
            <FiChevronLeft onClick={goToList} />
          </ReturnIconHolder>
          <InnerTiltle>Como você prefere pagar?</InnerTiltle>
        </PaymentHeader>
        <ScrollBox>
          <CustomRadioButton
            key="FormaPagamentoCustomRadioButton"
            name="FormaPagamento"
            divProps={{
              style: {
                display: 'flex',
                flexDirection: 'column',
              },
            }}
            options={renderPayments()}
          />
        </ScrollBox>
      </FunctionalityCard>
      <FunctionalityCard
        title="Resumo da Compra"
        color="#672ED7"
        components={{
          action: {
            text: 'Continuar',
            onClick: goAfterPayment,
          },
        }}
      >
        <Column height="100%">
          <Row flex="1">
            <ScrollBox style={{ flex: '1' }}>
              {shoppingBag.map((element, index) => (
                <CardBox>
                  <ProductLabel>
                    <Subhead size="B">{element.Nome}</Subhead>
                    <P>{element.Detalhes}</P>
                    {element.NumeroCartao && (
                      <Caption color="primary">{element.NumeroCartao}</Caption>
                    )}
                  </ProductLabel>
                  <CardBoxTail>
                    <P size="B">{element.ValorRecarga.toMoneyString()}</P>
                  </CardBoxTail>
                </CardBox>
              ))}
            </ScrollBox>
          </Row>
          <ResumeValue resume={resume} />
        </Column>
      </FunctionalityCard>
    </>
  );
};

export default PaymentMethods;
