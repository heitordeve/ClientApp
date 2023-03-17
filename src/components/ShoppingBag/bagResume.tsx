import React from 'react';
import FunctionalityCard from '../FunctionalityCard/index';
import { NumberToReais } from '../../utils/printHelper';
import {
  CardBox,
  CardBoxTail,
  InnerParagraph,
  InnerThumbnail,
  InnerTiltle,
  InnerSmallLabel,
  ScrollBox,
  ProductLabel,
  InnerIcon,
  InnerHr,
} from './styles';
import { ObterListaCupomDescontoResponse, PaymentOption, ShoppingBagResume } from './models';

import { ShoppingBagData } from '../../dtos/ShoppingBagData';
import { PaymentTypeEnum } from '../../utils/resources';
import Button from '../ui/button';
import Input from '../ui/input';
import { CustomRadioButton } from '../ui/radioButton/index';
import { FiTag } from 'react-icons/fi';
import { Column } from '../ui/layout';
import ResumeValue from './resumeValue';

interface BagResumeProps {
  next: () => void;
  isSmallWidth: boolean;
  selectedPayment: PaymentOption;
  selectedCupom: ObterListaCupomDescontoResponse;
  resume: ShoppingBagResume;
  shoppingBag: ShoppingBagData[];
  cupomText: string;
  onNewCupomChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  addCupom: () => void;
  onSelectedCupomChange: (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
  cupons: ObterListaCupomDescontoResponse[];
}

const BagResume: React.FC<BagResumeProps> = ({
  next,
  isSmallWidth,
  selectedPayment,
  selectedCupom,
  resume,
  shoppingBag,
  cupomText,
  onNewCupomChange: handleNewCupomChange,
  addCupom,
  onSelectedCupomChange: handleSelectedCupomChange,
  cupons,
}) => {
  return (
    <>
      {isSmallWidth &&
        document.querySelector<HTMLFormElement>('#modalShopping > form').scrollTo({
          top: -1000,
        })}
      <FunctionalityCard
        title="Resumo da compra"
        color="#672ED7"
        components={{
          action: {
            text: 'Finalizar',
            onClick: next,
          },
        }}
      >
        <Column maxHeight="100%">
          <InnerTiltle>Itens do Pedido</InnerTiltle>
          <ScrollBox>
            {shoppingBag.map((element, index) => (
              <CardBox>
                <ProductLabel>
                  <InnerTiltle>{element.Nome}</InnerTiltle>
                  <InnerSmallLabel>{element.Detalhes}</InnerSmallLabel>
                </ProductLabel>
                <CardBoxTail>
                  <InnerParagraph>
                    <b>{NumberToReais(element.ValorRecarga)}</b>
                  </InnerParagraph>
                  {selectedPayment && (
                    <InnerSmallLabel>{`+ ${NumberToReais(
                      selectedPayment.apiResponse.ValorTaxas[index],
                    )} (conveniência)`}</InnerSmallLabel>
                  )}
                </CardBoxTail>
              </CardBox>
            ))}
          </ScrollBox>
          <InnerTiltle>Forma de pagamento</InnerTiltle>
          <CardBox className="responsive">
            <InnerIcon>{selectedPayment?.label.icon}</InnerIcon>
            <ProductLabel>
              <InnerTiltle>{selectedPayment?.label.name}</InnerTiltle>
              <InnerSmallLabel>
                Cashback {NumberToReais(selectedPayment?.apiResponse.VlCashBack)}
              </InnerSmallLabel>
            </ProductLabel>
            {selectedPayment?.formaPagamento === PaymentTypeEnum.CreditCard && (
              <CardBoxTail className="responsive">
                <InnerTiltle className="highlight">{resume.cardDescription}</InnerTiltle>
              </CardBoxTail>
            )}
          </CardBox>
          <ResumeValue resume={resume} />
        </Column>
      </FunctionalityCard>
      <FunctionalityCard title="Cupom" color="#672ED7">
        <Column gap="12px">
          <Input
            name="Cupom"
            props={{
              value: cupomText,
              placeholder: 'Insira o código do cupom',
              onChange: handleNewCupomChange,
            }}
          />
          <Button onClick={addCupom}>Adicionar Cupom</Button>
        </Column>
        <InnerHr />
        <ScrollBox>
          <CustomRadioButton
            key="SelectedCupomCustomRadioButton"
            name="SelectedCupom"
            divProps={{
              style: {
                display: 'flex',
                flexDirection: 'column',
              },
            }}
            options={[
              {
                props: {
                  id: 'cupom-0',
                  defaultChecked: true,
                  value: -1,
                  onClick: handleSelectedCupomChange,
                },
                render: input => (
                  <CardBox key="radioCupom0">
                    {input}
                    <InnerTiltle>Não utilizar nenhum cupom</InnerTiltle>
                  </CardBox>
                ),
              },
              ...cupons.map(e => {
                let val = new Date(e.Cupom.DataValidade);
                return {
                  props: {
                    id: 'cupom-' + e.CodigoCupomDesconto,
                    value: e.CodigoCupomDesconto,
                    onClick: handleSelectedCupomChange,
                  },
                  render: (input: React.ReactNode) => (
                    <CardBox key={'radioCupom' + e.CodigoCupomDesconto}>
                      {input}
                      <InnerThumbnail color="#672ED7">
                        <FiTag size={25} />
                      </InnerThumbnail>
                      <ProductLabel>
                        <InnerTiltle>{e.Cupom.Cupom}</InnerTiltle>
                        <InnerSmallLabel>
                          Desconto de {e.Cupom.PercentualDesconto}% | Validade: {val.getDate()}/
                          {val.getMonth() + 1}/{val.getFullYear()}
                        </InnerSmallLabel>
                      </ProductLabel>
                    </CardBox>
                  ),
                };
              }),
            ]}
          />
        </ScrollBox>
      </FunctionalityCard>
    </>
  );
};

export default BagResume;
