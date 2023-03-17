import React, { createContext } from 'react';
import Modal from 'react-modal';
import { useDigitalWallet } from '../../hooks/digitalWallet';

import { Container } from './styles';
import Extract from '../../components/Extract';
import BillPayment from '../../components/BillPayment';
import 'bootstrap/dist/css/bootstrap.min.css';

import ConfigCard from '../../components/DigitalWalletDashboard/ConfigCard';
import AddMoneyCard from '../../components/DigitalWalletDashboard/AddMoneyCard';
import CardData from '../../components/DigitalWalletDashboard/CardData';
import PendingCash from '../../components/DigitalWalletDashboard/PendingCash';
import Transfer from '../../components/DigitalWalletDashboard/Transfer';

import CreateDigitalWallet from './CreateDigitalWallet';
import { Column } from '../../components/ui/layout';

Modal.setAppElement('#root');

interface DigitalWalletContextData {
  codigoConta: number;
  saldoDisponivelGlobal: number;
  valorRenda: number;
  nome: string;
}

export const DigitalWalletContext = createContext<DigitalWalletContextData>({
  codigoConta: 0,
  saldoDisponivelGlobal: 0,
  valorRenda: 0,
  nome: '',
});

const DigitalWallet: React.FC = () => {
  const wallet = useDigitalWallet();

  return (
    <Column align="center">
      {wallet ? (
        <DigitalWalletContext.Provider value={wallet}>
          <Container>
            <CardData />
            <div className="columnFlex">
              <ConfigCard />
              <BillPayment />
              <AddMoneyCard />
            </div>
            <div className="dcolumnFlex">
              <PendingCash />
              <Extract />
              <Transfer />
            </div>
          </Container>
        </DigitalWalletContext.Provider>
      ) : (
        <CreateDigitalWallet />
      )}
    </Column>
  );
};

export default DigitalWallet;
