import React, { useCallback, useState } from 'react';
import { Column, Row } from '../layout';
import { FiChevronLeft } from 'react-icons/fi';
import { primaryColor } from '../../../styles/consts';
import { Title } from '../typography';
import { OverLoading } from '../loading';

import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import Button from '../button';
import { media, breakpoint } from 'styles';

interface ContentProps {
  maxWidth?: string;
}
const Content = styled(Column)<ContentProps>`
  width: 100%;
`;
const Container = styled(Column)<ContentProps>`
  ${media.min(breakpoint.md)} {
    padding: 12px;
  }
`;

interface FullBackMainProps {
  title: string;
  loading?: boolean;
  children?: React.ReactNode;
  maxWidth?: string;
  minHeight?: string;
  backUrl?: string;
  beforeBack?: (back: () => void, cancel: () => void) => JSX.Element;
}

const FullBackMain: React.FC<FullBackMainProps> = ({
  title,
  loading,
  backUrl,
  children,
  beforeBack,
}) => {
  const history = useHistory();
  const [modal, setModal] = useState<boolean>(false);
  const executeBack = useCallback(() => {
    if (history.action === 'POP' || backUrl) {
      const url = (backUrl?.startsWith('/') ? '' : '/') + backUrl;
      history.replace(url);
    } else {
      history.goBack();
    }
  }, [history, backUrl]);
  const onBack = useCallback(() => {
    if (beforeBack) {
      setModal(true);
    } else {
      executeBack();
    }
  }, [executeBack, beforeBack]);
  return (
    <Container>
      <Row justify="center" flex="1">
        <Content grow="0">
          <Row grow="0">
            <Column grow="0">
              <Button theme="outlined" onClick={() => onBack()}>
                <FiChevronLeft size="40" color={primaryColor.color} />
              </Button>
            </Column>
            <Title justify="center" grow="1" color="primary" align="center" margin="0px">
              {title}
            </Title>
            <Column style={{ width: '72px' }}></Column>
          </Row>
          <OverLoading loading={loading}>{children}</OverLoading>
        </Content>
      </Row>
      {modal && beforeBack(executeBack, () => setModal(false))}
    </Container>
  );
};

export default FullBackMain;
