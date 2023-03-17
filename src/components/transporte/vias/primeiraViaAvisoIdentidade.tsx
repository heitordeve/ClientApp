import React from 'react';

import { BodyP, Title } from 'components/ui/typography';
import Button from 'components/ui/button';
import { IlImportant } from 'components/ui/illustrations';
import { Column } from 'components/ui/layout';

import { useVias } from './viasHook';

const PrimeiraViaAvisoIdentidade: React.FC = () => {
  const { onNext } = useVias();

  return (
    <>
      <Column align="center" justify="center" gap="12px" flex="1">
        <IlImportant size="100px" />
        <Title align="center">Comprove sua identidade</Title>
        <BodyP>
          Para solicitar a 1ª via do seu cartão de transporte, precisamos que você tire fotos de seu
          documento para comprovar sua identidade.
        </BodyP>
      </Column>
      <Button onClick={onNext}>Vamos lá</Button>
    </>
  );
};

export default PrimeiraViaAvisoIdentidade;
