import React from 'react';

import { BodyP, Title } from 'components/ui/typography';
import Button from 'components/ui/button';
import { IlImportant } from 'components/ui/illustrations';
import { Column } from 'components/ui/layout';

import { useVias } from './viasHook';

const SegundaViaAvisoBloqueio: React.FC = () => {
  const { onNext } = useVias();

  return (
    <>
      <Column align="center" justify="center" gap="12px" flex="1">
        <IlImportant size="100px" />
        <Title align="center">Atenção</Title>
        <BodyP>
        Para solicitar a 2ª via de um cartão de transporte ele precisa estar bloqueado. Clique no botão abaixo e confira a lista dos seus cartões bloqueados.
        </BodyP>
      </Column>
      <Button onClick={onNext}>Ver lista</Button>
    </>
  );
};

export default SegundaViaAvisoBloqueio;
