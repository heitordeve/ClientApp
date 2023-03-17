import React, { memo } from 'react';
import { IllustrationType } from '../illustrations/baseIllustrations';
import { Column } from '../layout';
import { P, Caption } from '../typography/v2';

interface NoContentProps {
  title: string;
  legend: string;
  illustration: IllustrationType;
}

const NoContent: React.FC<NoContentProps> = ({ title, legend, illustration: Il }) => {
  return (
    <Column justify="center" align="center" flex="1" gap="32px">
      <Il size="200px" />
      <Column justify="center" align="center" gap="8px">
        <P size="SB">{title}</P>
        <Caption>{legend}</Caption>
      </Column>
    </Column>
  );
};

export default memo(NoContent);
