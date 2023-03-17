import React, { useState, useEffect } from 'react';
import ReactLoading from 'react-loading';

import { useAlert } from '../../../hooks/alert';
import styled from 'styled-components';
import { Column } from '../layout';

interface LoadMiniProps {
  loading: boolean;
  timeout?: number;
}

const Container = styled(Column)`
  background: #ffffffbb;
`;

const LoadMini: React.FC<LoadMiniProps> = ({ loading, timeout }) => {
  const [stateLoading, setStateLoading] = useState<boolean>(loading);
  const [, setTimeOutNumber] = useState<number>(0);

  const { addAlert } = useAlert();

  useEffect(() => {
    setStateLoading(loading);
    if (loading && timeout) {
      setTimeOutNumber(
        window.setTimeout(() => setStateLoading(false), timeout * 1000),
      );
    } else if (timeout) {
      setTimeOutNumber(prev => {
        clearTimeout(prev);
        return 0;
      });
    }
  }, [timeout, loading, addAlert]);
  if (stateLoading) {
    return (
      <Container flex="1" justify="center" align="center">
        <ReactLoading
          type={'spin'}
          color="#6610f2"
          height={'50px'}
          width={'50px'}
          className="LoadingSpin"
        />
      </Container>
    );
  }
  return <></>;
};

export default LoadMini;
