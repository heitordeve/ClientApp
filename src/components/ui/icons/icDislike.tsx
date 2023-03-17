import React, { memo } from 'react';
import { IconType } from 'react-icons';
import BaseIcon from './baseIcon';

const IcDislike: IconType = props => {
  return (
    <BaseIcon viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path
        d="M9.53687 21H18.5369C19.3669 21 20.0769 20.5 20.3769 19.78L23.3969 12.73C23.4869 12.5 23.5369 12.26 23.5369 12V10C23.5369 8.9 22.6369 8 21.5369 8H15.2269L16.1769 3.43L16.2069 3.11C16.2069 2.7 16.0369 2.32 15.7669 2.05L14.7069 1L8.11687 7.59C7.75687 7.95 7.53687 8.45 7.53687 9V19C7.53687 20.1 8.43687 21 9.53687 21ZM9.53687 9L13.8769 4.66L12.5369 10H21.5369V12L18.5369 19H9.53687V9ZM1.53687 9H5.53687V21H1.53687V9Z"
        fill="currentColor"
      />
    </BaseIcon>
  );
};

export default memo(IcDislike);
