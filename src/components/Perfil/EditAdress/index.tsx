import React, { useState, useCallback, useRef, useEffect } from 'react';

//services
import api from '../../../services/api';

//hooks
import { useAuth } from '../../../hooks/auth';

//componets
import Modal from 'react-modal'
import Input from '../../ui/input';
import Button from '../../ui/button';
import { FormGroup, Label } from 'reactstrap';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { FormHandles } from '@unform/core';

import { FormList } from './styles';

import { useAlert } from '../../../hooks/alert';

import getValidationErrors from '../../../utils/getValidationErrors';

import Select from '../../ui/select';
import Loading from '../../ui/loading';

Modal.setAppElement('#root');

const isSmallWidth = window.matchMedia("(max-width: 1000px)").matches;

const customStyles = {
  content: isSmallWidth? {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '90vmin',
    maxHeight: '90%',
    borderRadius: '15px',
    overflow: 'auto',
    paddingLeft: '40px',
    paddingRight: '40px',
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
    maxHeight: '550px',
    borderRadius: '15px',
    overflow: 'auto',
    paddingLeft: '90px',
    paddingRight: '90px',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
}

interface AdressFormData {
  Logradouro: string;
  NumeroLogradouro: number;
  ComplementoLogradouro: string;
  NomeBairro: string;
  NomeMunicipio: string;
  SiglaUF: string;
  CEP: string;
  CodigoEnderecoUsuario: number;
}

interface EditAdressFormData {
  Logradouro: string;
  NumeroLogradouro: string; // number
  ComplementoLogradouro: string;
  NomeBairro: string;
  NomeMunicipio: string;
  SiglaUF: string;
  CEP: string; // string number
  TipoLogradouro: string;
  EnderecoPrincipal: boolean;
}

interface UFFormData {
  CodigoUF: number;
  SiglaUF: string;
  NomeUF: string;
}

const EditAdress: React.FC = () => {

  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const formRef = useRef<FormHandles>(null);
  const { addAlert } = useAlert();
  const [ loading, setLoading ] = useState(false);
  const [autoCep, setAutoCep] = useState('');
  const [adress, setAdress] = useState<AdressFormData>();
  const [ ufList, setUfList ] = useState<UFFormData[]>();


  useEffect(() => {
    api
    .get(`KimMais.Api.Generica/0/0/UF%2FObterTodasUFs`)
    .then(response => {
      setUfList(response.data.ListaObjeto);
    }).catch(() => {

    });
  }, []);

  useEffect(() => {
    api.get(`KimMais.Api.ObterListaEnderecoUsuario/${user.TokenUsuario}/${user.CodigoUsuario}`)
      .then(response => {
        if (Array.isArray(response.data.ListaObjeto) && response.data.ListaObjeto.length > 0) {
          setAdress(response.data.ListaObjeto[0]);
        } else {
          addAlert({
            title: 'Erro',
            description: 'Erro ao buscar endereço, tente mais tarde',
            type: 'error'
          });
        }
      }).catch(() => {
        addAlert({
          title: 'Erro',
          description: 'Erro ao buscar endereço, tente mais tarde',
          type: 'error'
        });
      });
  }, [user, addAlert]);

  const handleEditAdress = useCallback(
    async (data: EditAdressFormData) => {
      setLoading(true);
      try {
        await api.post(`kimMais.Api.EditarEnderecoUsuario/${user.TokenUsuario}/${user.CodigoUsuario}`,
          {
            CodigoUsuario: user.CodigoUsuario,
            CodigoEnderecoUsuario: adress.CodigoEnderecoUsuario,
            TipoLogradouro: data.TipoLogradouro,
            Logradouro: data.Logradouro,
            NumeroLogradouro: data.NumeroLogradouro,
            ComplementoLogradouro: data.ComplementoLogradouro,
            NomeBairro: data.NomeBairro,
            NomeMunicipio: data.NomeMunicipio,
            SiglaUF: String(data.SiglaUF.split('_').slice(-1)),
            CodigoUF: Number(data.SiglaUF.split('_', 1)),
            CEP: data.CEP,
            EnderecoPrincipal: data.EnderecoPrincipal,
          })
          .then(response => {
            setLoading(false);
            addAlert({
              title: 'Endereço:',
              description: response.data.Mensagem,
              type: 'info',
            });
            window.location.reload();
          });
      } catch (error) {
        setLoading(false);
        addAlert({
          title: 'Erro ao comunicar com o servidor',
          description: error,
          type: 'error',
        });
      }
    }, [user, addAlert, adress]);

  const handleSubmit = useCallback(async (data: EditAdressFormData) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      formRef.current?.setErrors({});

      const schema = Yup.object()
        .required('dados não cadastrados')
        .shape({
          // #endregion
          Logradouro: Yup.string().required('informe o logradouro'),
          NumeroLogradouro: Yup.string()
            .required('informe o número')
            .typeError('informe o número'),
          ComplementoLogradouro: Yup.string(),
          NomeBairro: Yup.string().required('informe o bairro'),
          NomeMunicipio: Yup.string().required('informe o municipio'),
          SiglaUF: Yup.string()
            .required('informe a UF'),
          CEP: Yup.string()
            .required('informe o CEP')
            .transform(value => value.replace(/\D/g, ''))
            .min(8, 'O CEP deve conter 8 caracteres')
            .max(8, 'O CEP deve conter 8 caracteres'),
        });

      await schema
        .validate(data, {
          abortEarly: false,
        })
        .then(value => {
          handleEditAdress({
            TipoLogradouro: '',
            Logradouro: value.Logradouro,
            NumeroLogradouro: value.NumeroLogradouro,
            ComplementoLogradouro: value.ComplementoLogradouro,
            NomeBairro: value.NomeBairro,
            NomeMunicipio: value.NomeMunicipio,
            SiglaUF: value.SiglaUF,
            CEP: value.CEP,
            EnderecoPrincipal: true,
          });
          setIsOpen(false);
        });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        formRef.current?.setErrors(errors);
        setTimeout(() => { formRef.current?.setErrors({}); }, 3000);
        addAlert({
          title: 'Error',
          type: 'error',
        });
      }
    }
  }, [formRef, addAlert, handleEditAdress]);

  useEffect(() => {
    const cep = autoCep.replace(/\D/g, '');
    if (formRef && cep.length === 8) {
      setLoading(true);
      api.get(`KimMais.Api.BuscarEnderecoCEP/0/0?cep=${cep}`)
        .then(response => {
          if (Array.isArray(response.data.ListaObjeto) && response.data.ListaObjeto.length > 0) {
            let listObjUf = response.data.ListaObjeto[0].uf;
            let uf = ufList.find(e => listObjUf === e.SiglaUF);
            formRef.current.setData({
              ...formRef.current.getData(),
              Logradouro: response.data.ListaObjeto[0].logradouro,
              NomeMunicipio: response.data.ListaObjeto[0].cidade,
              SiglaUF: `${uf.CodigoUF}_${uf.SiglaUF}`,
              NomeBairro: response.data.ListaObjeto[0].bairro,
            });
            setLoading(false);
          } else {
            formRef.current.setErrors({
              ...formRef.current.getErrors(),
              CEP: response.data.Mensagem,
            });
            setTimeout(() => { formRef.current?.setErrors({}); }, 3000);
            formRef.current.setData({
              ...formRef.current.getData(),
              Logradouro: '',
              NomeMunicipio: '',
              SiglaUF: '11_MG',
              NomeBairro: '',
            })
            setLoading(false);
          }
        }).catch(() => {
          formRef.current.setErrors({
            ...formRef.current.getErrors(),
            CEP: 'Erro ao buscar CEP'
          });
          setTimeout(() => { formRef.current?.setErrors({}); }, 3000);
          formRef.current.setData({
            ...formRef.current.getData(),
            Logradouro: '',
            NomeMunicipio: '',
            SiglaUF: '11_MG',
            NomeBairro: '',
          })
          setLoading(false);
        })
    }
  }, [autoCep, formRef, ufList]);

  return (
    <>
      <Button style={{}} className="btn-atualizar-dados" onClick={() => setIsOpen(true)}>Alterar Endereço</Button>
      <Modal
        style={customStyles}
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        contentLabel="Alterar Endereco"
      >
        <Loading loading={loading} />
        <FormList>
          <h3 className="text-center">Alterar Endereço</h3>
          <Form className="form" onSubmit={handleSubmit} ref={formRef}>
            <FormGroup className="form-group">
              <Label>CEP</Label>
              <Input
                name="CEP"
                props={{
                  placeholder: 'CEP',
                  mask: '99999-999',
                  onChange: event => setAutoCep(event.target.value),
                }}
              />
            </FormGroup>
            <FormGroup className="form-group">
              <Label>Endereço</Label>
              <Input
                name="Logradouro"
                props={{
                  placeholder: 'Endereço',
                }}
              />
            </FormGroup>
            <FormGroup className="form-group">
              <Label>Número</Label>
              <Input
                name="NumeroLogradouro"
                props={{
                  placeholder: 'Número',
                }}
              />
            </FormGroup>
            <FormGroup className="form-group">
              <Label>Complemento</Label>
              <Input
                name="ComplementoLogradouro"
                props={{
                  placeholder: 'Complemento',
                }}
              />
            </FormGroup>
            <FormGroup className="form-group">
              <Label>Bairro</Label>
              <Input
                name="NomeBairro"
                props={{
                  placeholder: 'Bairro',
                }}
              />
            </FormGroup>
            <FormGroup className="form-group">
              <Label>Cidade</Label>
              <Input
                name="NomeMunicipio"
                props={{
                  placeholder: 'Cidade',
                }}
              />
            </FormGroup>
            <FormGroup className="form-group">
              <Label>UF</Label>
              <Select name="SiglaUF" required defaultValue="">
                {Array.isArray(ufList) && ufList.map(e => {
                  return (
                    <option value={`${e.CodigoUF}_${e.SiglaUF}`}>{e.NomeUF}</option>
                  )
                })}
              </Select>
            </FormGroup>
            <Button
              type="submit"
              className=""
            >
              Salvar Alterações
                            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              color="secondary"
            >
              Cancelar
                            </Button>
          </Form>
        </FormList>
      </Modal>
    </>
  )
}

export default EditAdress;
