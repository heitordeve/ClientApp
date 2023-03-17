import React from 'react';

import Button from '../../ui/button';
import Card from '../../ui/card';
import { Column } from '../../ui/layout';
import { BodySpan } from '../../ui/typography';
import { MdDirectionsBus } from 'react-icons/md';
import { primaryColor } from '../../../styles/consts';
import { IcFavorite, IcFavorited } from 'components/ui/icons';
import { Linha, TipoServico, } from 'dtos/linha';

interface CardOnibusProp {
  linha: Linha;
  isFavorite: boolean;
  canFavorite: boolean;
  selected?: boolean;
  onClick: (linha: Linha) => void;
  onFavorited?: (linha: Linha, favorito: boolean) => void;
}

const CardOnibus: React.FC<CardOnibusProp> = ({
  linha,
  isFavorite,
  canFavorite,
  selected,
  onClick,
  onFavorited,
}) => {
  return (
    <Card
      theme="border"
      color={selected ? 'primary' : 'gray-3'}
      padding="20px 15px"
      border
      gap="12px"
      onClick={() => onClick(linha)}
    >
      <Column justify="center">
        <Card flex="0" theme="light" color="primary" padding="2px 6px" radius="6px" align="center">
          <MdDirectionsBus />
          {linha.TipoServico === TipoServico.Linha && (
            <BodySpan color="black">{linha.Codigo}</BodySpan>
          )}
        </Card>
      </Column>
      <Column flex="1" justify="center">
        <BodySpan>{linha.Nome}</BodySpan>
        <BodySpan>Tarifa: R$ {linha?.ValorTarifa?.toDecimalString()}</BodySpan>
      </Column>
      <Column justify="center">
        {(isFavorite || canFavorite) && (
          <Button
            theme="outlined"
            onClick={e => {
              e.stopPropagation();
              onFavorited?.(linha, !isFavorite);
            }}
          >
            {isFavorite && <IcFavorited size="30" color={primaryColor.color} />}
            {!isFavorite && <IcFavorite size="30" color={primaryColor.color} />}
          </Button>
        )}
      </Column>
    </Card>
  );
};

export default CardOnibus;
