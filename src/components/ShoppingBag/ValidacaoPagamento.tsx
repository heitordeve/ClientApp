import React, { useState } from 'react';
import { FiChevronLeft } from 'react-icons/fi';
import FunctionalityCard from '../FunctionalityCard';
import Input from '../ui/input/v2';

import Button from '../ui/button';
import { InnerParagraph, InnerTiltle, PaymentHeader, ReturnIconHolder } from './styles';
import { PaymentTypeEnum } from '../../utils/resources';
import { PaymentOption, ShoppingBagResume } from './models';
import { Column, Row } from '../ui/layout';
import { useAuth } from '../../hooks/auth';
import Modal from '../ui/modal';
import { Title } from '../ui/typography';
import FormDadosComplementares from 'components/formularios/formDadosComplementares';
interface ValidacaoPagamentoProps {
  payment: PaymentOption;
  bagResume: ShoppingBagResume;
  goToResume: () => void;
}
const ValidacaoPagamento: React.FC<ValidacaoPagamentoProps> = ({
  payment,
  bagResume,
  goToResume,
}) => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState<boolean>(true);
  const usuarioValido = user.NomeMae && user.SexoUsuario && user.DataNascimentoUsuario;

  const ModelModalDadosUssuario = () => (
    <Modal
      title="Compra com cartão:"
      minWidth="400px"
      onClose={() => setShowModal(false)}
      isOpen={showModal}
    >
      <Column gap="12px">
        <Title>Confirme as informações abaixo para continuar sua compra:</Title>
        <FormDadosComplementares submitLable="Enviar" />
      </Column>
    </Modal>
  );

  const ModelCarato = () => (
    <>
      <InnerParagraph className="mb-2 font-weight-bold">{bagResume.cardDescription}</InnerParagraph>
      <Column>
        <InnerParagraph className="mb-2">Digite o CVV do cartão de crédito</InnerParagraph>
        <Row align="center">
          <Input name="CreditCardCVV" mask="cvv" />
        </Row>
      </Column>
      {usuarioValido ? (
        <Button type="submit">Finalizar</Button>
      ) : (
        <>
          <Button onClick={() => setShowModal(true)}>Finalizar</Button>
          <ModelModalDadosUssuario />
        </>
      )}
    </>
  );
  const ModelCarteira = () => (
    <>
      <InnerParagraph>Insira a senha da conta digital</InnerParagraph>
      <Input name="WalletPassword" type="password" />
      <Button type="submit">Finalizar</Button>
    </>
  );
  const modelsMap = new Map<PaymentTypeEnum, () => JSX.Element>();
  modelsMap.set(PaymentTypeEnum.CreditCard, ModelCarato);
  modelsMap.set(PaymentTypeEnum.Wallet, ModelCarteira);
  return (
    <FunctionalityCard title={payment?.label.name} color="#672ED7">
      <Column gap="12px">
        <PaymentHeader>
          <ReturnIconHolder>
            <FiChevronLeft onClick={goToResume} />
          </ReturnIconHolder>
          <InnerTiltle>Finalize o pagamento</InnerTiltle>
        </PaymentHeader>
        <Column gap="12px" align="center">
          {modelsMap.get(payment?.formaPagamento)()}
        </Column>
      </Column>
    </FunctionalityCard>
  );
};

export default ValidacaoPagamento;
