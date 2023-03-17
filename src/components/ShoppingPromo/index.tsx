export interface ShoppingOfertaData {
  codOferta: number;
  nomeOferta: string;
  codCategoria: number;
  nomeCategoria: string;
  linkOferta: string;
  thumbnailOferta: string;
  valorOferta: number;
  valorOriginal: number | null;
  codLoja: number;
  nomeLoja: string;
  topOferta: boolean;
}

export interface ShoppingCupomData {
  codCupomOferta: number;
  nomeCupomOferta: string;
  descCodigoCupomOferta: string;
  valorDesconto: number;
  codLoja: number;
  nomeLoja: string;
  thumbnailCupom: string;
  codCategoria: number;
  nomeCategoria: string;
  dataVigencia: string;
  linkCupomOferta: string;
  Novo: boolean;
}

export interface Palette {
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
}

export const paletteArray: Palette[] = [
  {
    primaryColor: '#FFFFFF',
    secondaryColor: '#FF5555',
    tertiaryColor: '#FFFFFF'
  },
  {
    primaryColor: '#FF5555',
    secondaryColor: '#FFFFFF',
    tertiaryColor: '#6B6576'
  },
  {
    primaryColor: '#000000',
    secondaryColor: '#672ED7',
    tertiaryColor: '#FFFFFF'
  },
  {
    primaryColor: '#6C63FF',
    secondaryColor: '#FFFFFF',
    tertiaryColor: '#6B6576'
  }
]
