import React from 'react';

import { AuthProvider, useAuth } from './auth';
import { AlertProvider, useAlert, alertService } from './alert';
import { CreditCardProvider, useCreditCard } from './creditCard';
import { DigitalWalletProvider, useDigitalWallet } from './digitalWallet';
import { ShoppingBagProvider, useShoppingBag } from './shoppingBag';
import { MenuProvider, useMenu } from './menu';
import { TransporteProvider, useTransporte } from './transporteHook';
import { LoadProvider, useLoad } from './loadHook';
import ThemeProvider from './theme';
import { NotificationProvider, useNotification } from './notification';


export const AppPublicProvider: React.FC = ({ children }) => (
  <ThemeProvider>
    <AlertProvider>
      <LoadProvider>
        <AuthProvider>{children}</AuthProvider>
      </LoadProvider>
    </AlertProvider>
  </ThemeProvider>
);
//Logado
export const AppProvider: React.FC = ({ children }) => (
  <CreditCardProvider>
    <DigitalWalletProvider>
      <ShoppingBagProvider>
        <TransporteProvider>
          <MenuProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </MenuProvider>
        </TransporteProvider>
      </ShoppingBagProvider>
    </DigitalWalletProvider>
  </CreditCardProvider>
);

export {
  useAuth,
  useAlert,
  alertService,
  useCreditCard,
  useDigitalWallet,
  useShoppingBag,
  useMenu,
  useTransporte,
  useLoad,
  useNotification,
};
