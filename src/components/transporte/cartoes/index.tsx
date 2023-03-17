import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { useAuth, useAlert, useTransporte } from 'hooks';
import { TransporteContext } from '../hooks/cartaoTransporteHook';

import MPERevalidation from '../../MPERevalidation';
import CartaoDeTransporte from './cartao/Card';
import NovoCartaoTransporte from './cartao/novo';
import { Row } from 'components/ui/layout';
import { FullBackMain } from 'components/ui/main';

import { CartaoTransporte as CartaoTransporteDto } from 'dtos/CartaoTransporte';
import { Cidade } from 'dtos/cidades';

import CidadeApi from 'services/apis/cidadeApi';

interface CartoesTransporteParms {
  codigoOperadora: string;
}

const CartoesTransporte: React.FC = () => {
  const { user } = useAuth();
  let { codigoOperadora } = useParams<CartoesTransporteParms>();
  const [cards, setCards] = useState<CartaoTransporteDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState<Cidade[]>([]);
  const { getCartoes } = useTransporte();

  const [requestOpenMPE, setRequestOpenMPE] = useState<(card: CartaoTransporteDto) => void>();

  const { addAlert } = useAlert();

  const updateCartoes = useCallback(() => {
    setLoading(false);
    var tmpCartoes = getCartoes();
    setCards(
      tmpCartoes?.filter(
        c =>
          !c.HasQrCode &&
          ((codigoOperadora && c.CodigoOperadora === Number(codigoOperadora)) || !codigoOperadora),
      ),
    );
  }, [setLoading, getCartoes, codigoOperadora]);

  useEffect(() => {
    (async () => {
      const cidades = await CidadeApi.Listar();
      setCities(cidades);
    })();
  }, [user, addAlert]);

  useEffect(() => {
    updateCartoes();
  }, [updateCartoes]);

  const getRequestOpen = useCallback((requestOpen: (card: CartaoTransporteDto) => void) => {
    setRequestOpenMPE(() => requestOpen);
  }, []);

  return (
    <>
      <FullBackMain title="Recarga de Transporte" loading={loading} backUrl="/">
        <Row wrapp justify="center" gap="12px">
          <TransporteContext.Provider value={{ cidades: cities, requestOpenMPE: requestOpenMPE }}>
            {cards?.map((card, i) => {
              return <CartaoDeTransporte key={card?.Codigo} card={card} />;
            })}
            <NovoCartaoTransporte />
          </TransporteContext.Provider>
        </Row>
      </FullBackMain>
      <MPERevalidation requestOpenProvider={getRequestOpen} setLoading={setLoading} />
    </>
  );
};

export default CartoesTransporte;
