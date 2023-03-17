import styled, { css } from 'styled-components';
import { cssIf } from 'styles';
import { ColorScheme, schemeMap } from '../../../styles/consts';
import { Justify, Aling } from '../layout';

interface BaseProps {
  color?: ColorScheme;
  margin?: string;
  whiteSpace?: 'nowrap' | 'normal';
  wordBreak?: 'break-all' | 'break-word';
  grow?: string | number;
  justify?: Justify;
  align?: Aling;
  flex?: string;
}

const BaseTypography = styled.span<BaseProps>`
  ${({ color }) =>
    color &&
    css`
      color: ${schemeMap.get(color)?.color};
    `}
  display: flex;
  &.strong,
  strong {
    font-weight: 700;
  }
  ${({ wordBreak }) => cssIf('word-break', wordBreak)};
  ${({ whiteSpace }) => cssIf('white-space', whiteSpace)};
  ${({ margin }) => cssIf('margin', margin)};
  ${({ grow }) => cssIf('flex-grow', grow)};
  ${({ justify }) => cssIf('justify-content', justify)};
  ${({ align }) => cssIf('align-items', align)};
  ${({ flex }) => cssIf('flex', flex)};
  line-height: 1.2;
  margin: 0;
`;

export const Headline = styled(BaseTypography).attrs({ as: 'h2' })<BaseProps>`
  font-size: 24px;
  font-weight: 700;
`;
export const Title = styled(BaseTypography).attrs({ as: 'h3' })<BaseProps>`
  font-size: 20px;
  font-weight: 700;
`;
export const Subtitle = styled(BaseTypography).attrs({ as: 'h4' })<BaseProps>`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 0;
`;
export const Strong = styled(BaseTypography)<BaseProps>`
  font-size: 16px;
  font-weight: 700;
`;
export const BodySpan = styled(BaseTypography)<BaseProps>`
  font-size: 16px;
  font-weight: 400;
`;
export const Label = styled(BaseTypography).attrs({ as: 'label' })<BaseProps>`
  font-size: 16px;
  font-weight: 400;
`;
export const BodyP = styled(BaseTypography).attrs({ as: 'p' })<BaseProps>`
  font-size: 16px;
  font-weight: 400;
`;
export const Small = styled(BaseTypography).attrs({ as: 'small' })<BaseProps>`
  font-size: 14px;
  font-weight: 400;
`;
export const SSmall = styled(BaseTypography).attrs({ as: 'small' })<BaseProps>`
  font-size: 12px;
  font-weight: 400;
`;
export const UnordenedList = styled.ul`
  list-style-position: inside;
`;
