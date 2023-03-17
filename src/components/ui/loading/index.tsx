import React, { useState, useEffect } from 'react';
import ReactLoading from 'react-loading';
import Modal from 'react-modal';

import { useAlert } from '../../../hooks/alert';
import LoadMini from './loadMini';
import OverLoading from './overLoading';

interface LoadingProps {
  loading: boolean;
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '100%',
    background: '#FFF',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

const Loading: React.FC<LoadingProps> = ({ loading }) => {
  const [stateLoading, setStateLoading] = useState<boolean>(false);
  const [, setTimeOutNumber] = useState<number>(0);

  const { addAlert } = useAlert();

  useEffect(() => {
    setStateLoading(loading);
    if (loading) {
      setTimeOutNumber(
        window.setTimeout(function () {
          setStateLoading(false);
          addAlert({
            title: 'Timeout',
            description: 'Funcionalidade demorou para responder',
            type: 'info',
          });
        }, 60000),
      );
    } else {
      setTimeOutNumber(prev => {
        clearTimeout(prev);
        return 0;
      });
    }
    return () => {
      setTimeOutNumber(prev => {
        clearTimeout(prev);
        return 0;
      });
    };
  }, [loading, addAlert]);

  return (
    <Modal
      style={customStyles}
      isOpen={stateLoading}
      contentLabel="Loading Modal"
    >
      <ReactLoading
        type={'spin'}
        color="#6610f2"
        height={'5%'}
        width={'5%'}
        className="LoadingSpin"
      />
    </Modal>
  );
};

export { LoadMini, OverLoading };
export default Loading;
