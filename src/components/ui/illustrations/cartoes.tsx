import React, { memo } from 'react';
import BaseIllustrations, { IllustrationType } from './baseIllustrations';

const IlCartoes: IllustrationType = props => {
  return (
    <BaseIllustrations viewBox="0 0 164 139" fill="none" {...props}>
      <rect y="54.7671" width="130" height="84" rx="15" fill="#F1F0FF" />
      <rect
        x="9.49805"
        y="61.6489"
        width="129.614"
        height="83.8681"
        rx="15"
        transform="rotate(-28.4005 9.49805 61.6489)"
        fill="#672ED7"
        fillOpacity="0.22"
      />
    </BaseIllustrations>
  );
};

export default memo(IlCartoes);
