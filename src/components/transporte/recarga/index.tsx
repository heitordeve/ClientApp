import React, { useState, useEffect, useCallback } from 'react';
import TransportCard from '../../TransportCard';
import { Container } from '../cartoes/styles';
import { useAuth } from 'hooks/auth';
import Loading from '../../ui/loading';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HeaderLinkHolder } from '../../../pages/Shopping/styles';
import HeaderLink, { FakeHeaderLink } from '../../HeaderLink';
import { useAlert } from '../../../hooks/alert';

import MPERevalidation from '../../MPERevalidation';
import CidadeApi from '../../../services/apis/cidadeApi';
import { CartaoTransporte } from '../../../dtos/CartaoTransporte';
import { useParams } from 'react-router-dom';
import { useTransporte } from '../../../hooks/transporteHook';
import { Cidade } from 'dtos/cidades';
import { TransporteContext } from '../hooks/cartaoTransporteHook';

const cardLimit: number = 5;

interface TransporteQrCodeProps {
  codigoOperadora: string;
}

const RecargaTransporte: React.FC = () => {
  let { codigoOperadora } = useParams<TransporteQrCodeProps>();
  const { user } = useAuth();
  const [cards, setCards] = useState<CartaoTransporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState<Cidade[]>([]);
  const { getCartoes } = useTransporte();

  const [requestOpenMPE, setRequestOpenMPE] = useState<
    (card: CartaoTransporte) => void
  >();
  const { addAlert } = useAlert();

  useEffect(() => {
    (async () => {
      const cidades = await CidadeApi.Listar();
      setCities(cidades);
    })();
  }, [user, addAlert]);

  useEffect(() => {
    setLoading(false);
    var tmpCartoes = getCartoes(Number(codigoOperadora));
    while (tmpCartoes.length < cardLimit) {
      tmpCartoes.push(undefined);
    }
    setCards(tmpCartoes);
  }, [getCartoes,codigoOperadora]);

  const getRequestOpen = useCallback(
    (requestOpen: (card: CartaoTransporte) => void) => {
      setRequestOpenMPE(() => requestOpen);
    },
    [],
  );

  return (
    <>
      <Container>
        <Loading loading={loading} />
        <div className="d-flex w-100  pl-3">
          <HeaderLinkHolder>
            <HeaderLink to="/">Home&nbsp;</HeaderLink>
            <FakeHeaderLink className="highlight">
              / Recarga de Transporte
            </FakeHeaderLink>
          </HeaderLinkHolder>
        </div>
        <div className="text-center">
          <h3 className="font-weight-bold mt-3 mb-5">Recarga de Transporte</h3>
        </div>
        <span className="d-flex flex-row flex-wrap justify-content-center align-items-center">
          <TransporteContext.Provider
            value={{ cidades: cities, requestOpenMPE: requestOpenMPE }}
          >
            {cards?.map((card, i) => {
              return <TransportCard key={'transport-card-' + i} card={card} />;
            })}
          </TransporteContext.Provider>
        </span>
      </Container>
      <MPERevalidation
        requestOpenProvider={getRequestOpen}
        setLoading={setLoading}
      />
    </>
  );
};

export default RecargaTransporte;
