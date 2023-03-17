import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import Loading from '../../components/ui/loading';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from './styles';
import { TiPlus } from 'react-icons/ti';
import { HeaderLinkHolder } from '../Shopping/styles';
import HeaderLink, { FakeHeaderLink } from '../../components/HeaderLink';

interface OperatorFormData {
  codigoOperadora: number;
  NomeFantasia: string;
  UrlTaxaServico: string;
  UrlConveniencia: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
  }),
);


const Convenience: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<OperatorFormData[]>([]);
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };


  useEffect(() => {

    async function getListaCartaoUsuario() {
      let listaCartaoUsuario;
      await api.get(
        `/KimMais.Api.Generica/${user.TokenUsuario}/${user.CodigoUsuario}/UsuarioCartao%2FObterListaCartaoIdUsuarioNovo`,
      ).then(responseCartao => {
        listaCartaoUsuario = responseCartao.data.ListaObjeto;
      });
      return listaCartaoUsuario;
    }
    async function getListaConveniencia(responseDataCartao: any) {

      let data: any[] = [];
      let vetorOperadora = [];
      for (let index = 0; index < responseDataCartao.length; index++) {
        let codOperadora = responseDataCartao[index].CodigoOperadora;
        if (vetorOperadora.indexOf(codOperadora) === -1) {
          vetorOperadora.push(codOperadora);
          await api.get(
            `/KimMais.Api.ObterUrlTaxaServico/${user.TokenUsuario}/${user.CodigoUsuario}?operadora=${codOperadora}`,
          ).then(responseOpe => {
            let responseDataOpe = responseOpe.data.ListaObjeto;
            for (let indexOpe = 0; indexOpe < responseDataOpe.length; indexOpe++) {
              data.push({
                'codigoOperadora': responseDataCartao[indexOpe].codigoOperadora,
                'NomeFantasia': responseDataOpe[indexOpe].NomeFantasia,
                'UrlConveniencia': responseDataOpe[indexOpe].UrlConveniencia,
                'UrlTaxaServico': responseDataOpe[indexOpe].UrlTaxaServico
              });
            }

          });
        }
      }
      return data;

    }
    async function executarTarefa() {
      let listaCartao = await getListaCartaoUsuario();
      let listaConveniencia = await getListaConveniencia(listaCartao);
      setList(listaConveniencia);
      setLoading(false);
    }

    executarTarefa();

  }, [user]);

  return (

    <Container>
      <Loading loading={loading} />
      <div className="d-flex w-100">
        <HeaderLinkHolder>
          <HeaderLink to="/">
            Home&nbsp;
          </HeaderLink>
          <FakeHeaderLink className="highlight">
            / Conveniência
          </FakeHeaderLink>
        </HeaderLinkHolder>
      </div>

      <div className="text-center">
        <h3 className="font-weight-bold mt-3 mb-5">Conveniência</h3>
      </div>


      <>
        <div className="contentConvenience">
          <div className={classes.root}>
            <Accordion expanded={expanded === '20'} onChange={handleChange('20')}>
              <AccordionSummary
                expandIcon={<TiPlus style={{ color: '#F76C39' }} />}
                aria-controls={`20bh-content`}
                id={`20bh-header`}
              >
                <Typography className="assunto">
                  Recargas e Serviços Digitais
                      </Typography>
              </AccordionSummary>
              <>
                <AccordionDetails className="flex-column p-4">
                  <iframe title="Recarga Serviço" src={'https://www.kimmais.com.br/arquivos/recargaservico/index.html'} style={{ border: 'none', height: '1000px' }} />
                </AccordionDetails>
              </>
            </Accordion>
            <Accordion expanded={expanded === '30'} onChange={handleChange('30')}>
              <AccordionSummary
                expandIcon={<TiPlus style={{ color: '#F76C39' }} />}
                aria-controls={`30bh-content`}
                id={`30bh-header`}
              >
                <Typography className="assunto">
                  Carteira Digital
                      </Typography>
              </AccordionSummary>
              <>
                <AccordionDetails className="flex-column p-4">
                  <iframe title="Carteira Digital" src={'https://www.kimmais.com.br/arquivos/carteiradigital/index.html'} style={{ border: 'none', height: '1000px' }} />
                </AccordionDetails>
              </>
            </Accordion>
            {list?.map((e, i) => {
              return (
                <Accordion expanded={expanded === `${i}`} key={i} onChange={handleChange(`${i}`)}>
                  <AccordionSummary
                    expandIcon={<TiPlus style={{ color: '#F76C39' }} />}
                    aria-controls={`${i}bh-content`}
                    id={`${i}bh-header`}
                  >
                    <Typography className="assunto">
                      {e.NomeFantasia}
                    </Typography>
                  </AccordionSummary>
                  <>
                    <AccordionDetails className="flex-column p-4">
                      <iframe title={`Conveniencia ${e.NomeFantasia}`} src={e.UrlConveniencia} style={{ border: 'none', height: '1000px' }} />
                    </AccordionDetails>
                  </>
                </Accordion>
              )
            })}

          </div>
        </div>
      </>
    </Container >
  );
};

export default Convenience;
