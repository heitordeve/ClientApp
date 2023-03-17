import React, { useCallback } from 'react';

import { IconType } from 'react-icons';
import styled from 'styled-components';
import { useMenu, useAuth } from 'hooks';
import { Column, Row } from '../../layout';
import {
  IcCartaoCredito,
  IcConveniencias,
  IcPergunta,
  IcSac,
  IcTermos,
  IcSair,
  IcPerfil,
} from 'components/ui/icons';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import { BodyP } from 'components/ui/typography';
import { primary, secondary, gray3, gray4 } from 'styles/consts';
import { media, breakpoint } from 'styles';
import { PATHS } from 'routes/rotas-path';

const Container = styled(Column)`
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  ${media.max(breakpoint.md)} {
    justify-content: flex-end;
  }
`;
const Contents = styled(Column)`
  background: white;
  width: 350px;
  flex-grow: 0;
  border-radius: 0 0 0 10px;
  ${media.minMax(breakpoint.md, breakpoint.md)} {
    border-radius: 10px 0 0 0;
  }
  ${media.max(breakpoint.sm)} {
    flex: 1;
    width: 100%;
    border-radius: 0;
  }
  ${media.min(breakpoint.lg)} {
    border-top: 1px solid ${gray3};
  }
`;
const List = styled(Column)`
  flex-grow: 0;
  ${media.max(breakpoint.sm)} {
    width: 100%;
    height: 100%;
  }
`;

const Item = styled(Row)`
  height: 57px;
  padding: 0.25rem 1.5rem;
  color: ${gray4};
  svg {
    color: ${primary};
  }
  &:hover {
    color: ${secondary};
    svg {
      color: ${secondary};
    }
    box-shadow: rgb(0 0 0 / 25%) 0px 1px 4px;
  }
  &:focus,
  &:active {
    background: #f0f8ff;
  }
  :last-child {
    border-radius: 0 0 0 10px;
    ${media.max(breakpoint.md)} {
      border-radius: 0;
    }
  }
`;
interface ToProps {
  pathname: History.Path;
  state?: History.LocationState;
}

interface ItemMenuProps {
  icone: IconType;
  label: string;
  to?: string | ToProps;
  onClick?: React.MouseEventHandler<any>;
}
const ItemMenu: React.FC<ItemMenuProps> = ({ icone: Icone, label, to, onClick }) => {
  const history = useHistory();

  const handleClick: React.MouseEventHandler<any> = useCallback(
    event => {
      if (to) {
        if (typeof to === 'string') {
          history.push(to);
        } else {
          history.push(to.pathname, to.state);
        }
      }
      onClick?.call({}, event);
    },
    [history, to, onClick],
  );

  return (
    <Item onClick={handleClick} align="center" gap="20px">
      <Icone size={22} className="icon-menu" />
      <BodyP margin="0">{label}</BodyP>
    </Item>
  );
};

const Menu: React.FC<React.HTMLAttributes<HTMLDivElement>> = props => {
  const { signOut, user } = useAuth();
  const { menuIsOpen, setOpenMenu } = useMenu();
  const closeMenu = useCallback(() => {
    setOpenMenu(false);
  }, [setOpenMenu]);
  const sair = useCallback(() => {
    closeMenu();
    signOut();
  }, [closeMenu, signOut]);
  return menuIsOpen && user ? (
    <Container align="flex-end" {...props} onClick={() => setOpenMenu(false)}>
      <Contents onClick={e => e.stopPropagation()}>
        <List>
          <ItemMenu to={PATHS.perfil} onClick={closeMenu} icone={IcPerfil} label="Perfil" />
          <ItemMenu
            to={PATHS.cartoesDeCredito}
            onClick={closeMenu}
            icone={IcCartaoCredito}
            label="Cartão de Crédito"
          />
          <hr />
          <ItemMenu
            to={PATHS.conveniencias}
            onClick={closeMenu}
            icone={IcConveniencias}
            label="Conveniências"
          />
          <ItemMenu
            to={PATHS.faq}
            onClick={closeMenu}
            icone={IcPergunta}
            label="Perguntas Frequentes"
          />
          <ItemMenu to={PATHS.sac} onClick={closeMenu} icone={IcSac} label="SAC" />
          <ItemMenu
            to={PATHS.termosDeUso}
            onClick={closeMenu}
            icone={IcTermos}
            label="Termos de Uso"
          />
          <hr />
          <ItemMenu onClick={sair} icone={IcSair} label="Sair" />
        </List>
      </Contents>
    </Container>
  ) : (
    <></>
  );
};

export default Menu;
