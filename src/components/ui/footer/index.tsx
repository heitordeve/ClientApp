import React, { useCallback } from 'react';
import { FaFacebook, FaLinkedin, FaInstagram, FaTwitter } from 'react-icons/fa';

import logoKim from '../../../assets/logoKim.png';

import { useNotification, useAuth } from 'hooks';

import { Footer, Linha } from './styles';
import Li from './li';
import Redes from './redes';
import { Row, Column } from '../layout';
import { PATHS } from 'routes/rotas-path';

const FooterMain: React.FC = () => {
  const { user, signOut } = useAuth();
  const { setOpenNotification } = useNotification();

  const showShoppingBag = useCallback(() => {
    window.scrollTo(0, 0);
    document.getElementById('shoppingBagToggleButton').click();
  }, []);

  return user ? (
    <Footer>
      <Row gap="48px" wrapp justify="center">
        <ul className="list-unstyled font-weight-bold no-sm">
          <Li to={PATHS.principal}>Tela Inicial</Li>
          <Li to={PATHS.transporte.url}>Recarga de Transporte</Li>
          <Li to={PATHS.dashboard}>Recarga de Celular</Li>
          <Li to={PATHS.carteiraDigital}>Carteira digital</Li>
          <Li to={PATHS.dashboard}>Pagar Contas e Boletos</Li>
        </ul>
        <Linha />
        <ul className="list-unstyled font-weight-bold no-sm">
          <Li to={PATHS.shopping}>Shopping </Li>
          <Li to={PATHS.conteudosDigitais}>Conteúdos Digitais</Li>
          <Li to={PATHS.transporte.url}>Revalidação</Li>
          <Li to={PATHS.pedidos}>Pedidos</Li>
          <Li onClick={showShoppingBag}>Carrinho de Compras</Li>
          <Li to={PATHS.cartoesDeCredito}>Cartão de Crédito</Li>
        </ul>
        <Linha />
        <ul className="list-unstyled font-weight-bold no-sm">
          <Li to={PATHS.perfil}>Perfil</Li>
          <Li onClick={() => setOpenNotification(true)}>Notificação</Li>
          <Li to={PATHS.conveniencias}>Conveniências</Li>
          <Li to={PATHS.faq}>Perguntas frequentes</Li>
          <Li to={PATHS.sac}>Sac</Li>
          <Li to={PATHS.termosDeUso}>Termos de Uso</Li>
          <Li onClick={signOut}>Sair</Li>
        </ul>
        <Column justify="center">
          <Row justify="center">
            <Redes href="https://www.facebook.com/kimmaisapp" icon={FaFacebook} />
            <Redes href="https://twitter.com/kimmaisapp" icon={FaTwitter} />
            <Redes href="https://www.linkedin.com/company/kimrecarga/" icon={FaLinkedin} />
            <Redes href="https://www.instagram.com/kimmaisapp/" icon={FaInstagram} />
          </Row>
          <Row justify="center">
            <img className="logo" src={logoKim} alt={logoKim} />
          </Row>
        </Column>
      </Row>
    </Footer>
  ) : (
    <></>
  );
};

export default FooterMain;
