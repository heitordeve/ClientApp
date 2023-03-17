import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BsList } from 'react-icons/bs';
import { FiChevronDown } from 'react-icons/fi';
import logo from 'assets/logos/kim-215x100.png';
import { useAuth } from '../../../../hooks/auth';
import { Header, NavItem, Nav } from './styles';
import { Row } from '../../layout';
import { IcPedido } from 'components/ui/icons';
import ShoppingBag from '../../../ShoppingBag';
import { IconButton } from '../../button';
import { FaUserCircle } from 'react-icons/fa';
import { FiBell } from 'react-icons/fi';
import { NavbarText } from 'reactstrap';
import { useMenu, useNotification } from 'hooks';
import Parametros from 'utils/parametros';
import { PATHS } from 'routes/rotas-path';

const HeaderMain: React.FC = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const { toggleMenu, setOpenMenu, toggleNavbar } = useMenu();
  const { toggleNotification, setOpenNotification, notificacoes } = useNotification();

  return user ? (
    <>
      <Header
        onClick={e => {
          setOpenMenu(false);
          setOpenNotification(false);
        }}
      >
        <Row align="center">
          {pathname !== '/' && <BsList className="no-sm" size={50} onClick={toggleNavbar} />}
          <Link to="/">
            <img className="logo" src={logo} alt="logo" />
          </Link>
          {!Parametros.isProd && Parametros.apiLegado.includes('app.') && (
            <p className="prod">Apontando PROD</p>
          )}

          <Nav justify="flex-end" align="center" flex="1">
            <NavItem className="no-sm no-md">
              <Link to={PATHS.pedidos}>
                <IconButton
                  icone={IcPedido}
                  label="Pedidos"
                  theme="outlined"
                  fontSize={16}
                  pointed
                />
              </Link>
            </NavItem>
            <NavItem>
              <IconButton
                id="btnOpenNotifications"
                onClick={e => {
                  e.stopPropagation();
                  toggleNotification();
                  setOpenMenu(false);
                }}
                icone={FiBell}
                label="Notificações"
                badge={notificacoes?.length ?? 0}
                theme="outlined"
                fontSize={16}
                pointed
              />
            </NavItem>
            <NavItem>
              <ShoppingBag />
            </NavItem>
            <NavItem className="no-sm no-md">
              <Row
                gap="6px"
                onClick={e => {
                  e.stopPropagation();
                  setOpenNotification(false);
                  toggleMenu();
                }}
              >
                <FaUserCircle size="55px" color="#e8e8ed" />
                <NavbarText className="user-name no-sm">
                  Olá, {user?.NomeUsuario?.split(' ', 2).join(' ')}!
                </NavbarText>
                <span id="perfilToggleButton" style={{ padding: '10px' }}>
                  <FiChevronDown size={22} style={{ color: 'rgba(112, 112, 112, 1)' }} />
                </span>
              </Row>
            </NavItem>
          </Nav>
        </Row>
      </Header>
    </>
  ) : (
    <></>
  );
};

export default HeaderMain;
