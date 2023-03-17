import React, { useState, useCallback, useRef } from 'react';
import { default as ReactModal } from 'react-modal';
import { Section, TextValues } from './styles';
import Button from 'components/ui/button';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { CurrencyInput } from 'components/ui/input';
import { NumberToReais } from 'utils/printHelper';

import { useAlert } from 'hooks';
import { useShoppingBag } from 'hooks/shoppingBag';
import ButtonSelect from 'components/ui/ButtonSelect';
import { CartaoTransporte } from 'dtos/CartaoTransporte';
import { Column } from 'components/ui/layout';
import { CartaoTransporteValid } from 'validations';
import CartaoTransporteApi from 'services/apis/cartaoTransporteApi';
import { ModalAlert } from 'components/ui/modal';
import { Small } from 'components/ui/typography';
import Loading from 'components/ui/loading';

interface ModalRecargaProps {
  card: CartaoTransporte;
  onClose: () => void;
}

interface FormData {
  OutroValor?: string;
}

const isSmallWidth = window.matchMedia('(max-width: 1000px)').matches;

const isSmallHeight = window.matchMedia('(max-height: 500px)').matches;

const customStyles = {
  content: isSmallWidth
    ? {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: isSmallHeight ? '100vmin' : '90vmin',
        borderRadius: '15px',
        overflow: 'visible',
        padding: '10px 20px',
      }
    : {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '540px',
        height: '595px',
        borderRadius: '15px',
        overflow: 'visible',
        paddingLeft: '90px',
        paddingRight: '90px',
      },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

const operatorsValues = [
  {
    value: 10,
    text: 'R$ 10,00',
  },
  {
    value: 15,
    text: 'R$ 15,00',
  },
  {
    value: 20,
    text: 'R$ 20,00',
  },
  {
    value: 30,
    text: 'R$ 30,00',
  },
  {
    value: 45,
    text: 'R$ 45,00',
  },
  {
    value: 50,
    text: 'R$ 50,00',
  },
  {
    value: -1,
    text: 'Outro valor',
  },
];

const ModalRecarga: React.FC<ModalRecargaProps> = ({ card, onClose }) => {
  const [outroValor, setOutroValor] = useState(false);
  const [selectedValue, setSelectedValue] = useState<number>(null);
  const [modalIvalido, setModalIvalido] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { addAlert } = useAlert();
  const formRef = useRef<FormHandles>(null);
  const { addShoppingBag } = useShoppingBag();

  const handleChangeOperators = useCallback(value => {
    let tmpValue = value;
    if (tmpValue >= 0) {
      setOutroValor(false);
    } else {
      setOutroValor(true);
    }
    setSelectedValue(tmpValue);
  }, []);

  const handleSubmit = useCallback(
    async (data: FormData) => {
      setLoading(true);
      const min = card.ValorRecargaMinima;
      const max = card.ValorRecargaMaxima;
      let valor = selectedValue;
      if (selectedValue !== -1) {
        if (!selectedValue.between(min, max)) {
          window.scrollTo(0, 0);
          const msg = `Selecione um valor entre R$ ${min} e R$ ${max}`;
          addAlert({ title: msg, type: 'info' });
          setLoading(false);
          return;
        }
      } else {
        const valid = await CartaoTransporteValid.ValidarRecarga(data, formRef, min, max);
        if (!valid) {
          setLoading(false);
          return;
        }
        valor = Number(data.OutroValor.replace(/[^,\d]/g, '').replace(',', '.'));
      }
      const cardValid = await CartaoTransporteApi.Validar(card.Codigo);
      if (!cardValid) {
        setLoading(false);
        setModalIvalido(true);
        return;
      }
      addShoppingBag({
        Nome: 'Recarga Cartão de Transporte',
        Detalhes: card.Nome,
        CodigoUsuarioCartao: card.Codigo,
        CodigoUsuario: card.CodigoUsuario,
        ValorRecarga: valor,
        TipoPedido: 1,
        CodigoTipoCartao: card.CodigoTipoCartao,
        CodigoAssinante: '',
        CodigoOperadora: card.CodigoOperadora,
        NumeroCartao: card.Numero,
        ValorSaldo: card.Saldo,
      });
      setLoading(false);
      onClose();
      window.scrollTo(0, 0);
      addAlert({
        title: 'Recarga adicionada ao carrinho',
        type: 'success',
      });
    },
    [card, selectedValue, addAlert, addShoppingBag,onClose],
  );

  return (
    <>
      <ReactModal
        style={customStyles}
        isOpen={true}
        onRequestClose={onClose}
        contentLabel="Recarga de transporte"
        className=""
      >
        <Loading loading={loading} />
        <Form onSubmit={handleSubmit} ref={formRef}>
          <h3 className="text-center">Recarga de transporte</h3>
          <Section>
            <ButtonSelect
              name="ValorRecarga"
              onChange={handleChangeOperators}
              buttonOptions={operatorsValues.map(operatorValue => {
                return {
                  text: operatorValue.text,
                  value: operatorValue.value,
                };
              })}
            />
          </Section>
          {outroValor && (
            <>
              <InputLabel className="font-weight-bold">Outro valor:</InputLabel>
              <CurrencyInput name="OutroValor" props={{ placeholder: 'Recarga de cartão' }} />
            </>
          )}

          <TextValues>
            Valor mínimo de {NumberToReais(card.ValorRecargaMinima)} valor máximo de{' '}
            {NumberToReais(card.ValorRecargaMaxima)}.
          </TextValues>
          <FormControl variant="outlined" style={{ display: 'flex' }}></FormControl>
          <FormControl variant="outlined" style={{ display: 'flex' }}>
            <InputLabel id="demo-simple-select-outlined-label"></InputLabel>
          </FormControl>
          <FormControl variant="outlined" style={{ display: 'flex' }}>
            <InputLabel id="demo-simple-select-outlined-label" />
          </FormControl>
          <Column gap="12px">
            <Button type="submit" disabled={loading}>
              Confirmar Recarga
            </Button>
            <Button theme="light" onClick={() => onClose()}>
              Cancelar
            </Button>
          </Column>
        </Form>
      </ReactModal>
      {modalIvalido && (
        <ModalAlert title="Atenção" onClose={() => setModalIvalido(false)} minWidth="350px">
          <Small>
            O seu cartão transporte não é válido para realizar a recarga. Consulte a operadora do
            seu cartão de transporte e verifique se ele está ativo.
          </Small>
          <Button onClick={() => setModalIvalido(false)}>OK</Button>
        </ModalAlert>
      )}
    </>
  );
};

export default ModalRecarga;
