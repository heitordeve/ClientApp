import React, { memo } from 'react';
import { IconType } from 'react-icons';
import BaseIcon from './baseIcon';

const IcEntrega: IconType = props => {
  return (
    <BaseIcon viewBox="0 0 24 24" fill="none" {...props}>
      <g clipPath="url(#clip0)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.983 0.241223C13.3398 -0.0804077 12.5826 -0.0804077 11.9394 0.241223L7.30559 2.55811C7.30187 2.55994 7.29816 2.5618 7.29446 2.56366L2.79991 4.81095C2.02583 5.19798 1.53687 5.98915 1.53687 6.85459V16.9915C1.53687 17.8568 2.02583 18.6481 2.79991 19.0351L11.9394 23.6048C12.059 23.6647 12.1826 23.7134 12.3086 23.7509C12.4819 23.9059 12.7105 24 12.9612 24C13.2119 24 13.4405 23.9059 13.6137 23.7509C13.7397 23.7134 13.8634 23.6647 13.983 23.6048L23.1224 19.0351C23.8965 18.6481 24.3855 17.8568 24.3855 16.9915V6.85459C24.3855 5.98915 23.8965 5.19798 23.1224 4.81095L13.983 0.241223ZM13.9404 21.4365L22.2466 17.2834C22.3572 17.2282 22.4271 17.1151 22.4271 16.9915V7.93347L13.9404 11.8939V21.4365ZM21.5161 6.19738L13.1072 1.99292C13.0152 1.94697 12.9071 1.94697 12.8152 1.99292L9.92822 3.43642L18.3785 7.66158L21.5161 6.19738ZM7.73859 4.53122L4.40628 6.19738L12.8232 10.1253C12.9107 10.1661 13.0117 10.1661 13.0992 10.1253L16.1134 8.71857L7.73859 4.53122ZM3.49532 7.93347V16.9915C3.49532 17.1151 3.56517 17.2282 3.67576 17.2834L11.982 21.4365V11.8939L3.49532 7.93347Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="24" height="24" fill="currentColor" transform="translate(0.536865)" />
        </clipPath>
      </defs>
    </BaseIcon>
  );
};

export default memo(IcEntrega);
