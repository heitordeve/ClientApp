import { shade } from 'polished';

export class Scheme {
  constructor(name: string, color: string, accent: string, text: string = white) {
    this.name = name;
    this.color = color;
    this.hover = shade(0.2, color);
    this.accent = accent;
    this.text = text;
  }
  name: string;
  color: string;
  hover: string;
  accent: string;
  text: string;
}

export const white = '#FFF';
export const gray1 = '#F1F1F1';
export const gray2 = '#D1CED6';
export const gray3 = '#a4a4a4';
export const gray4 = '#707070';
export const gray5 = '#494949';
export const gray6 = '#838383';
export const black = '#000';
export const primary = '#672ed7';
export const primaryLight = '#d9d0f8';
export const secondary = '#FF5F00';
export const secondaryLight = '#F9D2C3';
export const success = '#007E74';
export const info = '#0068E1';
export const warning = '#DB6D28';
export const danger = '#D53D42';
export const backgroundPrimary = '#7762AF';
export const TextColor = gray5;

export const colorMap = new Map<string, string>();
colorMap.set('white', white);
colorMap.set('gray-1', gray1);
colorMap.set('gray-2', gray2);
colorMap.set('gray-3', gray3);
colorMap.set('gray-4', gray4);
colorMap.set('gray-5', gray5);
colorMap.set('black', black);
colorMap.set('TextColor', TextColor);
colorMap.set('primary', primary);
colorMap.set('secondary', secondary);
colorMap.set('success', success);
colorMap.set('warning', warning);
colorMap.set('danger', danger);
colorMap.set('info', info);

export type Colors =
  | 'white'
  | 'gray-1'
  | 'gray-2'
  | 'gray-3'
  | 'gray-4'
  | 'gray-5'
  | 'black'
  | 'TextColor'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger';

export const whiteColor = new Scheme('white', white, gray3, TextColor);
export const gray1Color = new Scheme('gray-1', gray1, primary, primary);
export const gray2Color = new Scheme('gray-2', gray2, primary, primary);
export const gray3Color = new Scheme('gray-3', gray3, primary, primary);
export const gray4Color = new Scheme('gray-4', gray4, primary, primary);
export const gray5Color = new Scheme('gray-5', gray5, primary, primary);
export const blackColor = new Scheme('black', black, gray3, white);
export const primaryColor = new Scheme('primary', primary, primaryLight);
export const secondaryColor = new Scheme('secondary', secondary, secondaryLight, white);
export const successColor = new Scheme('success', success, '#FFFFFF');
export const dangerColor = new Scheme('danger', danger, '#F9ECEA');
export const warningColor = new Scheme('warning', warning, '#FFF2E2');
export const infoColor = new Scheme('info', info, '#FFFFFF');

export type ColorScheme =
  | 'white'
  | 'gray-1'
  | 'gray-2'
  | 'gray-3'
  | 'gray-4'
  | 'gray-5'
  | 'black'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | null
  | undefined;

export const schemeMap = new Map<string, Scheme>();
schemeMap.set('white', whiteColor);
schemeMap.set('gray-1', gray1Color);
schemeMap.set('gray-2', gray2Color);
schemeMap.set('gray-3', gray3Color);
schemeMap.set('gray-4', gray4Color);
schemeMap.set('gray-5', gray5Color);
schemeMap.set('black', blackColor);
schemeMap.set('primary', primaryColor);
schemeMap.set('secondary', secondaryColor);
schemeMap.set('success', successColor);
schemeMap.set('danger', dangerColor);
schemeMap.set('warning', warningColor);
schemeMap.set('info', infoColor);

export function getScheme(name: string, defalt: string): string {
  return schemeMap.get(name)?.color || defalt;
}

export const mediaBreakpoint = {
  xsMax: '329px',
  smMax: '578px',
  mdMin: '579px',
  mdMax: '991px',
  lgMin: '992px',
};

export const zIndex = {
  header: 0,
  bottomNav: 0,
  fab: 140,
  dropdown: 145,
  modal: 150,
  load: 200,
};

export const shadow = {
  1: '0 2px 1px -0 rgb(0 0 0 / 0.25), .5px 2px 1px rgb(0 0 0 / 0.16), .5px 2px 1px rgb(0 0 0 / 0.10)',
  2: '0 2px 2px -1px rgba(0 0 0/ 0.25), .5px 2px 1px rgb(0 0 0 / 0.16), .5px 2px 1px 1px rgb(0 0 0 / 0.10)',
  3: '0 2px 3px -2px rgba(0 0 0/ 0.25), .5px 2px 1px rgb(0 0 0 / 0.16), .5px 2px 2px 2px rgb(0 0 0 / 0.10)',
  4: '0 2px 4px -3px rgba(0 0 0/ 0.25), .5px 2px 1px rgb(0 0 0 / 0.16), .5px 2px 3px 3px rgb(0 0 0 / 0.10)',
  5: '0 2px 5px -4px rgba(0 0 0/ 0.25), .5px 2px 1px rgb(0 0 0 / 0.16), .5px 2px 4px 4px rgb(0 0 0 / 0.10)',
};
