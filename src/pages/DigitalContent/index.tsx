import React, { useState, useCallback, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { useAuth } from '../../hooks/auth';
import { useAlert } from '../../hooks/alert';
import { useShoppingBag } from '../../hooks/shoppingBag';
import api from '../../services/api';
import Button from '../../components/ui/button';
import { CustomRadioButton } from '../../components/ui/radioButton';
import { NumberToReais } from '../../utils/printHelper';
import getValidationErrors from '../../utils/getValidationErrors';
import Loading from '../../components/ui/loading';

import {
  Container,
  CardLogoAnchor,
  CardLogoImage,
  ModalLogoImage,
  ModalInside,
  SobreHolder,
  CardValueHolder,
  CardRadioHolder,
  RadioContainer,
} from './styles';
import { HeaderLinkHolder } from '../Shopping/styles';
import HeaderLink, { FakeHeaderLink } from '../../components/HeaderLink';
import Input from '../../components/ui/input';
import { TipoPedidoEnum } from '../../enuns/tipoPedidoEnum';
import { Column } from 'components/ui/layout';

Modal.setAppElement('#root');

interface ServicoDigitalData {
  ListaTipoCartao: [
    {
      CodigoTipoCartao: number;
      CodigoOperadora: number;
      DescricaoTipoCartao: string;
      DescricaoDetalheOperadora: string;
      ValorMaximoCredito: number;
      ValorMinimoCredito: number;
      CodigoTecnologiaTipoCartao: number;
      TipoCartaoInativo: boolean;
      hasCodigoAssinante: boolean;
      PrimeiraVia: boolean;
      ValorPrimeiraVia: number;
      SegundaVia: boolean;
      ValorSegundaVia: number;
      UrlImagemTipoCartao: string | null;
      RevalidacaoCartao: boolean;
      ValorRevalidacaoOperadora: number;
      ValorRevalidacaoServico: number;
      TipoCartaoIdentificado: boolean;
    },
  ];
  CodigoOperadora: number;
  CNPJOperadora: string;
  RazaoSocial: string;
  NomeFantasia: string;
  OperadoraInativo: boolean;
  SiglaOperadora: string | null;
  CodigoRevendaOperadora: number;
  HostAPI: string | null;
  TokenAutorizacaoAPI: string | null;
  UrlTaxaServico: string | null;
  UrlLogoOperadora: string; //using
  CanalServico: number;
  UrlConveniencia: string | null;
  PermiteFisico: boolean;
  PermiteVirtual: boolean;
}

interface TipoCartaoValorData {
  Sobre: string;
  hasCodigoAssinante: boolean;
  itens: {
    CodigoTipoCartaoValor: number;
    CodigoTipoCartao: number;
    ValorTipoCartao: number;
    DescCodigoExterno: string;
  }[];
}

interface SelectedServicoDigitalData {
  ServicoDigital: ServicoDigitalData;
  TipoCartaoValor: TipoCartaoValorData;
}

const isSmallWidth = window.matchMedia('(max-width: 1000px)').matches;

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: isSmallWidth
    ? {
        margin: 'auto',
        borderRadius: '10px',
        padding: '20px',
        width: '90vmin',
        left: '0',
        right: '0',
        bottom: 'auto',
        border: 'none',
        overflow: 'visible',
      }
    : {
        margin: 'auto',
        borderRadius: '10px',
        padding: '20px',
        width: '367px',
        left: '0',
        right: '0',
        bottom: 'auto',
        border: 'none',
        overflow: 'visible',
      },
};

interface CardLogoProps {
  servIndex: number;
  handleClick: (codigoTipoCartao: number) => void;
  imgSrc: string;
}

const CardLogo: React.FC<CardLogoProps> = ({ servIndex, handleClick, imgSrc }) => {
  return (
    <CardLogoAnchor
      onClick={() => {
        handleClick(servIndex);
      }}
    >
      <CardLogoImage src={imgSrc} />
    </CardLogoAnchor>
  );
};

interface CardRadioProps {
  value: number;
}

const CardRadio: React.FC<CardRadioProps> = ({ children, value }) => {
  return (
    <CardRadioHolder>
      {children}
      <CardValueHolder>{NumberToReais(value)}</CardValueHolder>
    </CardRadioHolder>
  );
};

