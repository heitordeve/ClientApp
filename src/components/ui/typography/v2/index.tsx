import styled, { css } from 'styled-components';
import { cssIf } from 'styles';
import { ColorScheme, schemeMap } from 'styles/consts';

type textElgin = 'center'|'end'|'justify'|'start'

interface BaseProps {
  color?: ColorScheme;
  margin?: string;
  whiteSpace?: 'nowrap' | 'normal';
  wordBreak?: 'break-all' | 'break-word';
  align?: textElgin;
  flex?: string;
  size?: 'B' | 'SB' | 'R' | 'L';
}
const stromg = css`
  font-weight: bold;
`;
const semiStromg = css`
  font-weight: 600;
`;
const light = css`
  font-weight: 300;
`;

const BaseTypography = styled.span<BaseProps>`
  ${({ color }) =>
    color &&
    css`
      color: ${schemeMap.get(color)?.color};
    `}
  ${({ wordBreak }) => cssIf('word-break', wordBreak)};
  ${({ whiteSpace }) => cssIf('white-space', whiteSpace)};
  ${({ align }) => cssIf('text-align', align)};
  ${({ flex }) => cssIf('flex', flex)};
  margin: ${({ margin }) => margin ?? '0px'};

  font-family: 'Source Sans Pro', sans-serif;
  font-style: normal;
  font-weight: normal;

  ${({ size }) => {
    switch (size) {
      case 'B':
        return stromg;
      case 'SB':
        return semiStromg;
      case 'L':
        return light;
      default:
        return;
    }
  }};
  &.B,
  strong {
    ${stromg}
  }
  &.SB {
    ${semiStromg}
  }
  &.L,
  small {
    ${light}
  }
`;

export const Headline = styled(BaseTypography).attrs({ as: 'h2' })<BaseProps>`
  font-size: 24px;
  font-size: 1.5rem;
  line-height: 30px;
  line-height: 1.875rem;
`;
export const Title = styled(BaseTypography).attrs({ as: 'h3' })<BaseProps>`
  font-size: 20px;
  font-size: 1.25rem;
  line-height: 25px;
  line-height: 1.563rem;
`;
export const Subhead = styled(BaseTypography).attrs({ as: 'h4' })<BaseProps>`
  font-size: 16px;
  font-size: 1rem;
  line-height: 20px;
  line-height: 1.25rem;
`;
export const P = styled(BaseTypography).attrs({ as: 'p' })<BaseProps>`
  font-size: 14px;
  font-size: 0.875rem;
  line-height: 18px;
  line-height: 1.125rem;
`;
export const Span = styled(BaseTypography).attrs({ as: 'span' })<BaseProps>`
  font-size: 14px;
  font-size: 0.875rem;
  line-height: 14px;
  font-size: 0.875rem;
`;
export const Caption = styled(BaseTypography).attrs({ as: 'small' })<BaseProps>`
  font-size: 12px;
  font-size: 0.75rem;
  line-height: 15px;
  line-height: 0.938rem;
`;
