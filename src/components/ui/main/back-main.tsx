import React, { useCallback, useState } from 'react';
import { Column, Row } from '../layout';
import { FiChevronLeft } from 'react-icons/fi';
import { primaryColor } from '../../../styles/consts';
import { Title } from '../typography';
import { Card } from '../card';
import { OverLoading } from '../loading';

import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import Button from '../button';
import { media, breakpoint } from 'styles';

interface ContentProps {
  maxWidth?: string;
}
const Content = styled(Column)<ContentProps>`
  ${media.min(breakpoint.md)} {
    max-width: ${({ maxWidth }) => maxWidth ?? '500px'};
  }
  ${media.max(breakpoint.sm)} {
    background: #fff;
  }
  max-width: unset;
  width: 100%;
`;
const Container = styled(Column)<ContentProps>`
  ${media.min(breakpoint.md)} {
    padding: 12px;
  }
  ${media.max(breakpoint.sm)} {
    flex: 1;
  }
`;

interface BackMainProps {
  title: string;
  loading?: boolean;
  children?: React.ReactNode;
  maxWidth?: string;
  minHeight?: string;
  backUrl?: string;
  onBack?: () => boolean;
  beforeBack?: (back: () => void, cancel: () => void) => JSX.Element;
}

const BackMain: React.FC<BackMainProps> = ({
  title,
  loading,
  backUrl,
  children,
  beforeBack,
  onBack,
  minHeight = '300px',
  maxWidth = '450px',
}) => {
  const history = useHistory();
  const [modal, setModal] = useState<boolean>(false);
  const executeBack = useCallback(() => {
    if (history.action === 'POP' || backUrl) {
      const tmpUrl = backUrl ?? '';
      const url = (tmpUrl.startsWith('/') ? '' : '/') + tmpUrl;
      history.replace(url);
    } else {
      history.goBack();
    }
  }, [history, backUrl]);
  const _onBack = useCallback(() => {
    if (onBack && !onBack()) {
      return;
    } else if (beforeBack) {
      setModal(true);
    } else {
      executeBack();
    }
  }, [executeBack, beforeBack, onBack]);
  return (
    <Container>
      <Row justify="center" flex="1">
        <Content grow="0" maxWidth={maxWidth}>
          <Row grow="0">
            <Column grow="0">
              <Button theme="outlined" onClick={() => _onBack()}>
                <FiChevronLeft size="40" color={primaryColor.color} />
              </Button>
            </Column>
            <Title justify="center" grow="1" color="primary" align="center">
              {title}
            </Title>
            <Column style={{ width: '72px' }}></Column>
          </Row>
          <Card minHeight={minHeight}>
            <OverLoading loading={loading}>{children}</OverLoading>
          </Card>
        </Content>
      </Row>
      {modal && beforeBack(executeBack, () => setModal(false))}
    </Container>
  );
};

export default BackMain;
