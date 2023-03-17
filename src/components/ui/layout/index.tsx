import styled, { css } from 'styled-components';
import { cssIf, media, breakpoint } from 'styles';
import { Colors, colorMap } from '../../../styles/consts';

export type Aling = 'center' | 'flex-end' | 'flex-start' | 'stretch' | 'unset';
export type Justify =
  | 'center'
  | 'flex-end'
  | 'flex-start'
  | 'stretch'
  | 'unset'
  | 'space-around'
  | 'space-between'
  | 'space-evenly';

interface elementProps {
  width?: string;
  height?: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  maxHeight?: string;
  colorText?: Colors;
  padding?: string;
  smPadding?: string;
  background?: Colors | string;
}

export const Element = styled.div<elementProps>`
  ${({ width }) => cssIf('width', width)}
  ${({ height }) => cssIf('height', height)}
  ${({ minHeight }) => cssIf('min-height', minHeight)}
  ${({ minWidth }) => cssIf('min-width', minWidth)}
  ${({ maxWidth }) => cssIf('max-width', maxWidth)}
  ${({ maxHeight }) => cssIf('max-height', maxHeight)}
  ${({ padding }) => cssIf('padding', padding)}
  ${({ smPadding }) =>
    smPadding &&
    css`
      ${media.max(breakpoint.sm)} {
        padding: ${smPadding};
      }
    `}

  ${({ colorText }) =>
    colorText &&
    css`
      color: ${colorMap.get(colorText)};
    `}
  ${({ background }) =>
    background &&
    css`
      background: ${colorMap.get(background) ?? background};
    `}
`;

export interface BaseFlexProps extends elementProps {
  id?: string;
  flex?: number | string;
  grow?: number | string;
  basis?: string;
  align?: Aling;
  justify?: Justify;
  gap?: string;
  wrapp?: boolean;
  scroll?: boolean;
  radius?: string;
  overflow?: 'hidden' | 'auto';
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}
export const BaseFlex = styled(Element)<BaseFlexProps>`
  display: flex;
  ${({ grow }) => cssIf('flex-grow', grow)}
  ${({ flex }) => cssIf('flex', flex)}
  ${({ basis }) => cssIf('flex-basis', basis)}
  ${({ align }) => cssIf('align-items', align)}
  ${({ justify }) => cssIf('justify-content', justify)}
  ${({ gap }) => cssIf('gap', gap)}
  ${({ wrapp }) => wrapp && 'flex-wrap : wrap;'}
  ${({ scroll }) => scroll && 'overflow : auto;'}
  ${({ radius }) => cssIf('border-radius', radius)}
  ${({ overflow }) => cssIf('overflow', overflow)}
  hr {
    margin-top: 0;
    margin-bottom: 0;
  }
`;
type Direction = 'col' | 'row';
export interface FlexProps extends BaseFlexProps {
  direction?: Direction;
  sm?: Direction;
  md?: Direction;
  lg?: Direction;
  paddingLg?: string;
}
const getDirection = (direction: string) => (direction === 'col' ? 'column' : 'row');

const getFlexSize = (direction: Direction) => {
  return css`
    flex-direction: ${getDirection(direction)};
  `;
};

export const Flex = styled(BaseFlex)<FlexProps>`
  flex-direction: ${({ direction }) => getDirection(direction)};
  ${media.max(breakpoint.sm)} {
    ${({ sm }) => sm && getFlexSize(sm)}
  }
  ${media.minMax(breakpoint.md, breakpoint.md)} {
    ${({ md }) => md && getFlexSize(md)}
  }
  ${media.min(breakpoint.lg)} {
    ${({ lg }) => lg && getFlexSize(lg)}
    ${({ paddingLg }) => cssIf('padding', paddingLg)}
  }
`;

export const Column = styled(BaseFlex)<BaseFlexProps>`
  flex-direction: column;
`;
export const Row = styled(BaseFlex)<BaseFlexProps>`
  flex-direction: row;
`;
export const Hr = styled.div`
  border-top: 1px solid rgba(107, 101, 118, 0.2);
  border-radius: 10px;

  width: 100%;
  &.md {
    border-top-width: 4px;
  }
  &.lg {
    border-top-width: 6px;
  }
  &.margim {
    margin: 20px 0;
  }
`;
interface GridProps extends elementProps {
  grow?: number | string;
  align?: Aling;
  justify?: Justify;
  gap?: string;
  templateColumns?: string;
  templateRows?: string;
  autoRows?: string;
}

export const Grid = styled(Element)<GridProps>`
  display: grid;
  ${({ templateColumns }) => cssIf('grid-template-columns', templateColumns)}
  ${({ templateRows }) => cssIf('grid-template-rows', templateRows)}
  ${({ autoRows }) => cssIf('grid-auto-rows', autoRows)}
  ${({ align }) => cssIf('align-items', align)}
  ${({ justify }) => cssIf('justify-content', justify)}
  ${({ gap }) => cssIf('gap', gap)}
`;
