import React, { useState, useCallback, useRef } from 'react';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import { default as ReactModal } from 'react-modal';
import { Card, Section, TextValues } from './styles';
import Button from '../../ui/button';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { CurrencyInput } from '../../ui/input';
import { NumberToReais } from '../../../utils/printHelper';

import { useAlert } from '../../../hooks/alert';
import { useShoppingBag } from '../../../hooks/shoppingBag';
import ButtonSelect from '../../ui/ButtonSelect';
import { CartaoTransporte } from '../../../dtos/CartaoTransporte';
import { Column } from '../../ui/layout';
import { CartaoTransporteValid } from '../../../validations';
import CartaoTransporteApi from 'services/apis/cartaoTransporteApi';
import { ModalAlert } from '../../ui/modal';
import { Small } from '../../ui/typography';
import Loading from 'components/ui/loading';
interface CardProps {
  card: CartaoTransporte;
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

const TransportCard: React.FC<CardProps> = ({ card }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [outroValor, setOutroValor] = useState(false);
  const [selectedValue, setSelectedValue] = useState<number>(null);
  const [modalIvalido, setModalIvalido] = useState<boolean>(false);
  const [validando, setValidando] = useState<boolean>(false);
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
      setValidando(true);
      const min = card.ValorRecargaMinima;
      const max = card.ValorRecargaMaxima;
      let valor = selectedValue;
      if (selectedValue !== -1) {
        if (!selectedValue.between(min, max)) {
          window.scrollTo(0, 0);
          const msg = `Selecione um valor entre R$ ${min} e R$ ${max}`;
          addAlert({ title: msg, type: 'info' });
          setValidando(false);
          return;
        }
      } else {
        const valid = await CartaoTransporteValid.ValidarRecarga(
          data,
          formRef,
          min,
          max,
        );
        if (!valid) {
          setValidando(false);
          return;
        }
        valor = Number(
          data.OutroValor.replace(/[^,\d]/g, '').replace(',', '.'),
        );
      }
      const cardValid = await CartaoTransporteApi.Validar(card.Codigo);
      if (!cardValid) {
        setValidando(false);
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
      setValidando(false);
      setIsOpen(false);
      window.scrollTo(0, 0);
      addAlert({
        title: 'Recarga adicionada ao carrinho',
        type: 'success',
      });
    },
    [card, selectedValue, addAlert, addShoppingBag],
  );

  return (
    <Card className="text-center">
      <img src={card.urlLogoOperadora} alt={card.urlLogoOperadora} />
      <p className="titleCard">{card.Nome}</p>
      <p className="subCard">Nº Cartão:</p>
      <p className="textCard">{card.Numero}</p>
      <div className="d-flex justify-content-between mt-3 mr-1 ml-1">
        <div className="text-left">
          <p className="pCard">Saldo estimado</p>
          <p className="textCards">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(card.Saldo)}
          </p>
        </div>
        {card.DataUltimoUso instanceof Date && (
          <div className="text-right">
            <p className="pCard">Último uso</p>
            <p>
              {('0' + card.DataUltimoUso.getDate()).slice(-2)}/
              {('0' + card.DataUltimoUso.getMonth()).slice(-2)}/
              {card.DataUltimoUso.getFullYear()}{' '}
              {('0' + card.DataUltimoUso.getHours()).slice(-2)}:
              {('0' + card.DataUltimoUso.getMinutes()).slice(-2)}
            </p>
          </div>
        )}
      </div>

      <Button
        className="btnRecharge mt-3 font-weight-bold"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <RiMoneyDollarCircleLine size={25} onClick={() => card} /> Recarregar
      </Button>
      <ReactModal
        style={customStyles}
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        contentLabel="Recarga de transporte"
        className=""
      >
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
              <CurrencyInput
                name="OutroValor"
                props={{ placeholder: 'Recarga de cartão' }}
              />
            </>
          )}

          <TextValues>
            Valor mínimo de {NumberToReais(card.ValorRecargaMinima)} valor
            máximo de {NumberToReais(card.ValorRecargaMaxima)}.
          </TextValues>
          <FormControl
            variant="outlined"
            style={{ display: 'flex' }}
          ></FormControl>
          <FormControl variant="outlined" style={{ display: 'flex' }}>
            <InputLabel id="demo-simple-select-outlined-label"></InputLabel>
          </FormControl>
          <FormControl variant="outlined" style={{ display: 'flex' }}>
            <InputLabel id="demo-simple-select-outlined-label" />
          </FormControl>
          <Column gap="12px">
            <Button type="submit" disabled={validando}>
              Confirmar Recarga
            </Button>
            <Button theme="light" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
          </Column>
        </Form>
      </ReactModal>
      {modalIvalido && (
        <ModalAlert
          title="Atenção"
          onClose={() => setModalIvalido(false)}
          minWidth="350px"
        >
          <Small>
            O seu cartão transporte não é válido para realizar a recarga.
            Consulte a operadora do seu cartão de transporte e verifique se ele
            está ativo.
          </Small>
          <Button onClick={() => setModalIvalido(false)}>OK</Button>
        </ModalAlert>
      )}
      <Loading loading={validando} />
    </Card>
  );
};

export default TransportCard;
