import React, { useState, useEffect, useRef, useCallback, createContext } from 'react';
import CreditCardCard, { CreditCardProps, CreditCardState } from '../../components/CreditCardCard';
import { Container } from './styles';
import { useAuth } from '../../hooks/auth';
import { useAlert } from '../../hooks/alert';
import Loading from '../../components/ui/loading';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useCreditCard, CreditCardData } from '../../hooks/creditCard';
import { HeaderLinkHolder } from '../Shopping/styles';
import HeaderLink, { FakeHeaderLink } from '../../components/HeaderLink';

interface CreditCardPageContextData {
  reload: () => void;
  setLoading: (state: boolean) => void;
}

export const CreditCardPageContext = createContext<CreditCardPageContextData>({ reload: () => { }, setLoading: () => { } });

const cardLimit: number = 3;

const CreditCard: React.FC = () => {
  const { user } = useAuth();
  const { addAlert } = useAlert();
  const { creditCardList, tryAgain } = useCreditCard();

  const [cards, setCards] = useState<CreditCardProps[]>([]);
  const [loading, setLoading] = useState(false);

  const cardListRef = useRef<HTMLSpanElement>(null);

  const setUpCards = useCallback((data: CreditCardData[]) => {
    let tmpCard = new Array<CreditCardProps>(cardLimit);
    if (data) {
      for (let i = 0; i < cardLimit; i++) {
        if (i < data.length) {
          let card = data[i];
          tmpCard[i] = {
            state: CreditCardState.Filled,
            card: card
          };
        } else {
          tmpCard[i] = {
            state: CreditCardState.Empty
          };
        }
      }
    } else {
      for (let i = 0; i < cardLimit; i++) {
        tmpCard[i] = { state: CreditCardState.Empty };
      }
    }
    setCards(tmpCard);
  }, []);

  const reload = useCallback(() => {
    setLoading(true);
    tryAgain((status, message) => {
      setLoading(false);
      if (!status) {
        addAlert({
          title: 'Erro',
          description: message,
          type: 'error'
        })
      }
    });
  }, [tryAgain, setLoading, addAlert]);

  const defineLoading = useCallback((state: boolean) => {
    setLoading(state);
  }, [])

  //Get cards
  useEffect(() => {
    if (creditCardList) {
      setUpCards(creditCardList);
    }
  }, [user, creditCardList, setUpCards]);

  return (
    <Container>
      <Loading loading={loading} />
      <div className="d-flex w-100 pl-3">
        <HeaderLinkHolder>
          <HeaderLink to="/">
            Home&nbsp;
          </HeaderLink>
          <FakeHeaderLink className="highlight">
            / Cartão de crédito
          </FakeHeaderLink>
        </HeaderLinkHolder>
      </div>
      <div className="text-center">
        <h3 className="font-weight-bold mt-3 mb-5">Cartões de Crédito</h3>
      </div>
      <span className="d-flex flex-row flex-wrap justify-content-center align-items-center w-100" ref={cardListRef}>
        <CreditCardPageContext.Provider value={{ reload: reload, setLoading: defineLoading }}>
          {cards.map((card, i) => <CreditCardCard key={'credit-card-' + i} {...card} />)}
        </CreditCardPageContext.Provider>
      </span>
    </Container>
  );
}

export default CreditCard;
