import React from 'react';

import { Title } from 'components/ui/typography/v2';
import { useVias } from './viasHook';
import { Column } from 'components/ui/layout';
import FormDadosComplementares from 'components/formularios/formDadosComplementares';

const DadosComplementares: React.FC = () => {
  const { onNext } = useVias();

  return (
    <Column gap="12px">
      <Title size="SB">Confirme as informações abaixo para continuar sua solicitação:</Title>
      <FormDadosComplementares submitLable="próximo" onChange={onNext} />
    </Column>
  );
};

export default DadosComplementares;
