import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import Loading from '../../components/ui/loading';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from './styles';
import { HeaderLinkHolder } from '../Shopping/styles';
import HeaderLink, { FakeHeaderLink } from '../../components/HeaderLink';
import { Column } from 'components/ui/layout';

const TermsOfUse: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/KimMais.Api.ConsultaTermoDeUso/0/0?tipoTermoUso=1`).then(response => {
      setLoading(false);
      const TermsResponse: any = response.data.ListaObjeto[0].DescTermoDeUso;

      const h = document.getElementById('termsU');
      h.insertAdjacentHTML('afterbegin', TermsResponse);
    });
  }, [user]);

  return (
    <Column>
      <Loading loading={loading} />
      <div className="d-flex">
        <HeaderLinkHolder>
          <HeaderLink to="/">Home&nbsp;</HeaderLink>
          <FakeHeaderLink className="highlight">/ Termos de Uso</FakeHeaderLink>
        </HeaderLinkHolder>
      </div>
      <Container>
        <div id="termsU" />
      </Container>
    </Column>
  );
};

export default TermsOfUse;