const DigitalContent: React.FC = () => {
  const { user } = useAuth();
  const { addAlert } = useAlert();
  const { addShoppingBag } = useShoppingBag();
  const [loading, setLoading] = useState(true);

  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [servicosDigitais, setServicosDigitais] = useState<ServicoDigitalData[]>([]);
  const [servicoSelecionado, setServicoelecionado] = useState<SelectedServicoDigitalData>();

  const formRef = useRef<FormHandles>(null);

  useEffect(() => {
    api
      .get(
        `/KimMais.API.Generica/${user.TokenUsuario}/${user.CodigoUsuario}/Operadora%2FObterListaOperadoraServicosDigitais`,
      )
      .then(response => {
        if (Array.isArray(response.data.ListaObjeto) && response.data.ListaObjeto.length > 0) {
          setServicosDigitais(response.data.ListaObjeto);
        } else {
          setServicosDigitais([]);
          addAlert({
            title: 'Erro',
            description: 'Erro ao comunicar com serviço, tente mais tarde',
            type: 'error',
          });
        }
        setLoading(false);
      })
      .catch(() => {
        addAlert({
          title: 'Erro',
          description: 'Erro ao comunicar com serviço, tente mais tarde',
          type: 'error',
        });
      });
  }, [user, addAlert]);

  const openModal = useCallback(
    (servIndex: number) => {
      let servico = servicosDigitais[servIndex];
      api
        .get(
          `/KimMais.API.Generica/${user.TokenUsuario}/${user.CodigoUsuario}/TipoCartao%2FObterTipoCartaoValor%3FIdTipoCartao%3D${servico.ListaTipoCartao[0].CodigoTipoCartao}`,
        )
        .then(response => {
          if (Array.isArray(response.data.ListaObjeto) && response.data.ListaObjeto.length > 0) {
            setServicoelecionado({
              ServicoDigital: servico,
              TipoCartaoValor: response.data.ListaObjeto[0],
            });
            setModalIsOpen(true);
          } else {
            setServicoelecionado(undefined);
            addAlert({
              title: 'Erro',
              description: 'Erro ao comunicar com serviço, tente mais tarde',
              type: 'error',
            });
          }
        })
        .catch(() => {
          setServicoelecionado(undefined);
          addAlert({
            title: 'Erro',
            description: 'Erro ao comunicar com serviço, tente mais tarde',
            type: 'error',
          });
        });
    },
    [user, servicosDigitais, addAlert],
  );

  const closeModal = useCallback(() => {
    setModalIsOpen(false);
    setServicoelecionado(undefined);
  }, []);

  const handleSubmit = useCallback(
    data => {
      formRef.current?.setErrors({});
      Yup.object()
        .required()
        .shape({
          CodigoAssinante: Yup.string().test(
            'required',
            'CPF ou Código de assinante não pode ser vazio ou conter espaços',
            value => {
              return (
                !servicoSelecionado.TipoCartaoValor.hasCodigoAssinante ||
                (value?.length > 0 && !value.match(/[ ]/g))
              );
            },
          ),
          TipoCartao: Yup.number().required().min(0, 'selecione um valor'),
        })
        .validate(data, {
          abortEarly: false,
        })
        .then(value => {
          setModalIsOpen(false);
          let tipoCartao = servicoSelecionado.TipoCartaoValor.itens[value.TipoCartao];
          addShoppingBag({
            CodigoUsuario: user.CodigoUsuario,
            CodigoUsuarioCartao: 0,
            CodigoTipoCartao: tipoCartao.CodigoTipoCartao,
            TipoCartaoValor: tipoCartao.CodigoTipoCartaoValor,
            CodigoOperadora: servicoSelecionado.ServicoDigital.CodigoOperadora,
            TipoPedido: TipoPedidoEnum.ServicoDigitais,
            ValorRecarga: tipoCartao.ValorTipoCartao,
            Nome: servicoSelecionado.ServicoDigital.NomeFantasia,
            Detalhes: 'Recarga',
            IconeUrl: servicoSelecionado.ServicoDigital.UrlLogoOperadora,
            CodigoAssinante: servicoSelecionado.TipoCartaoValor.hasCodigoAssinante
              ? value.CodigoAssinante
              : '',
          });
          addAlert({
            title: 'Sucesso',
            description: 'Item adicionado no carrinho',
            type: 'success',
          });
        })
        .catch(error => {
          if (error instanceof Yup.ValidationError) {
            const errors = getValidationErrors(error);
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            formRef.current?.setErrors(errors);
            setTimeout(() => {
              formRef.current?.setErrors({});
            }, 3000);
          }
          addAlert({
            title: 'Erro',
            description: 'Erro ao adicionar item ao carrinho',
            type: 'error',
          });
        });
      window.scrollTo(0, 0);
    },
    [user, servicoSelecionado, addShoppingBag, addAlert],
  );

  return (
    <Column>
      <div className="d-flex mt-4 ml-5">
        <HeaderLinkHolder>
          <HeaderLink to="/">Home&nbsp;</HeaderLink>
          <FakeHeaderLink className="highlight">/ Conteúdos Digitais</FakeHeaderLink>
        </HeaderLinkHolder>
      </div>
      <Container>
        <Loading loading={loading} />
        {servicosDigitais.map((e, i) => (
          <CardLogo
            key={e.CodigoOperadora}
            servIndex={i}
            handleClick={openModal}
            imgSrc={e.UrlLogoOperadora}
          />
        ))}
        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles}>
          <ModalInside>
            <Form ref={formRef} onSubmit={handleSubmit}>
              <ModalLogoImage
                className="logo"
                src={servicoSelecionado?.ServicoDigital.UrlLogoOperadora}
                alt={'logo ' + servicoSelecionado?.ServicoDigital.NomeFantasia}
              />
              {servicoSelecionado?.TipoCartaoValor.hasCodigoAssinante && (
                <>
                  <Input name="CodigoAssinante" props={{ type: 'text' }} />
                  <p style={{ fontWeight: 'bold', fontSize: '14px' }}>CPF ou Código do Assinante</p>
                </>
              )}
              <RadioContainer>
                <CustomRadioButton
                  name="TipoCartao"
                  divProps={{
                    style: {
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-around',
                    },
                  }}
                  options={
                    servicoSelecionado
                      ? servicoSelecionado.TipoCartaoValor.itens.map((e, i) => ({
                          render: input => (
                            <CardRadio key={e.CodigoTipoCartao} value={e.ValorTipoCartao}>
                              {input}
                            </CardRadio>
                          ),
                          props: {
                            id: `cardValueRadio${e.CodigoTipoCartao}`,
                            value: i,
                            defaultChecked: i === 0,
                          },
                        }))
                      : []
                  }
                />
              </RadioContainer>
              <p style={{ fontWeight: 'bold', fontSize: '14px' }}>Valor do Crédito</p>
              <SobreHolder
                dangerouslySetInnerHTML={{ __html: servicoSelecionado?.TipoCartaoValor.Sobre }}
              />
              <Button type="submit">Adicionar ao carrinho</Button>
            </Form>
          </ModalInside>
        </Modal>
      </Container>
    </Column>
  );
};

export default DigitalContent;
