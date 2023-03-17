import React from 'react';
import BaseIllustrations, { IllustrationType } from './baseIllustrations';

const IlImportant: IllustrationType = props => {
  return (
    <BaseIllustrations viewBox="0 0 100 100" fill="none" {...props}>
      <circle cx="50" cy="56" r="44" fill="#F1F0FE" />
      <path
        d="M41.5563 72.6079C44.9983 72.6079 47.8623 69.9719 48.1523 66.5419L52.6263 13.0999C52.8863 9.99986 51.8363 6.93586 49.7323 4.64786C47.6323 2.35986 44.6643 1.05786 41.5563 1.05786C38.4483 1.05786 35.4803 2.35986 33.3783 4.64586C31.2743 6.93386 30.2243 9.99786 30.4843 13.0979L34.9583 66.5399C35.2503 69.9699 38.1143 72.6079 41.5563 72.6079Z"
        fill="#AD8FEB"
      />
      <circle cx="41.5" cy="84.5" r="7.5" fill="#AD8FEB" />
    </BaseIllustrations>
  );
};

export default IlImportant;
