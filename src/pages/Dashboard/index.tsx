import React, { useCallback, useEffect, useState } from 'react';

import { useAuth } from '../../hooks/auth';

import Carousel from '../../components/Carousel';
import CellphoneRecharge from '../../components/CellphoneRecharge';
import BillPayment from '../../components/BillPayment';
import Extract from '../../components/Extract';
import Modal from 'react-modal';

import {
  DashboardHolder,
  DashboardHeader,
  CardsHolder,
  TitleTerms,
  LinkTerms,
  TitleAcceptTerms,
  DescriptionTerms,
} from './styles';
import api from '../../services/api';
import Button from '../../components/ui/button';
import Loading from '../../components/ui/loading';
import { IoMdClose } from 'react-icons/io';
import { Checkbox } from '@material-ui/core';

import { useAlert } from '../../hooks/alert';
import { FiAlertTriangle } from 'react-icons/fi';
import { Column } from '../../components/ui/layout';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '480px',
    background: '#FFF',
    color: '#FFFFFF',
    borderRadius: '15px',
    overflow: 'visible',
  },
  overlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
};

const customStylesTerms = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '100%',
    background: '#FFF',
    color: '#FFFFFF',
    borderRadius: '0',
    overflow: 'visible',
  },
};

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { addAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [codTermo, setCodTermo] = useState<number>();
  const [isOpenTerms, setIsOpenTerms] = useState(false);
  const [termsUse, setTermsUse] = useState('');
  const [state, setState] = useState({
    termoUso: false,
  });

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setState({ ...state, [event.target.name]: event.target.checked });
    },
    [state],
  );

  useEffect(() => {
    setLoading(true);
    api
      .get(
        `/KimMais.Api.Generica/${user.TokenUsuario}/${user.CodigoUsuario}/TermoUso%2FVerificarSessaoTermoUso`,
      )
      .then(response => {
        if (response.data.ListaObjeto[0].ExisteTermoUso === 1) {
          setIsOpen(true);
        } else {
          setIsOpen(false);
        }
        setLoading(false);
      })
      .catch(() => {
        setIsOpen(false);
        addAlert({
          type: 'error',
          title: 'Erro ao obter termos de uso',
        });
      });
  }, [user, addAlert]);

  const showTerms = useCallback(() => {
    setLoading(true);
    api.get(`/KimMais.Api.ConsultaTermoDeUso/0/0?tipoTermoUso=1`).then(response => {
      setIsOpenTerms(true);
      setTermsUse(response.data.ListaObjeto[0].DescTermoDeUso);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    api.get(`/KimMais.Api.ConsultaTermoDeUso/0/0?tipoTermoUso=1`).then(response => {
      setCodTermo(response.data.ListaObjeto[0].codigo);
      setLoading(false);
    });
  }, []);

  const handleTerms = useCallback(() => {
    if (state.termoUso) {
      setLoading(true);
      api
        .post(
          `KimMais.Api.AceiteTermoUso/api/AceiteTermoUso?accsToken=${user.TokenUsuario}&usercode=${user.CodigoUsuario}`,
          {
            CodigoTermo: codTermo,
            Ip: 0,
            CodigoUsuario: user.CodigoUsuario,
          },
        )
        .then(response => {
          setLoading(false);
          if (response.data.Status !== 1) {
            setIsOpen(false);
            addAlert({
              title: response.data.Mensagem,
              type: 'success',
            });
            window.scrollTo(0, 0);
          } else {
            window.scrollTo(0, 0);
            addAlert({
              title: response.data.Mensagem,
              type: 'info',
            });
          }
        })
        .catch(() => {
          setLoading(false);
          addAlert({
            title: 'Erro',
            type: 'error',
            description: 'Erro ao aceitar termos de uso',
          });
          window.scrollTo(0, 0);
        });
    } else {
      addAlert({
        title: 'Erro',
        type: 'error',
        description: 'Aceite os termos de uso para continuar!',
      });
      window.scrollTo(0, 0);
    }
  }, [state, codTermo, user, addAlert]);

  return (
    <>
      <DashboardHolder>
        <DashboardHeader>O que você quer fazer hoje?</DashboardHeader>
        <Carousel
          width="80vw"
          pages={[
            <CardsHolder>
              <Extract />
              <CellphoneRecharge />
              <BillPayment />
            </CardsHolder>,
          ]}
        />

        <Modal style={customStyles} isOpen={isOpen} contentLabel="Example Modal">
          <>
            <Loading loading={loading} />
            <div className="d-flex justify-content-center align-items-center flex-wrap flex-column pr-2 pl-2 pt-4 pb-4">
              <div className="d-flex justify-content-center align-items-center flex-column">
                <TitleAcceptTerms>TERMO DE USO E POLÍTICA DE PRIVACIDADE</TitleAcceptTerms>
                <FiAlertTriangle
                  size={130}
                  style={{ maxWidth: '150px', color: '#672ED7' }}
                  className=""
                />
                <DescriptionTerms>Ação necessária</DescriptionTerms>
                <DescriptionTerms>
                  Atualizamos nossos Termos de Uso e Política de Privacidade. Para continuar
                  utilizando o KIM leia o documento com atenção e aceite.
                </DescriptionTerms>
              </div>
              <div className="d-flex justify-content-center align-items-center flex-row">
                <Checkbox
                  style={{ maxWidth: '20px' }}
                  checked={state.termoUso}
                  onChange={handleChange}
                  name="termoUso"
                  value="1"
                  color="primary"
                />
                <LinkTerms style={{ color: 'black' }}>
                  Li e aceito os{' '}
                  <b onClick={() => showTerms()}>termos de uso e política de privacidade</b>
                </LinkTerms>
              </div>
              <Column gap="12px">
                <Button
                  style={{
                    width: '350px',
                  }}
                  onClick={() => handleTerms()}
                >
                  Confirmar
                </Button>
                <Button
                  color="secondary"
                  style={{
                    width: '350px',
                  }}
                  onClick={signOut}
                >
                  Recusar Termos de Uso
                </Button>
              </Column>
            </div>
          </>
        </Modal>

        <Modal
          style={customStylesTerms}
          isOpen={isOpenTerms}
          onRequestClose={() => setIsOpen(false)}
          contentLabel="Example Modal"
        >
          <IoMdClose
            onClick={() => setIsOpenTerms(false)}
            size={20}
            style={{
              color: '#672ED7',
              top: '-10px',
              display: 'block',
              float: 'right',
              position: 'relative',
              right: '-10px',
              cursor: 'pointer',
            }}
          />
          <>
            <div className="d-flex justify-content-start align-items-center flex-wrap flex-column pr-2 pl-2 pb-4">
              <TitleTerms>Termos de Uso</TitleTerms>
              <div
                id="terms"
                style={{ color: 'black', padding: '20px' }}
                dangerouslySetInnerHTML={{ __html: termsUse }}
              />
            </div>
          </>
        </Modal>
      </DashboardHolder>
    </>
  );
};

export default Dashboard;
