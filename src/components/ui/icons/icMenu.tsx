import React from 'react';
import { IconType } from 'react-icons';

const IcMenu: IconType = ({ size, ...rest }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.5 5.75C19.5 6.16421 19.1642 6.5 18.75 6.5L4.75 6.5C4.33579 6.5 4 6.16421 4 5.75C4 5.33579 4.33579 5 4.75 5L18.75 5C19.1642 5 19.5 5.33579 19.5 5.75Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.5 11.75C19.5 12.1642 19.1642 12.5 18.75 12.5L4.75 12.5C4.33579 12.5 4 12.1642 4 11.75C4 11.3358 4.33579 11 4.75 11L18.75 11C19.1642 11 19.5 11.3358 19.5 11.75Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.5 17.75C19.5 18.1642 19.1642 18.5 18.75 18.5L4.75 18.5C4.33579 18.5 4 18.1642 4 17.75C4 17.3358 4.33579 17 4.75 17L18.75 17C19.1642 17 19.5 17.3358 19.5 17.75Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default IcMenu;
