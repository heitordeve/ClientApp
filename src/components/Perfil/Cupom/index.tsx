import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Form } from '@unform/web';

import Modal from 'react-modal';

import { FormHandles } from '@unform/core';

import Loading from '../../ui/loading';

import 'bootstrap/dist/css/bootstrap.min.css';
import Input from '../../ui/input';
import Label from '../../ui/label';
import { useAuth } from '../../../hooks/auth';
import api from '../../../services/api';
import { useAlert } from '../../../hooks/alert';
import Button from '../../ui/button';
import { DropdownItem } from 'reactstrap';
import { FiTag } from 'react-icons/fi';

import { CupomStyle, TextInfo } from './styles';

interface ObterListaCupomDescontoResponse {
  CodigoUsuarioCupom: number;
  CodigoCupomDesconto: number;
  CodigoUsuario: number;
  DataCadastro: string;
  Cupom: {
    CodigoCupom: number;
    Cupom: string;
    CupomDescricao: string;
    DataCadastro: string;
    DataValidade: string;
    DataValidadeFormated: string;
    PercentualDesconto: number;
    CupomUsuario: string | null;
  }
}

const isSmallWidth = window.matchMedia("(max-width: 1000px)").matches;

const customStyles = {
  content: isSmallWidth?{
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '90vmin',
    height: '90%',
    borderRadius: '15px',
    overflow: 'auto',
    padding: '10px 40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'start',
  }
  :
  {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '480px',
    height: '500px',
    borderRadius: '15px',
    overflow: 'auto',
    paddingLeft: '90px',
    paddingRight: '90px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'start',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',

  },
};

const Cupom: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [cupons, setCupons] = useState<ObterListaCupomDescontoResponse[]>([]);
  const { addAlert } = useAlert();

  const formRef = useRef<FormHandles>(null);


  const reload = useCallback(() => {
        setLoading(true);
        api.get(`KimMais.Api.Generica/${user.TokenUsuario}/${user.CodigoUsuario}/CupomDesconto%2FObterListaCupomDesconto`)
          .then(response => {
            setLoading(false);
            if (response.data.Status === 0) {
              if (Array.isArray(response.data.ListaObjeto) && response.data.ListaObjeto.length > 0) {
                setCupons(response.data.ListaObjeto);
              }
            } else {
              addAlert({
                title: 'Erro',
                description: 'Cupom inválido ou não encontrado, tente mais tarde',
                type: 'error'
              });
            }
          }).catch(() => {
            setLoading(false);
            addAlert({
              title: 'Erro',
              description: 'Erro ao buscar cupom, tente mais tarde',
              type: 'error'
            });
          });
  }, [user, addAlert])

  useEffect(() => {
      reload();
  },[reload])

  const handleSubmit = useCallback((data) => {
    if (data.Cupom && data.Cupom.length > 0) {
      setLoading(true);
      api.post(`KimMais.Api.CadatrarCupomDesconto/${user.TokenUsuario}/${user.CodigoUsuario}/`, {
        Cupom: data.Cupom
      }).then(response => {
        formRef.current.reset();
        reload();
        setLoading(false);
        addAlert({
          title: 'Cupom',
          type: 'info',
          description: response.data.Mensagem,
        });
        window.scrollTo(0, 0);
      }).catch(() => {
        reload();
        setLoading(false);
        addAlert({
          title: 'Erro',
          type: 'error',
          description: 'Erro ao buscar cupom, tente mais tarde',
        });
        window.scrollTo(0, 0);
      });
    } else {
      formRef.current.setErrors({ Cupom: 'Informe o cupom' })
      setTimeout(() => { formRef.current.setErrors({}); }, 3000);
    }
  }, [user, reload, addAlert]);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  return (
    <>
      <DropdownItem type="button" className="dropdown" onClick={toggle}>
        <FiTag size={22} className="icon-menu" /> Promoções
            </DropdownItem>
      <Modal
        style={customStyles}
        isOpen={isOpen}
        onRequestClose={toggle}
        contentLabel="Cupom Modal"
      >
        <Loading loading={loading} />
        <div className="flex-column w-100">
          <div className="text-center">
            <h3 className="font-weight-bold mb-5 mt-3">Promoções</h3>
          </div>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <Label>Cupom</Label>
            <Input name="Cupom" props={{ placeholder: 'Insira o código do cupom' }} />
            <div className="d-flex flex-row">
            <Button type="submit">Cadastrar</Button>
            <div className="mr-1 ml-1"></div>
            <Button color="secondary" onClick={toggle}>Cancelar</Button>
            </div>

          </Form>

          {cupons &&
          <TextInfo>Cupons cadastrados:</TextInfo>
          }
          {cupons && cupons.map(e =>

          (
              <CupomStyle>
                  <div className="d-flex flex-column">
                  <p className="title">{e.Cupom.Cupom}</p>
                  <p className="description">{e.Cupom.CupomDescricao}</p>
                  </div>
                  <div className="d-flex flex-column">
                  <p className="title">Validade</p>
                  <p className="description">{new Date(e.Cupom.DataValidade).getDate()}/{new Date(e.Cupom.DataValidade).getMonth() + 1}/{new Date(e.Cupom.DataValidade).getFullYear()}</p>
                  </div>
              </CupomStyle>

          )

          )}
        </div>
      </Modal >

    </>
  );
};

export default Cupom;
