import React, { useState } from 'react';

import { Card } from 'components/ui/card';
import ModalNovoCartao from './modalNovo';
import { IcRoundPlus } from 'components/ui/icons';

const NovoCartaoTransporte: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <Card
        onClick={() => setIsOpen(true)}
        color="gray-2"
        align="center"
        justify="center"
        flex="none"
        height="262px"
        width="410px"
        maxWidth="100vw"
      >
        <IcRoundPlus color="#FFFFFF" size={80} />
      </Card>
      {isOpen && <ModalNovoCartao onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default NovoCartaoTransporte;
