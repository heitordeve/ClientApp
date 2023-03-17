import { IconButton } from 'components/ui/button';
import { IcHome, IcPedido, IcMenu } from 'components/ui/icons';
import { useMenu } from 'hooks/menu';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from 'hooks/auth';
import { gray3, mediaBreakpoint, primary, zIndex } from 'styles/consts';

import { Row } from '../../layout';
import { PATHS } from 'routes/rotas-path';

export const Container = styled(Row)`
  @media screen and (min-width: ${mediaBreakpoint.lgMin}) {
    display: none;
  }
  height: 60px;
  padding: 0 6px;
  /*   bottom: 0px;
  position: sticky; */
  background: #fff;
  color: ${primary};
  z-index: ${zIndex.bottomNav};
  user-select: none;
  border-top: 1px solid ${gray3};
  & > * {
    flex: 1;
  }
`;

const BottomNav: React.FC = () => {
  const { setOpenMenu, toggleMenu } = useMenu();
  const { user } = useAuth();
  return user ? (
    <Container grow="0" justify="space-around" align="center" onClick={() => setOpenMenu(false)}>
      <Link to={PATHS.principal}>
        <IconButton
          icone={IcHome}
          label="Início"
          theme="outlined"
          fontSize={16}
          height="100%"
          pointed
        />
      </Link>
      <Link to={PATHS.pedidos}>
        <IconButton
          icone={IcPedido}
          label="Pedidos"
          theme="outlined"
          fontSize={16}
          height="100%"
          pointed
        />
      </Link>
      <IconButton
        icone={IcMenu}
        label="Menu"
        theme="outlined"
        fontSize={16}
        height="100%"
        width="auto"
        pointed
        onClick={e => {
          e.stopPropagation();
          toggleMenu();
        }}
      />
    </Container>
  ) : (
    <> </>
  );
};

export default BottomNav;
