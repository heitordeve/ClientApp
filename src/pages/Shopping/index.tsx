import React, { useState, useEffect, useCallback, useRef } from 'react';

import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import {
  InputGroupAddon,
  InputGroup
} from 'reactstrap';

import api from '../../services/api';
import { ShoppingCupomData, ShoppingOfertaData } from '../../components/ShoppingPromo';
import getValidationErrors from '../../utils/getValidationErrors';

import { useAuth } from '../../hooks/auth';
import { useAlert } from '../../hooks/alert';

import Loading from '../../components/ui/loading';
import Carousel from '../../components/Carousel';
import { SimpleSelect } from '../../components/ui/select';
import { SimpleInput } from '../../components/ui/input';
import HeaderLink, { FakeHeaderLink } from '../../components/HeaderLink';
import ShoppingBigPromo from '../../components/ShoppingPromo/ShoppingBigPromo';
import ShoppingSmallPromo from '../../components/ShoppingPromo/ShoppingSmallPromo';
import {
  Container,
  CarouselContainer,
  Header,
  HeaderLinkHolder,
  SearchForm,
  SearchButton,
  SearchIcon,
  BodyHolder,
  RowHolder
} from './styles';

enum ShoppingStateEnum {
  Home,
  Scroll,
  Scrolling,
  End
}

enum TipoPesquisaEnum {
  Todos,
  Ofertas,
  Cupons
}

interface CategoriaData {
  codCategoria: number;
  nomeCategoria: string;
}

interface PesquisaData {
  PalavraChave: string;
  Tipo: TipoPesquisaEnum;
  Categoria: number;
}

interface RenderScrollReturnData {
  nextPage: number;
  body: React.ReactNode;
}

