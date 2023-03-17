import React, { memo } from 'react';
import { IconType } from 'react-icons';
import BaseIcon from './baseIcon';

const IcCheck: IconType = props => {
  return (
    <BaseIcon viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
    </BaseIcon>
  );
};

export default memo(IcCheck);
