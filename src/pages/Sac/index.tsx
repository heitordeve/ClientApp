import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, HeaderLinkHolder } from './styles';
import HeaderLink, { FakeHeaderLink } from 'components/HeaderLink';
import { Column } from 'components/ui/layout';

const Sac: React.FC = () => {
  return (
    <Column>
      <div className="d-flex w-100 pt-4 pl-5">
        <HeaderLinkHolder>
          <HeaderLink to="/">Home&nbsp;</HeaderLink>
          <FakeHeaderLink className="highlight">/ Sac</FakeHeaderLink>
        </HeaderLinkHolder>
      </div>
      <Container>
        <iframe
          loading="eager"
          title="perguntas do sac"
          src="https://www.tolvnow.com/chatmobile/2_entry.php?key=10a72d115d78fd54c1ce87ce8bf6f07e&vars=&depto=4516&page=&_=1568641497"
        />
      </Container>
    </Column>
  );
};

export default Sac;
