import React, { useState, useCallback, useRef, useContext } from 'react';
import { TiPlus } from 'react-icons/ti';
import Modal from 'react-modal';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Card, ModalContainer } from './styles';
import Button from '../../ui/button';
import Input from '../../ui/input';
import api from '../../../services/api';
import Loading from '../../ui/loading';
import { useAuth } from '../../../hooks/auth';
import getValidationErrors from '../../../utils/getValidationErrors';
import { useAlert } from '../../../hooks/alert';
import { CreditCardPageContext } from '../../../pages/CreditCard';
import { CreditCardData } from '../../../hooks/creditCard';
import {
  validateCreditCardNumber,
  validateCVV,
  validateName,
} from '../../../utils/inputValidator';
import { PopoverHeader, PopoverBody, UncontrolledPopover } from 'reactstrap';

import Select from '../../ui/select';
import Label from '../../ui/label';
import { useEffect } from 'react';
import { Column, Row } from '../../ui/layout';

const creditCardType = require('credit-card-type');

interface UFFormData {
  CodigoUF: number;
  SiglaUF: string;
  NomeUF: string;
}

const adyenEncrypt = require('adyen-cse-web');
const cseKey: string =
  /* hml */ '10001|C2E37312B601C640EEE2838CDB2B8C46A09A622FA4EADCFCFAD7916D5D43F8CAE31559F79D84BF1AC40CD3C3F7AB164361412334ADE2E239CE6D183A81E9C90912BC7352307C4E5A7FC8581834A8E0A286B3D2DE3F666DB92C67EA6EB9A5766D56B7EC70903255B0730DA4F10EB0CAE1F6ADF09BD8339A763F68872C3812DDDAF8F3971BCE1BAA736D00AC9C5D5442C9341FFDD9F6B20DFB5B08F2F6C5CCA84D08BE86BF86671DE27DC955D3A6334D8A49A3F543873C234CC15B6A5FE0A01EC04AA5F60CE0D9EBFF3792122269373DBBCDEF9E2B042A01B90BE59F9869AF50C99805BD231E112187F429C89296DDA52D8531D09FB9E97D110B222FADF5B2781F'; //'10001|B9278AC87C32EE40E75DED5BC9D8AE903D22939C639ABB8D7C9C32D029C8CFB5B53B0B0E99CC6F2CE212573B72360C5DDAB6855F1E124E74AA9433F2E9297934558F69D9B7D03448AA39149F1D3DE490EBF89FE0144C0A811319D1CB7282B15D0D1EDF9C4A50D7296FC5259297CBFB2DA0C8368D79A62D79F39748086359A5D69BCB16CBCA72E096634B8733D5DF8D5066C520841C77011B0B18864559D3E5EC99DE940AA6F9D627B5BA377B9B438057809B09FCDDAEC592744AD406FF96E5DF5353501F43C51045CF38F55593910BCE8B90BABE8BF7460CE61E7C4BF01256389B08F8A919D0A6E904A059F5D37B6E194777D3E737D71468B407C6B3A82D60DD';
/* pdr */ const cseOptions: any = {};
const cseInstance = adyenEncrypt.createEncryption(cseKey, cseOptions);

Modal.setAppElement('#root');

const isSmallWidth = window.matchMedia('(max-width: 1000px)').matches;

const isSmallHeight = window.matchMedia('(max-height: 500px)').matches;

