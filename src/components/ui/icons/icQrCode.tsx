import React from 'react';
import { IconType } from 'react-icons';

const IcQrCode: IconType = ({ size, ...rest }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="1.5" y="1.5" width="8" height="8" stroke="currentColor" />
      <rect x="3" y="3" width="5" height="5" fill="currentColor" />
      <rect x="14.5" y="1.5" width="8" height="8" stroke="currentColor" />
      <rect x="16" y="3" width="5" height="5" fill="currentColor" />
      <rect x="18" y="18" width="5" height="5" fill="currentColor" />
      <rect x="1.5" y="14.5" width="8" height="8" stroke="currentColor" />
      <rect x="3" y="16" width="5" height="5" fill="currentColor" />
      <line x1="14.5" y1="14" x2="14.5" y2="23" stroke="currentColor" />
      <line x1="14" y1="14.5" x2="23" y2="14.5" stroke="currentColor" />
      <line x1="16.5" y1="16" x2="16.5" y2="23" stroke="currentColor" />
      <line x1="16" y1="16.5" x2="23" y2="16.5" stroke="currentColor" />
    </svg>
  );
};

export default IcQrCode;
