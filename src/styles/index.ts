
import { mediaBreakpoint, zIndex } from './consts';
interface Size {
  min?: string;
  max?: string
}
export const breakpoint: { xs: Size, sm: Size, md: Size, lg: Size } = {
  xs: { max: mediaBreakpoint.xsMax },
  sm: { max: mediaBreakpoint.smMax },
  md: { min: mediaBreakpoint.mdMin, max: mediaBreakpoint.mdMax },
  lg: { min: mediaBreakpoint.lgMin },
}

export const media = {
  min: (size: Size) => ` @media (min-width: ${size.min}) `,
  max: (size: Size) => ` @media (max-width: ${size.max})`,
  minMax: (sizeMin: Size, sizeMax: Size) => ` @media (min-width: ${sizeMin.min}) and (max-width: ${sizeMax.max})`,
}

export const cssIf = (prop: string, value: string | number) => value && `${prop}: ${value};`;
export { zIndex }