const customStyles: Modal.Styles = {
  content: isSmallWidth
    ? {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: isSmallHeight ? '' : '90vmin',
        maxHeight: '90%',
        height: isSmallHeight ? '80%' : '',
        borderRadius: '15px',
        overflow: 'auto',
        padding: '10px 20px',
      }
    : {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '480px',
        height: '550px',
        borderRadius: '15px',
        overflow: 'auto',
        paddingLeft: '20px',
        paddingRight: '20px',
      },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

const EmptyCard: React.FC<CreditCardData> = props => {
  const { user } = useAuth();
  const { addAlert } = useAlert();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [autoCep, setAutoCep] = useState('');
  const [ufList, setUfList] = useState<UFFormData[]>();

  const [popoverOpen, setPopoverOpen] = useState(false);

  const { reload } = useContext(CreditCardPageContext);

  const formRef = useRef<FormHandles>(null);

  const toggleOpen = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const togglePopover = useCallback(() => {
    setPopoverOpen(prev => !prev);
  }, []);

  useEffect(() => {
    api
      .get(`KimMais.Api.Generica/0/0/UF%2FObterTodasUFs`)
      .then(response => {
        setUfList(response.data.ListaObjeto);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get(
        `KimMais.Api.ObterListaEnderecoUsuario/${user.TokenUsuario}/${user.CodigoUsuario}`,
      )
      .then(response => {
        if (isOpen === true && formRef.current) {
          if (
            response.data.Status === 0 &&
            Array.isArray(response.data.ListaObjeto) &&
            response.data.ListaObjeto.length > 0
          ) {
            let endereco = response.data.ListaObjeto[0];
            formRef.current.setData({
              ...formRef.current.getData(),
              CEP: endereco.CEP,
              Logradouro: endereco.Logradouro,
              NomeMunicipio: endereco.NomeMunicipio,
              SiglaUF: endereco.SiglaUF,
              NomeBairro: endereco.NomeBairro,
              ComplementoLogradouro: endereco.ComplementoLogradouro,
              NumeroLogradouro: endereco.NumeroLogradouro,
            });
            setLoading(false);
          } else {
            addAlert({
              title: response.data.Mensagem,
              type: 'info',
            });
            formRef.current.setData({
              ...formRef.current.getData(),
              Logradouro: '',
              NomeMunicipio: '',
              SiglaUF: '11_MG',
              NomeBairro: '',
            });
            setLoading(false);
          }
        }
      })
      .catch(() => {
        addAlert({
          title: 'Error',
          description: 'Erro ao buscar endereço do usuário',
          type: 'info',
        });
        formRef.current?.setData({
          ...formRef.current.getData(),
          Logradouro: '',
          NomeMunicipio: '',
          SiglaUF: '11_MG',
          NomeBairro: '',
        });
        setLoading(false);
      });
  }, [user, formRef, isOpen, addAlert]);

  useEffect(() => {
    const cep = autoCep.replace(/\D/g, '');
    if (formRef && cep.length === 8) {
      setLoading(true);
      api
        .get(`KimMais.Api.BuscarEnderecoCEP/0/0?cep=${cep}`)
        .then(response => {
          if (
            Array.isArray(response.data.ListaObjeto) &&
            response.data.ListaObjeto.length > 0
          ) {
            formRef.current.setData({
              ...formRef.current.getData(),
              Logradouro: response.data.ListaObjeto[0].logradouro,
              NomeMunicipio: response.data.ListaObjeto[0].cidade,
              SiglaUF: response.data.ListaObjeto[0].uf,
              NomeBairro: response.data.ListaObjeto[0].bairro,
              ComplementoLogradouro: '',
              NumeroLogradouro: '',
            });
            setLoading(false);
          } else {
            formRef.current.setErrors({
              ...formRef.current.getErrors(),
              CEP: response.data.Mensagem,
            });
            setTimeout(() => {
              formRef.current?.setErrors({});
            }, 3000);
            formRef.current.setData({
              ...formRef.current.getData(),
              Logradouro: '',
              NomeMunicipio: '',
              SiglaUF: '11_MG',
              NomeBairro: '',
              ComplementoLogradouro: '',
              NumeroLogradouro: '',
            });
          }
        })
        .catch(() => {
          formRef.current.setErrors({
            ...formRef.current.getErrors(),
            CEP: 'Erro ao buscar CEP',
          });
          setTimeout(() => {
            formRef.current?.setErrors({});
          }, 3000);
          formRef.current.setData({
            ...formRef.current.getData(),
            Logradouro: '',
            NomeMunicipio: '',
            SiglaUF: '11_MG',
            NomeBairro: '',
            ComplementoLogradouro: '',
            NumeroLogradouro: '',
          });
        });
    }
  }, [autoCep, formRef]);

  const handleSubmit = useCallback(
    data => {
      formRef.current.setErrors({});
      Yup.object()
        .required()
        .shape({
          numeroCartao: Yup.string()
            .required()
            .test(
              'validar',
              'Número deve conter 16 dígitos',
              validateCreditCardNumber,
            )
            .transform(value => `${value}`.replace(/[ ]/g, '')),
          nomeTitularCartao: Yup.string()
            .required()
            .test('validar', 'Informe o nome completo', validateName),
          validadeCartao: Yup.string()
            .required()
            .test('validar', 'Informe uma validade válida', value => {
              let result: boolean = false;
              if (value.replace(/[/]|[\d]/g, '').length === 0) {
                let date = value.split('/', 2); // MM/yy
                let month = Number(date[0]);
                let year = Number(date[1]);
                result = month > 0 && month < 13 && year > -1 && year < 100;
              }
              return result;
            }),
          cvvCartao: Yup.string()
            .required()
            .test('validar', 'Número deve conter 3 ou 4 dígitos', validateCVV),
          Logradouro: Yup.string().required('Informe o logradouro'),
          NumeroLogradouro: Yup.string()
            .required('Informe o número')
            .typeError('Informe o número'),
          ComplementoLogradouro: Yup.string(),
          NomeBairro: Yup.string().required('Informe o bairro'),
          NomeMunicipio: Yup.string().required('Informe o municipio'),
          SiglaUF: Yup.string().required('Informe a UF'),
          CEP: Yup.string()
            .required('Informe o CEP')
            .transform(value => value.replace(/\D/g, ''))
            .min(8, 'O CEP deve conter 8 caracteres')
            .max(8, 'O CEP deve conter 8 caracteres'),
        })
        .validate(data, {
          abortEarly: false,
        })
        .then(value => {
          setLoading(true);
          let expiryDate = value.validadeCartao.split('/', 2); // MM/yy
          let expiryMonth = expiryDate[0];
          let expiryYear = '20' + expiryDate[1];

          let cardEncryptedJson = cseInstance.encrypt({
            number: value.numeroCartao,
            cvc: value.cvvCartao,
            holderName: value.nomeTitularCartao,
            expiryMonth: expiryMonth,
            expiryYear: expiryYear,
            generationtime: new Date().toISOString(),
          });

          api
            .post(
              `KimMais.Api.IncluirCartaoCredito/${user.TokenUsuario}/${user.CodigoUsuario}`,
              {
                BandeiraCartaoCredito: creditCardType(value.numeroCartao)[0]
                  .type,
                NumeroCartaoCredito: value.numeroCartao,
                NomeCartaoCredito: value.nomeTitularCartao,
                MesCartaoCredito: expiryMonth,
                AnoCartaoCredito: expiryYear,
                CodigoSeguranca: value.cvvCartao,
                CartaoCriptografado: cardEncryptedJson,
                Cep: value.CEP,
                Logradouro: value.Logradouro,
                Numero: value.NumeroLogradouro,
                Complemento: value.ComplementoLogradouro,
                Bairro: value.NomeBairro,
                Cidade: value.NomeMunicipio,
                Estado: value.SiglaUF,
              },
            )
            .then(response => {
              setIsOpen(false);
              setLoading(false);
              window.scrollTo(0, 0);
              if (response.data.Status === 0) {
                reload();
                addAlert({
                  title: 'Sucesso',
                  description: 'Cartão de crédito adicionado com sucesso!',
                  type: 'success',
                });
              } else {
                addAlert({
                  title: 'Erro',
                  description: 'Erro ao cadastrar cartão, tente mais tarde',
                  type: 'error',
                });
              }
            })
            .catch(() => {
              setLoading(false);
              window.scrollTo(0, 0);
              addAlert({
                title: 'Erro',
                description: 'Erro ao comunicar com Adyen, tente mais tarde',
                type: 'error',
              });
            });
        })
        .catch(error => {
          if (error instanceof Yup.ValidationError) {
            const errors = getValidationErrors(error);
            formRef.current?.setErrors(errors);
            setTimeout(() => {
              formRef.current?.setErrors({});
            }, 3000);
          }
          addAlert({
            type: 'error',
            title: 'Erro',
            description:
              'Ocorreu um erro ao cadastrar cartão, cheque o formulário',
          });
        });
    },
    [user, formRef, reload, setLoading, addAlert],
  );

  return (
    <>
      <Card
        onClick={toggleOpen}
        className="cursor-pointer"
        style={{ background: '#E7E5E5' }}
      >
        <div className="d-flex align-items-center justify-content-center">
          <TiPlus style={{ color: '#FFFFFF' }} size={80} />
        </div>
      </Card>
      <Modal style={customStyles} isOpen={isOpen}>
        <Loading loading={loading} />
        <Form ref={formRef} onSubmit={handleSubmit}>
          <ModalContainer>
            <h3 className="text-center align-self-center">
              Cadastro de cartão
            </h3>
            <Label className="labelText mt-4">Cartão de crédito</Label>
            {isSmallWidth ? (
              isSmallHeight ? (
                <>
                  <div className="d-flex">
                    <div className="d-flex flex-column mr-1">
                      <Input
                        name="nomeTitularCartao"
                        props={{
                          placeholder: 'Nome do titular',
                          type: 'text',
                          tabIndex: 0,
                        }}
                      />
                      <Input
                        name="validadeCartao"
                        props={{
                          placeholder: 'Validade',
                          type: 'text',
                          mask: '99/99',
                          tabIndex: 2,
                        }}
                      />
                    </div>
                    <div className="d-flex flex-column ml-1">
                      <Input
                        name="numeroCartao"
                        props={{
                          placeholder: 'Número',
                          type: 'text',
                          mask: '9999 9999 9999 9999',
                          tabIndex: 1,
                        }}
                      />

                      <Input
                        name="cvvCartao"
                        props={{
                          placeholder: 'CVV',
                          type: 'text',
                          maxLength: 4,
                          tabIndex: 3,
                        }}
                      />
                      <Label id="popover" className="textCVV">
                        O que é cvv?
                      </Label>
                    </div>
                  </div>
                  <Label className="labelText mt-4">Endereço de cobrança</Label>
                  <div className="d-flex">
                    <div className="d-flex flex-column mr-1">
                      <Input
                        name="CEP"
                        props={{
                          placeholder: 'CEP',
                          mask: '99999-999',
                          onChange: event => setAutoCep(event.target.value),
                          tabIndex: 5,
                        }}
                      />
                      <Input
                        name="Logradouro"
                        props={{
                          placeholder: 'Endereço',
                          tabIndex: 7,
                        }}
                      />
                      <Input
                        name="NumeroLogradouro"
                        props={{
                          placeholder: 'Número',
                          tabIndex: 9,
                        }}
                      />
                      <Input
                        name="ComplementoLogradouro"
                        props={{
                          placeholder: 'Complemento',
                          tabIndex: 11,
                        }}
                      />
                    </div>
                    <div className="d-flex flex-column ml-1">
                      <Input
                        name="NomeBairro"
                        props={{
                          placeholder: 'Bairro',
                          tabIndex: 6,
                        }}
                      />
                      <Input
                        name="NomeMunicipio"
                        props={{
                          placeholder: 'Cidade',
                          tabIndex: 8,
                        }}
                      />
                      <Select
                        name="SiglaUF"
                        required
                        defaultValue=""
                        tabIndex={10}
                      >
                        {Array.isArray(ufList) &&
                          ufList.map(e => {
                            return (
                              <option value={e.SiglaUF}>{e.NomeUF}</option>
                            );
                          })}
                      </Select>
                    </div>
                  </div>
                  <Row gap="12px" style={{ width: '100%', marginTop: '12px' }}>
                    <Button type="submit">Cadastrar</Button>
                    <Button color="secondary" onClick={toggleOpen}>
                      Cancelar
                    </Button>
                  </Row>
                </>
              ) : (
                <>
                  <Input
                    name="nomeTitularCartao"
                    props={{ placeholder: 'Nome do titular', type: 'text' }}
                  />
                  <Input
                    name="numeroCartao"
                    props={{
                      placeholder: 'Número',
                      type: 'text',
                      mask: '9999 9999 9999 9999',
                    }}
                  />
                  <Input
                    name="validadeCartao"
                    props={{
                      placeholder: 'Validade',
                      type: 'text',
                      mask: '99/99',
                    }}
                  />
                  <Input
                    name="cvvCartao"
                    props={{ placeholder: 'CVV', type: 'text', maxLength: 4 }}
                  />
                  <Label id="popover" className="textCVV">
                    O que é cvv?
                  </Label>
                  <Label className="labelText mt-4">Endereço de cobrança</Label>
                  <Input
                    name="CEP"
                    props={{
                      placeholder: 'CEP',
                      mask: '99999-999',
                      onChange: event => setAutoCep(event.target.value),
                    }}
                  />
                  <Input
                    name="Logradouro"
                    props={{
                      placeholder: 'Endereço',
                    }}
                  />
                  <Input
                    name="NumeroLogradouro"
                    props={{
                      placeholder: 'Número',
                    }}
                  />
                  <Input
                    name="ComplementoLogradouro"
                    props={{
                      placeholder: 'Complemento',
                    }}
                  />
                  <Input
                    name="NomeBairro"
                    props={{
                      placeholder: 'Bairro',
                    }}
                  />
                  <Input
                    name="NomeMunicipio"
                    props={{
                      placeholder: 'Cidade',
                    }}
                  />
                  <Select name="SiglaUF" required defaultValue="">
                    {Array.isArray(ufList) &&
                      ufList.map(e => {
                        return <option value={e.SiglaUF}>{e.NomeUF}</option>;
                      })}
                  </Select>
                  <Row gap="12px" style={{ width: '100%', marginTop: '12px' }}>
                    <Button type="submit">Cadastrar</Button>
                    <Button color="secondary" onClick={toggleOpen}>
                      Cancelar
                    </Button>
                  </Row>
                </>
              )
            ) : (
              <>
                <div className="d-flex">
                  <div className="d-flex flex-column mr-1">
                    <Input
                      name="nomeTitularCartao"
                      props={{
                        placeholder: 'Nome do titular',
                        type: 'text',
                        tabIndex: 1,
                      }}
                    />
                    <Input
                      name="validadeCartao"
                      props={{
                        placeholder: 'Validade',
                        type: 'text',
                        mask: '99/99',
                        tabIndex: 3,
                      }}
                    />
                  </div>
                  <div className="d-flex flex-column ml-1">
                    <Input
                      name="numeroCartao"
                      props={{
                        placeholder: 'Número',
                        type: 'text',
                        mask: '9999 9999 9999 9999',
                        tabIndex: 2,
                      }}
                    />

                    <Input
                      name="cvvCartao"
                      props={{
                        placeholder: 'CVV',
                        type: 'text',
                        maxLength: 4,
                        tabIndex: 4,
                      }}
                    />
                    <Label id="popover" className="textCVV">
                      O que é cvv?
                    </Label>
                  </div>
                </div>
                <Label className="labelText mt-4">Endereço de cobrança</Label>
                <div className="d-flex">
                  <div className="d-flex flex-column mr-1">
                    <Input
                      name="CEP"
                      props={{
                        placeholder: 'CEP',
                        mask: '99999-999',
                        onChange: event => setAutoCep(event.target.value),
                        tabIndex: 5,
                      }}
                    />
                    <Input
                      name="Logradouro"
                      props={{
                        placeholder: 'Endereço',
                        tabIndex: 7,
                      }}
                    />
                    <Input
                      name="NumeroLogradouro"
                      props={{
                        placeholder: 'Número',
                        tabIndex: 9,
                      }}
                    />
                    <Input
                      name="ComplementoLogradouro"
                      props={{
                        placeholder: 'Complemento',
                        tabIndex: 11,
                      }}
                    />
                  </div>
                  <div className="d-flex flex-column ml-1">
                    <Input
                      name="NomeBairro"
                      props={{
                        placeholder: 'Bairro',
                        tabIndex: 6,
                      }}
                    />
                    <Input
                      name="NomeMunicipio"
                      props={{
                        placeholder: 'Cidade',
                        tabIndex: 8,
                      }}
                    />
                    <Select
                      name="SiglaUF"
                      required
                      defaultValue=""
                      tabIndex={10}
                    >
                      {Array.isArray(ufList) &&
                        ufList.map(e => {
                          return <option value={e.SiglaUF}>{e.NomeUF}</option>;
                        })}
                    </Select>
                  </div>
                </div>
                <Column gap="12px" style={{ width: '100%', marginTop: '12px' }}>
                  <Button type="submit">Cadastrar</Button>
                  <Button color="secondary" onClick={toggleOpen}>
                    Cancelar
                  </Button>
                </Column>
              </>
            )}
          </ModalContainer>
          <UncontrolledPopover
            trigger="legacy"
            placement="bottom"
            isOpen={popoverOpen}
            target="popover"
            toggle={togglePopover}
          >
            <PopoverHeader>O que é CVV?</PopoverHeader>
            <PopoverBody>
              O código de segurança possui três ou quatro dígitos e está
              localizado no verso do seu cartão de crédito.
            </PopoverBody>
          </UncontrolledPopover>
        </Form>
      </Modal>
    </>
  );
};

export default EmptyCard;
