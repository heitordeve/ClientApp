import React, { useState, useEffect } from 'react';

import { useAlert } from '../../../hooks/alert';
import styled from 'styled-components';
import { Column } from '../layout';
import LoadMini from './loadMini';

interface OverLoadingProps {
  children?: React.ReactNode;
  loading?: boolean;
  timeout?: number;
}

const Grid = styled(Column)`
  display: grid;
  grid-template: 100% / 100%;
`;

const Content = styled(Column)`
  grid-column: 1;
  grid-row: 1;
  height: 100%;
  width: 100%;
`;

const ContainerLoad = styled.div`
  height: 100%;
  width: 100%;
  grid-column: 1;
  grid-row: 1;
  z-index: 50;
  display: flex;
`;

const OverLoading: React.FC<OverLoadingProps> = ({ loading: loadingDefalt, children, timeout }) => {
  const [loading, setLoading] = useState<boolean>(loadingDefalt);
  const [, setTimeOutNumber] = useState<number>(0);

  const { addAlert } = useAlert();

  useEffect(() => {
    if (loading && timeout) {
      setTimeOutNumber(window.setTimeout(() => setLoading(false), timeout * 1000));
    } else if (timeout) {
      setTimeOutNumber(prev => {
        clearTimeout(prev);
        return 0;
      });
    }
  }, [timeout, loading, addAlert]);

  useEffect(() => {
    setLoading(loadingDefalt);
  }, [loadingDefalt]);
  return (
    <Grid flex="1">
      {loading && <ContainerLoad>{loading && <LoadMini loading={loading} />}</ContainerLoad>}
      <Content flex="1">
        <Column flex="1" align="stretch">
          <Column flex="1">{children}</Column>
        </Column>
      </Content>
    </Grid>
  );
};

export default OverLoading;
