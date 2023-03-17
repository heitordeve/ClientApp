import React from 'react';
import { IconType } from 'react-icons';

const IcSearch: IconType = ({ size, ...rest }) => {
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
        d="M10.7033 16.6566C7.41539 16.6566 4.75 13.9912 4.75 10.7033C4.75 7.41539 7.41539 4.75 10.7033 4.75C13.9912 4.75 16.6566 7.41539 16.6566 10.7033C16.6566 12.2601 16.059 13.6774 15.0807 14.7382C15.0116 14.7722 14.9466 14.8175 14.8885 14.8741C14.8252 14.9357 14.7752 15.0057 14.7384 15.0806C13.6775 16.059 12.2602 16.6566 10.7033 16.6566ZM15.4088 16.4837C14.1257 17.5295 12.4877 18.1566 10.7033 18.1566C6.58696 18.1566 3.25 14.8197 3.25 10.7033C3.25 6.58696 6.58696 3.25 10.7033 3.25C14.8197 3.25 18.1566 6.58696 18.1566 10.7033C18.1566 12.495 17.5244 14.139 16.471 15.4244L20.4163 19.4767C20.7053 19.7735 20.6989 20.2483 20.4021 20.5372C20.1054 20.8262 19.6305 20.8198 19.3416 20.5231L15.4088 16.4837Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default IcSearch;
