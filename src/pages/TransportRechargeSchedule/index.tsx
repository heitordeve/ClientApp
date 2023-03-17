import React, { useState, useCallback, createContext, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { useAuth, useCreditCard } from 'hooks';
import { CreditCardData } from 'hooks/creditCard';

import { RecargaAutomaticaApi, RecargaProgramadaApi } from 'services/apis';

import AutoTrandportRechargeSchedule from './Auto';
import ProgTrandportRechargeSchedule from './Prog';
import { Container, RouterHeader } from './styles';

import Loading from 'components/ui/loading';
import HeaderLink, { FakeHeaderLink } from 'components/HeaderLink';

import { CartaoTransporte } from 'dtos/CartaoTransporte';
import { RecargaAutomatica, RecargaProgramada } from 'dtos/Recarga';
import { Column, Flex } from 'components/ui/layout';
import { PATHS } from 'routes/rotas-path';

export const DeleteModalStyle = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    margin: 'auto',
    borderRadius: '10px',
    padding: '20px',
    width: '350px',
    left: '0',
    right: '0',
    bottom: 'auto',
    border: 'none',
  },
};

interface TransportRechargeScheduleContextProps {
  reload(): void;
  cardData: CartaoTransporte;
  cardList: CreditCardData[];
  setLoading(value: ((prev: boolean) => boolean) | boolean): void;
}

export const TransportRechargeScheduleContext =
  createContext<TransportRechargeScheduleContextProps>(undefined);

interface TrandportRechargeScheduleParms {
  id: string;
}

const TrandportRechargeSchedule: React.FC = () => {
  const { user } = useAuth();
  const { creditCardList } = useCreditCard();
  let { id } = useParams<TrandportRechargeScheduleParms>();
  const history = useHistory();

  const [automatica, setAutomatica] = useState<RecargaAutomatica>();
  const [programada, setProgramada] = useState<RecargaProgramada>();
  const [loading, setLoading] = useState<boolean>(false);
  const [cardList, setCardList] = useState<CreditCardData[]>([]);

  const loadTransportRecharge = useCallback(async () => {
    setLoading(true);
    const automaticaTask = RecargaAutomaticaApi.Obter(Number(id));
    const programadaTask = RecargaProgramadaApi.Obter(Number(id));
    const [automaticaTmp, programadaTmp] = await Promise.all([automaticaTask, programadaTask]);
    setAutomatica(automaticaTmp);
    setProgramada(programadaTmp);
    setLoading(false);
  }, [id, setAutomatica, setProgramada]);

  useEffect(() => {
    loadTransportRecharge();
  }, [user, loadTransportRecharge]);

  useEffect(() => {
    setCardList(creditCardList ? creditCardList : []);
  }, [creditCardList]);

  return (
    <>
      <Loading loading={loading} />
      <Container>
        <RouterHeader>
          <HeaderLink to={PATHS.transporte.url}>Recarga de transporte&nbsp;</HeaderLink>
          <FakeHeaderLink className="highlight">/ Agendamento de recarga</FakeHeaderLink>
        </RouterHeader>
        <Flex gap="12px" paddingLg="12px 10vw" minHeight="280px" direction="row" sm="col">
          <TransportRechargeScheduleContext.Provider
            value={{
              reload: loadTransportRecharge,
              setLoading: setLoading,
              cardData: history.location.state as CartaoTransporte,
              cardList: cardList,
            }}
          >
            <Column basis="50%">
              <AutoTrandportRechargeSchedule data={automatica} />
            </Column>
            <Column basis="50%">
              <ProgTrandportRechargeSchedule data={programada} />
            </Column>
          </TransportRechargeScheduleContext.Provider>
        </Flex>
      </Container>
    </>
  );
};

export default TrandportRechargeSchedule;
