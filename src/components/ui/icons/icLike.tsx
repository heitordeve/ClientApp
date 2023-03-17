import React, { memo } from 'react';
import { IconType } from 'react-icons';
import BaseIcon from './baseIcon';

const IcLike: IconType = props => {
  return (
    <BaseIcon viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path
        d="M15.5369 3H6.53687C5.70687 3 4.99687 3.5 4.69687 4.22L1.67687 11.27C1.58687 11.5 1.53687 11.74 1.53687 12V14C1.53687 15.1 2.43687 16 3.53687 16H9.84687L8.89686 20.57L8.86687 20.89C8.86687 21.3 9.03687 21.68 9.30687 21.95L10.3669 23L16.9569 16.41C17.3169 16.05 17.5369 15.55 17.5369 15V5C17.5369 3.9 16.6369 3 15.5369 3ZM15.5369 15L11.1969 19.34L12.5369 14H3.53687V12L6.53687 5H15.5369V15ZM19.5369 3H23.5369V15H19.5369V3Z"
        fill="currentColor"
      />
    </BaseIcon>
  );
};

export default memo(IcLike);
