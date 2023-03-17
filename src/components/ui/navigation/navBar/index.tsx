import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';

import { IcCarteira, IcCupom, IcRecargaCelular, IcShopping, IcHome } from 'components/ui/icons';
import { Row } from '../../layout';
import { useAuth, useMenu } from 'hooks';
import IconButton from 'components/ui/button/iconButton';
import { primary } from 'styles/consts';
import { IconType } from 'react-icons';
import { media, breakpoint } from 'styles';
import { PATHS } from 'routes/rotas-path';

export const Nav = styled(Row).attrs({ as: 'nav' })`
  height: 124px;
  user-select: none;
  transition: height 0.5s ease-in-out;
  &.hide {
    height: 0%;
  }
  ${media.max(breakpoint.sm)} {
    display: none;
  }
`;

export const Container = styled(Row)`
  height: 100%;
  overflow: hidden;
`;

const NavBar: React.FC = () => {
  const { navbarIsOpen } = useMenu();
  const { pathname } = useLocation();
  const { user } = useAuth();
  const [exibir, setExibir] = useState<boolean>(true);

  useEffect(() => {
    const tmpExibir = navbarIsOpen && user && pathname !== '/';
    setExibir(tmpExibir);
  }, [pathname, navbarIsOpen, user]);

  function getIcon(icon: IconType, label: string, to: string) {
    return (
      <Link to={to}>
        <IconButton
          icone={icon}
          label={label}
          color="white"
          theme={pathname === to ? 'default' : 'outlined'}
          border
        />
      </Link>
    );
  }

  return (
    !!user && (
      <Nav
        grow="0"
        className={exibir ? '' : 'hide'}
        justify="center"
        align="center"
        background={primary}
      >
        <Container>
          <Row justify="center" align="center" gap="12px" padding="12px">
            {getIcon(IcHome, 'Início', PATHS.principal)}
            {getIcon(IcRecargaCelular, 'Recarga de Celular', PATHS.dashboard)}
            {getIcon(IcCupom, 'Conteúdos Digitais', PATHS.conteudosDigitais)}
            {getIcon(IcShopping, 'Shopping', PATHS.shopping)}
            {getIcon(IcCarteira, 'Carteira Digital', PATHS.carteiraDigital)}
          </Row>
        </Container>
      </Nav>
    )
  );
};

export default NavBar;
