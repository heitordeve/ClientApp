import React, { useCallback, useState, memo } from 'react';
import ContentLoader from 'react-content-loader';

import { Colors, primaryColor } from 'styles/consts';
import { IcHide, IcShow } from '../icons';
import { Caption, P, Span } from '../typography/v2';
import { Row } from '../layout';
import styled from 'styled-components';

interface HideTextProps {
  text: string;
  defalutHiden: boolean;
  mask: string;
  onShow: () => boolean | Promise<boolean>;
  typograph?: 'p' | 'Caption' | 'Span';
  iconColor?: Colors;
  width?: string;
}
const TypographMap = new Map<string, React.ComponentType<any>>();
TypographMap.set('P', P);
TypographMap.set('Span', Span);
TypographMap.set('Caption', Caption);

const ContentLoad = styled(ContentLoader)`
  flex: 1;
`;

const Loader: React.FC = memo(() => (
  <ContentLoad
    height="1.125rem"
    width="calc(100% - 24px)"
    title="carregando"
    backgroundColor={primaryColor.accent}
    foregroundColor={primaryColor.color}
    backgroundOpacity={0.25}
    foregroundOpacity={0.5}
  >
    <rect x="0" y="0" rx="3" ry="3" width="100%" height="18" />
  </ContentLoad>
));

const HideText: React.FC<HideTextProps> = ({
  text,
  defalutHiden = true,
  mask,
  onShow,
  iconColor,
  typograph,
  width,
}) => {
  const [hiden, setHiden] = useState<boolean>(defalutHiden);
  const [loading, setLoading] = useState<boolean>(false);

  const onChange = useCallback(async () => {
    if (!hiden) {
      setLoading(true);
      await onShow();
      setLoading(false);
    }
    setHiden(prev => !prev);
  }, [hiden, onShow]);

  const value = hiden ? text : mask.replace(/0|a/g, '•'); //'●'
  const Icon = hiden ? IcHide : IcShow;
  const Tipografy: React.ComponentType<any> = TypographMap.get(typograph) ?? P;
  return (
    <Row onClick={() => onChange()} className="pointer" gap="12px" align="center" width={width}>
      <Row flex="1">{loading ? <Loader /> : <Tipografy>{value}</Tipografy>}</Row>
      <Tipografy>
        <Icon color={iconColor} />
      </Tipografy>
    </Row>
  );
};
export default HideText;
