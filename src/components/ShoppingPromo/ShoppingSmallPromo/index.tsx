import React, { useState, useEffect, useCallback } from 'react';

import { NumberToReais } from '../../../utils/printHelper';
import { ShoppingCupomData, ShoppingOfertaData, Palette, paletteArray } from '../';

import { LinkButton } from '../styles';
import {
  SmallPromoCard,
  SmallPromoCardHeader,
  SmallPromoCardOptions,
  SmallPromoCardHr,
  SmallPromoContent,
  SmallPromoStoreHeader,
  SmallPromoAbout,
  PromoThumbnail,
  SmallPromoCardFooter,
  HeartIcon
} from './styles';

const ShoppingSmallPromo: React.FC<ShoppingCupomData | ShoppingOfertaData> = (props) => {

  const [palette, setPalette] = useState<Palette>();

  useEffect(() => {
    setPalette(paletteArray[0])
  }, []);

  const renderBody = useCallback(() => {
    let result: React.ReactNode = <></>;
    if (typeof (props as any).codCupomOferta != 'undefined') {
      let resultData: ShoppingCupomData = props as ShoppingCupomData;
      result = (
        <>
          <SmallPromoContent>
            <SmallPromoStoreHeader theme={{ color: palette?.secondaryColor }}>
              {resultData.nomeLoja}
            </SmallPromoStoreHeader>
            <SmallPromoAbout>
              <PromoThumbnail src={resultData.thumbnailCupom} />
              <SmallPromoCardHeader>{resultData.nomeCupomOferta}</SmallPromoCardHeader>
              <label>{resultData.valorDesconto}% de desconto</label>
            </SmallPromoAbout>
          </SmallPromoContent>
          <SmallPromoCardHr />
          <SmallPromoCardFooter>
            <LinkButton
              theme={{
                color: palette?.tertiaryColor,
                backgroundColor: palette?.secondaryColor
              }}
              href={resultData.linkCupomOferta}
              target="_blank"
            >
              Eu quero
            </LinkButton>
          </SmallPromoCardFooter>
        </>
      );
    } else {
      let resultData: ShoppingOfertaData = props as ShoppingOfertaData;
      result = (
        <>
          <SmallPromoContent>
            <SmallPromoStoreHeader theme={{ color: palette?.secondaryColor }}>
              {resultData.nomeLoja}
            </SmallPromoStoreHeader>
            <SmallPromoAbout>
              <PromoThumbnail src={resultData.thumbnailOferta} />
              <SmallPromoCardHeader>{resultData.nomeOferta}</SmallPromoCardHeader>
              <label>{resultData.valorOriginal != null && <del>&nbsp;de {NumberToReais(resultData.valorOriginal)}&nbsp;</del>} por {NumberToReais(resultData.valorOferta)}</label>
            </SmallPromoAbout>
          </SmallPromoContent>
          <SmallPromoCardHr />
          <SmallPromoCardFooter>
            <LinkButton
              theme={{
                color: palette?.tertiaryColor,
                backgroundColor: palette?.secondaryColor
              }}
              href={resultData.linkOferta}
              target="_blank"
            >
              Eu quero
            </LinkButton>
          </SmallPromoCardFooter>
        </>
      );
    }

    return result;
  }, [palette, props])

  return (
    <SmallPromoCard theme={{
      backgroundColor: palette?.primaryColor
    }}>
      <SmallPromoCardOptions>
        <HeartIcon />
      </SmallPromoCardOptions>
      {renderBody()}
    </SmallPromoCard>
  );
}

export default ShoppingSmallPromo;