const Shopping: React.FC = () => {

  const { user } = useAuth();
  const { addAlert } = useAlert();

  //Component
  const [compState, setCompState] = useState<ShoppingStateEnum>(ShoppingStateEnum.Home);
  const [loading, setLoading] = useState<boolean>(false);
  const [bodyHolder, setBodyHolder] = useState<React.ReactNode>();

  //Search bar
  const pesquisaFormRef = useRef<FormHandles>(null);
  const [categorias, setCategorias] = useState<CategoriaData[]>([]);
  const [searchData, setSearchData] = useState<PesquisaData>();

  //Scroll
  const [scrollPage, setScrollPage] = useState<number>();

  //Promise: response = 0 -> end
  const renderScroll = useCallback((page?: number, prevResult?: (ShoppingCupomData | ShoppingOfertaData)[]) => {
    return searchData? new Promise<RenderScrollReturnData>((resolve) => {
      setLoading(true);
      let currPage = page ? page : 0;
      api.get(`/KimMais.API.Generica/${user.TokenUsuario}/${user.CodigoUsuario}/Lomadee%2FSearchCuponsOfertas%3FqtdPag%3D100%26pag%3D${currPage}%26texto%3D${searchData.PalavraChave}`)
        .then(response => {
          setLoading(false);
          if (response.data.Status === 0) {
            if (Array.isArray(response.data.ListaObjeto) && response.data.ListaObjeto.length > 0) {
              let result = response.data.ListaObjeto as (ShoppingCupomData | ShoppingOfertaData)[];

              if (searchData.Categoria >= 0) {
                result = result.filter(e => e.codCategoria === searchData.Categoria);
              }

              switch (+searchData.Tipo) {
                case TipoPesquisaEnum.Ofertas:
                  result = result.filter(e => typeof (e as any).codCupomOferta === 'undefined');
                  break;
                case TipoPesquisaEnum.Cupons:
                  result = result.filter(e => typeof (e as any).codCupomOferta !== 'undefined');
                  break;
              }

              if (result.length > 20) {
                resolve({
                  nextPage: currPage + 1,
                  body: <>
                    {prevResult?.map(e => <ShoppingSmallPromo {...e} />)}
                    {result.map(e => <ShoppingSmallPromo {...e} />)}
                  </>
                });
              } else {
                renderScroll(currPage + 1, result.concat(prevResult)).then((data) => {
                  resolve(data);
                });
              }
            } else {
              resolve({
                nextPage: 0,
                body: <>{prevResult?.map(e => <ShoppingSmallPromo {...e} />)}</>
              });
            }
          } else {
            addAlert({
              title: 'Erro',
              description: 'Erro ao buscar ofertas, tente mais tarde',
              type: 'error'
            });
            resolve({
              nextPage: 0,
              body: <>{prevResult?.map(e => <ShoppingSmallPromo {...e} />)}</>
            });
          }
        }).catch(() => {
          setLoading(false);
          addAlert({
            title: 'Erro',
            description: 'Erro ao buscar ofertas, tente mais tarde',
            type: 'error'
          });
          resolve({
            nextPage: 0,
            body: <>{prevResult?.map(e => <ShoppingSmallPromo {...e} />)}</>
          });
        });
    }) : new Promise<RenderScrollReturnData>((resolve, reject) => {
      reject();
    });
  }, [user, searchData, addAlert]);

  const renderCuponsOfertasPrincipal = useCallback(() => {
    return new Promise<React.ReactNode[]>((resolve) => {
      api.get(`/KimMais.API.Generica/${user.TokenUsuario}/${user.CodigoUsuario}/Lomadee%2FCuponsOfertasPrincipal`)
        .then(response => {
          if (response.data.Status === 0) {
            resolve((response.data.ListaObjeto as ShoppingOfertaData[][])
              .reduce((prev, curr) => [...prev, ...curr], [])
              .reduce((prev, curr, index) => {
                let result = prev;
                if (index % 2 === 0) {
                  result = [...prev, <ShoppingBigPromo {...curr} palette={index} />];
                } else {
                  let lstIndex = result.length - 1;
                  result[lstIndex] = <>{result[lstIndex]}<ShoppingBigPromo {...curr} palette={index} /></>;
                }
                return result;
              }, [] as React.ReactNode[])
              .map(e => <CarouselContainer>{e}</CarouselContainer>));
          } else {
            addAlert({
              title: 'Erro',
              description: 'Erro ao buscar ofertas, tente mais tarde',
              type: 'error'
            });
            resolve([]);
          }
        }).catch(() => {
          addAlert({
            title: 'Erro',
            description: 'Erro ao buscar ofertas, tente mais tarde',
            type: 'error'
          });
          resolve([]);
        });
    });
  }, [user, addAlert]);

  const renderOfertasPaginado = useCallback(() => {
    return new Promise<React.ReactNode[]>((resolve) => {
      api.get(`/KimMais.API.Generica/${user.TokenUsuario}/${user.CodigoUsuario}/Lomadee%2FOfertasPaginado%3FqtdPag%3D1%26pag%3D0%26codLoja%3Dnull%26codCategoria%3D0`)
        .then(response => {
          if (response.data.Status === 0 && response.data.ListaObjeto.length > 0) {
            resolve((response.data.ListaObjeto[0] as ShoppingOfertaData[])
              .reduce((prev, curr, index) => {
                let result = prev;
                if (index % 3 === 0) {
                  result = [...prev, <ShoppingSmallPromo {...curr} />];
                } else {
                  let lstIndex = result.length - 1;
                  result[lstIndex] = <>{result[lstIndex]}<ShoppingSmallPromo {...curr} /></>;
                }
                return result;
              }, [] as React.ReactNode[])
              .map(e => <CarouselContainer>{e}</CarouselContainer>));
          } else {
            addAlert({
              title: 'Erro',
              description: 'Erro ao buscar ofertas, tente mais tarde',
              type: 'error'
            });
            resolve([]);
          }
        }).catch(() => {
          addAlert({
            title: 'Erro',
            description: 'Erro ao buscar ofertas, tente mais tarde',
            type: 'error'
          });
          resolve([]);
        });
    });
  }, [user, addAlert]);

  const renderHome = useCallback(() => {
    let copCarousel: React.ReactNode;
    setLoading(true);
    renderCuponsOfertasPrincipal().then(cuponsOfertasPrincipal => {
      copCarousel = cuponsOfertasPrincipal.length > 0 ? <Carousel width="80vw" pages={cuponsOfertasPrincipal} /> : <></>;
      renderOfertasPaginado().then(ofertasPaginado => {
        setBodyHolder(<>
          {copCarousel}
          {ofertasPaginado.length > 0 && <>
            <RowHolder>Mais +</RowHolder>
            <Carousel width="60vw" pages={ofertasPaginado} />
          </>}
        </>);
        setLoading(false);
      });
    });
  }, [renderCuponsOfertasPrincipal, renderOfertasPaginado]);

  useEffect(() => {
    if (scrollPage === 0) {
      setCompState(ShoppingStateEnum.End);
    }
  }, [scrollPage]);

  useEffect(() => {
    switch (+compState) {
      case ShoppingStateEnum.Home:
        renderHome();
        break;
      case ShoppingStateEnum.Scroll:
        renderScroll().then(data => {
          setScrollPage(data.nextPage);
          setBodyHolder(data.body);
          if (data.nextPage === 0) {
            setCompState(ShoppingStateEnum.End);
          } else {
            setCompState(ShoppingStateEnum.Scrolling);
          }
        });
        break;
      case ShoppingStateEnum.End:
        setBodyHolder(prev => <>
          {prev}
          <RowHolder>Nada por aqui!</RowHolder>
        </>)
        break;
    }
  }, [compState, renderHome, renderScroll]);

  const getCategoriasOfertas = useCallback((page?: number) => {
    setLoading(true);
    let currPage = page ? page : 1;
    api.get(`/KimMais.API.Generica/${user.TokenUsuario}/${user.CodigoUsuario}/Lomadee%2FCategoriasOfertas%3FqtdPag%3D20%26pag%3D${currPage}`)
      .then(response => {
        if (response.data.Status === 0) {
          if (Array.isArray(response.data.ListaObjeto) && response.data.ListaObjeto.length > 0 && Array.isArray(response.data.ListaObjeto[0]) && response.data.ListaObjeto[0].length > 0) {
            setCategorias(prev => [...prev, ...response.data.ListaObjeto[0]]);
            getCategoriasOfertas(currPage + 1);
          } else {
            setLoading(false);
          }
        } else {
          setLoading(false);
          addAlert({
            title: 'Erro',
            description: 'Erro ao buscar categorias, tente mais tarde',
            type: 'error'
          });
        }
      }).catch(() => {
        setLoading(false);
        addAlert({
          title: 'Erro',
          description: 'Erro ao buscar categorias, tente mais tarde',
          type: 'error'
        });
      });
  }, [user, addAlert]);

  const getCategoriasCupons = useCallback((page?: number) => {
    setLoading(true);
    let currPage = page ? page : 1;
    api.get(`/KimMais.API.Generica/${user.TokenUsuario}/${user.CodigoUsuario}/Lomadee%2FCategoriasCupons%3FqtdPag%3D20%26pag%3D${currPage}`)
      .then(response => {
        if (response.data.Status === 0) {
          if (Array.isArray(response.data.ListaObjeto) && response.data.ListaObjeto.length > 0 && Array.isArray(response.data.ListaObjeto[0]) && response.data.ListaObjeto[0].length > 0) {
            setCategorias(prev => [...prev, ...response.data.ListaObjeto[0]]);
            getCategoriasCupons(currPage + 1);
          } else {
            setLoading(false);
          }
        } else {
          setLoading(false);
          addAlert({
            title: 'Erro',
            description: 'Erro ao buscar categorias, tente mais tarde',
            type: 'error'
          });
        }
      }).catch(() => {
        setLoading(false);
        addAlert({
          title: 'Erro',
          description: 'Erro ao buscar categorias, tente mais tarde',
          type: 'error'
        });
      });
  }, [user, addAlert]);

  const handleTipoChange: React.ChangeEventHandler<HTMLSelectElement> = useCallback((event) => {
    setCategorias([]);
    switch (Number(event.currentTarget.value)) {
      case TipoPesquisaEnum.Cupons:
        getCategoriasCupons();
        break;
      case TipoPesquisaEnum.Ofertas:
        getCategoriasOfertas();
        break;
    }
  }, [getCategoriasCupons, getCategoriasOfertas]);

  const handleScroll: React.UIEventHandler<HTMLDivElement> = useCallback((event) => {
    if (event.currentTarget.scrollTop + event.currentTarget.clientHeight === event.currentTarget.scrollHeight) {
      event.currentTarget.scrollBy(0, -100);
      addAlert({
        title: 'Carregando...',
        description: 'Buscando mais ofertas no shopping',
        type: 'info'
      });
      renderScroll(scrollPage).then(data => {
        setScrollPage(data.nextPage);
        setBodyHolder(<>{bodyHolder}{data.body}</>);
      });
    }
  }, [scrollPage, bodyHolder, renderScroll, addAlert]);

  const handleSearch = useCallback((data: any) => {
    pesquisaFormRef?.current.setErrors({});
    Yup.object().required('Informe os dados para pesquisas').shape({
      Categoria: Yup.number()
        .typeError('Selecione uma categoria')
        .required('Selecione uma categoria'),
      Tipo: Yup.number()
        .typeError('Selecione um tipo')
        .required('Selecione um tipo'),
      PalavraChave: Yup.string()
        .required('Informe uma palavra chave')
    }).validate(data, {
      abortEarly: false
    }).then(value => {
      setCompState(ShoppingStateEnum.Scroll);
      setSearchData(value);
    }).catch(error => {
      if (error instanceof Yup.ValidationError) {
        pesquisaFormRef.current.setErrors(getValidationErrors(error));
        setTimeout(() => { pesquisaFormRef.current.setErrors({}); }, 3000);
      } else {
        addAlert({
          title: 'Erro',
          description: 'Verifique os dados na barra de pesquisa',
          type: 'error'
        });
      }
    })
  }, [pesquisaFormRef, addAlert]);

  return <Container>
    <Loading loading={loading} />
    <Header>
      <HeaderLinkHolder>
        <HeaderLink to="/">
          Home&nbsp;
      </HeaderLink>
        <FakeHeaderLink className="highlight">
          / Shopping
      </FakeHeaderLink>
      </HeaderLinkHolder>
      <SearchForm ref={pesquisaFormRef} onSubmit={handleSearch}>
        <SimpleSelect name="Tipo" className="form-control" onChange={handleTipoChange}>
          <option value={TipoPesquisaEnum.Todos}>Todos os Tipos</option>
          <option value={TipoPesquisaEnum.Ofertas}>Em Ofertas</option>
          <option value={TipoPesquisaEnum.Cupons}>Em Cupons</option>
        </SimpleSelect>
        <SimpleSelect name="Categoria" className="form-control" >
          <option value={-1} >Todas as Categorias</option>
          {categorias.map(e => <option key={e.codCategoria} value={e.codCategoria}>{e.nomeCategoria}</option>)}
        </SimpleSelect>
        <InputGroup>
          <SimpleInput name="PalavraChave" props={{ placeholder: "O que está procurando hoje?", className: "form-control" }} />
          <InputGroupAddon addonType="append">
            <SearchButton type="submit" className="form-control" >
              <SearchIcon />
            </SearchButton>
          </InputGroupAddon>
        </InputGroup>
      </SearchForm>
    </Header>
    <BodyHolder onScroll={(compState === ShoppingStateEnum.Scrolling) ? handleScroll : undefined} >
      {bodyHolder}
    </BodyHolder>
  </Container>
}

export default Shopping;
