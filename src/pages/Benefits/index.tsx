import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import Modal from 'react-modal';

import imgFinalizedOrders from '../../assets/imgFinalizedOrders.png';

import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Container,
  ContentContainer,
  CardItem1,
  CardItem2,
  CardItem3,
  CardMenu,
  ContainerModal,
  ContentCardNull,
} from './styles';
import { HeaderLinkHolder } from '../Shopping/styles';
import HeaderLink, { FakeHeaderLink } from '../../components/HeaderLink';
import { Link } from 'react-router-dom';
import { CgFileDocument } from 'react-icons/cg';
import { TiBusinessCard } from 'react-icons/ti';
import { RiBillLine, RiDeleteBin2Line } from 'react-icons/ri';
import { IoMdClose } from 'react-icons/io';
import Button from '../../components/ui/button';
import { PATHS } from 'routes/rotas-path';

interface CardDataForm {
  codUsuarioCartao: number;
  numCartao: string;
  saldoCartao: number;
  saldoTotal: number;
  nomeCartao: string;
  pontosExpirar: {
    codUsuario: number;
    Mes: string;
    Pontos: number;
  };
}

const customStylesExtract = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '100%',
    borderRadius: '15px',
    overflow: 'auto',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

const monName: string[] = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Agosto',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const Benefits: React.FC = () => {
  const { user } = useAuth();
  const [isOpenExtract, setIsOpenExtract] = useState(false);
  const [isOpenRegulation, setIsOpenRegulation] = useState(false);
  const [extract, setExtract] = useState<[]>([]);
  const [cardData, setCardData] = useState<CardDataForm>();

  useEffect(() => {
    api
      .get(
        `KimMais.Api.ExtratoKimlometros/${user.TokenUsuario}/${user.CodigoUsuario}?dtInicio=1900%2F01%2F01&dtFinal=2020%2F09%2F24`,
      )
      .then(response => {
        setExtract(response.data.ListaObjeto);
      });
  }, [user]);

  useEffect(() => {
    api
      .get(`KimMais.Api.DadosCartãoBeneficio/${user.TokenUsuario}/${user.CodigoUsuario}`)
      .then(response => {
        setCardData(response.data.ListaObjeto[0]);
      });
  }, [user]);

  return (
    <Container>
      <div className="d-flex w-100 mb-5">
        <HeaderLinkHolder>
          <HeaderLink to="/">Home&nbsp;</HeaderLink>
          <FakeHeaderLink className="highlight">/ Benefícios KIM</FakeHeaderLink>
        </HeaderLinkHolder>
      </div>
      <ContentContainer>
        <div className="d-flex flex-row justify-content-center">
          <CardItem1>
            <p className="kmNumber">0 KM</p>
            <hr />
            <p className="kimLometros">Seus KIMlômetros</p>
            <p className="expirationKm">
              KIMs a expirar em {monName[new Date().getMonth()]}:{' '}
              {cardData && cardData.pontosExpirar.Pontos} Km
            </p>
          </CardItem1>
          <CardItem2
            onClick={() => {
              setIsOpenRegulation(true);
            }}
          >
            <p className="kmBenefits">Clube de Benefícios</p>
            <hr />
            <p className="kmDescription">
              Aqui você encontra os melhores benefícios feitos especialmente para você!
            </p>
            <p className="kmWarning">Por que você merece sempre mais!</p>
          </CardItem2>
        </div>
        {cardData && (
          <CardItem3>
            <h2>{cardData.nomeCartao}</h2>
            <p className="titleNumCard">Nº Cartão:</p>
            <p className="numberCard">{cardData.numCartao}</p>
            <div className="d-flex justify-content-center align-items-center">
              <Button color="secondary">
                <RiDeleteBin2Line size={25} onClick={() => {}} /> Excluir
              </Button>
            </div>
          </CardItem3>
        )}

        <div className="d-flex flex-row justify-content-center mt-4">
          <div className="ml-1 mr-1 mt-1 link-card" onClick={() => setIsOpenExtract(true)}>
            <CardMenu>
              <RiBillLine size={30} style={{ color: '#FFF' }} />
              <strong>Extrato</strong>
            </CardMenu>
          </div>
          <div className="ml-1 mr-1 mt-1 link-card">
            <Link to={PATHS.transporte.url} onClick={() => {}}>
              <CardMenu>
                <TiBusinessCard size={35} style={{ color: '#FFF' }} />
                <strong>Vincular cartão de transporte</strong>
              </CardMenu>
            </Link>
          </div>
          <div className="ml-1 mr-1 mt-1 link-card" onClick={() => setIsOpenRegulation(true)}>
            <CardMenu>
              <CgFileDocument size={30} style={{ color: '#FFF' }} />
              <strong>Regulamento</strong>
            </CardMenu>
          </div>
        </div>
      </ContentContainer>
      <Modal
        style={customStylesExtract}
        isOpen={isOpenExtract}
        onRequestClose={() => setIsOpenExtract(false)}
        contentLabel="Example Modal"
      >
        <IoMdClose
          onClick={() => setIsOpenExtract(false)}
          size={20}
          style={{
            color: '#672ed7',
            top: '5px',
            display: 'block',
            float: 'right',
            position: 'fixed',
            right: '5px',
            cursor: 'pointer',
          }}
        />
        <ContainerModal>
          <h3>Extrato Benefícios KIM</h3>
          {extract.length === 0 ? (
            <ContentCardNull>
              <p>Nenhuma operação por aqui!</p>
              <hr />
              <img className="imagem" src={imgFinalizedOrders} alt={imgFinalizedOrders} />
              <div className="infoOrders">
                <p>
                  Você ainda não fez nenhuma operação que tenha lhe beneficiado com o KIMlômetros.
                </p>
              </div>
              <div style={{ width: '300px' }}>
                <Button onClick={() => setIsOpenExtract(false)} color="secondary">
                  Fechar
                </Button>
              </div>
            </ContentCardNull>
          ) : (
            <ContentCardNull>
              <p>TEste teste!</p>
              <hr />
              <img className="imagem" src={imgFinalizedOrders} alt={imgFinalizedOrders} />
              <div className="infoOrders">
                <p>
                  Você ainda não fez nenhuma operação que tenha lhe beneficiado com o KIMlômetros.
                </p>
              </div>
              <div style={{ width: '300px' }}>
                <Button onClick={() => setIsOpenExtract(false)} color="secondary">
                  Fechar
                </Button>
              </div>
            </ContentCardNull>
          )}
        </ContainerModal>
      </Modal>
      <Modal
        style={customStylesExtract}
        isOpen={isOpenRegulation}
        onRequestClose={() => setIsOpenRegulation(false)}
        contentLabel="Example Modal"
      >
        <IoMdClose
          onClick={() => setIsOpenRegulation(false)}
          size={20}
          style={{
            color: '#672ed7',
            top: '5px',
            display: 'block',
            float: 'right',
            position: 'fixed',
            right: '5px',
            cursor: 'pointer',
          }}
        />
        <ContainerModal>
          <h3>Regulamento</h3>
        </ContainerModal>
      </Modal>
    </Container>
  );
};

export default Benefits;
