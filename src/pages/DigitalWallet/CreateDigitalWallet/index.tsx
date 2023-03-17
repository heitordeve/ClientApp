import React, { useState } from 'react';
import { Container, Content, HeaderModal, SectionService } from './styles';
import createDW from '../../../assets/createDW.png';
import Button from '../../../components/ui/button';
import Modal from 'react-modal';
import { AiOutlinePlus } from 'react-icons/ai';
import { HeaderLinkHolder } from '../../Shopping/styles';
import HeaderLink, { FakeHeaderLink } from '../../../components/HeaderLink';
import { RiCurrencyLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { BiTransferAlt } from 'react-icons/bi';
import { FiCreditCard } from 'react-icons/fi';
import { Column } from '../../../components/ui/layout';
import { PATHS } from 'routes/rotas-path';

const isSmallWidth = window.matchMedia('(max-width: 1000px)').matches;

const isSmallHeight = window.matchMedia('(max-height: 500px)').matches;

const customStyles = {
  content: isSmallWidth
    ? {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '90vmin',
        maxHeight: isSmallHeight ? '90%' : '',
        borderRadius: '15px',
        overflow: 'auto',
      }
    : {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '480px',
        maxHeight: '550px',
        borderRadius: '15px',
        overflow: 'auto',
      },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

const CreateDigitalWallet: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Column>
      <div className="ml-5 mt-4">
        <HeaderLinkHolder>
          <HeaderLink to="/">Home&nbsp;</HeaderLink>
          <FakeHeaderLink className="highlight">/ Carteira Digital</FakeHeaderLink>
        </HeaderLinkHolder>
      </div>
      <Container>
        <Content>
          <Column>
            <div>
              <img className="img" src={createDW} alt="imagem esqueci a senha" />
            </div>
            <div>
              <p>
                Instale o aplicativo KIM para criar sua conta ou
                <br />
                para obter mais informações!
              </p>
            </div>
            <Column gap="12px">
              <Link to={PATHS.conveniencias} target="_blank" className="w-100">
                <Button border>
                  <RiCurrencyLine size={25} /> Confira Nossas Conveniências
                </Button>
              </Link>
              <Button border onClick={() => setIsOpen(true)}>
                <AiOutlinePlus size={25} /> Confira Nossos Serviços
              </Button>
            </Column>
            <Modal
              style={customStyles}
              isOpen={isOpen}
              onRequestClose={() => setIsOpen(false)}
              contentLabel="Example Modal"
            >
              <HeaderModal>Nossos Serviços</HeaderModal>

              <SectionService style={{ marginTop: '100px' }}>
                <BiTransferAlt size={50} className="mr-3" />
                <div>TEDs, transferências e pagamento de contas e boletos</div>
              </SectionService>
              <SectionService>
                <FiCreditCard size={40} className="mr-3" />
                <div>Cartão virtual</div>
              </SectionService>
              <SectionService>
                <RiCurrencyLine size={40} className="mr-3" />
                <div>Extratos e comprovantes</div>
              </SectionService>
              <hr />

              <div className="d-flex justify-content-center align-items-center  w-100">
                <Button onClick={() => setIsOpen(false)}>Entendi</Button>
              </div>
            </Modal>
          </Column>
        </Content>
      </Container>
    </Column>
  );
};

export default CreateDigitalWallet;
