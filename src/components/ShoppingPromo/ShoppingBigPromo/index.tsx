import React, { useState, useEffect, useCallback } from 'react';
import { useAlert } from '../../../hooks/alert';
import { NumberToReais } from '../../../utils/printHelper';

import { ShoppingOfertaData, Palette, paletteArray } from '../';

import { LinkButton } from '../styles';
import {
  BigPromoCard,
  BigPromoCardHead,
  BigPromoCardHeader,
  BigPromoCardSecondaryHeader,
  BigPromoCardOptions,
  BigPromoCardHr,
  BigPromoContent,
  PromoThumbnail,
  BigPromoAbout,
  BigPromoCardFooter,
  HeartIcon,
  ShareIcon
} from './styles';

interface ShoppingBigPromoProps extends ShoppingOfertaData {
  palette: number;
}

const ShoppingBigPromo: React.FC<ShoppingBigPromoProps> = (props) => {

  const [ palette, setPalette ] = useState<Palette>();
  const { addAlert } = useAlert();

  useEffect(() => {
    setPalette(paletteArray[(props.palette % (paletteArray.length - 1)) + 1])
  }, [props]);

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(props.linkOferta).then(() => {
      addAlert({
        title: 'Copiado!',
        description: 'link copiado para área de transferência!',
        type: 'success'
      })
    });
  }, [props, addAlert]);

  return (
    <BigPromoCard
      theme={{
        backgroundColor: palette?.primaryColor,
      }}
    >
      <BigPromoCardHead>
        <BigPromoCardHeader>Melhores ofertas</BigPromoCardHeader>
        <BigPromoCardOptions>
          <HeartIcon />
          <ShareIcon onClick={handleShare} />
        </BigPromoCardOptions>
      </BigPromoCardHead>
      <BigPromoCardHr />
      <BigPromoContent>
        <PromoThumbnail src={props.thumbnailOferta} />
        <BigPromoAbout>
          <BigPromoCardSecondaryHeader>{props.nomeLoja}</BigPromoCardSecondaryHeader>
          <BigPromoCardSecondaryHeader>Promoção</BigPromoCardSecondaryHeader>
          <label>{props.nomeOferta}</label>
          { props.valorOriginal != null && <BigPromoCardSecondaryHeader><del>&nbsp;de {NumberToReais(props.valorOriginal)}&nbsp;</del></BigPromoCardSecondaryHeader>}
          <BigPromoCardHr />
          <BigPromoCardSecondaryHeader>por {NumberToReais(props.valorOferta)}</BigPromoCardSecondaryHeader>
        </BigPromoAbout>
      </BigPromoContent>
      <BigPromoCardFooter>
        <LinkButton
          theme={{
            color: palette?.tertiaryColor,
            backgroundColor: palette?.secondaryColor
          }}
          href={props.linkOferta}
          target="_blank"
        >
          Comprar agora
        </LinkButton>
      </BigPromoCardFooter>
    </BigPromoCard>
  );
}

export default ShoppingBigPromo;
