import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import styled, { css } from 'styled-components';
import GlobalStyle from './styles/global';
import { AppProvider, AppPublicProvider } from './hooks';
import Routes from './routes';

import { BottomNav, Header, Menu, NavBar } from 'components/ui/navigation';
import Footer from './components/ui/footer';
import Notification from './components/ui/notification';
import RotasPublicas from 'routes/rotas-publicas';
import { Column } from 'components/ui/layout';

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  background: #f2f2f2;
`;
const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  > div {
    flex: 1;
  }
`;
const Corpo = styled.div`
  display: grid;
  overflow: auto;
  flex: 1;
  z-index: 1;
  [class*='camada-'] {
    grid-column: 1;
    grid-row: 1;
  }
  ${() =>
    [0, 1, 2, 3].map(
      i => css`
        .camada-${i} {
          z-index: ${i};
        }
      `,
    )}
`;
const Main = styled.main`
  height: 100%;
  width: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Container>
        <AppPublicProvider>
          <RotasPublicas>
            <AppProvider>
              <Column overflow="hidden" height="100vh">
                <Header />
                <Corpo>
                  <Main className="camada-0">
                    <NavBar />
                    <Content>
                      <Routes />
                    </Content>
                    <Footer />
                  </Main>
                  <Menu className="camada-1" />
                  <Notification className="camada-2" />
                </Corpo>
                <BottomNav />
              </Column>
            </AppProvider>
          </RotasPublicas>
        </AppPublicProvider>
      </Container>

      <GlobalStyle />
    </BrowserRouter>
  );
};

export default App;
