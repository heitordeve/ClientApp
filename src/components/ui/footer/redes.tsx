import React, { memo } from 'react';
import { IconType } from 'react-icons';

interface LiProps {
  icon: IconType;
  href: string;
}
const Redes: React.FC<LiProps> = ({ icon: Icon, href}) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    <Icon size={20} style={{ color: '#F76C39' }} />
  </a>
);
export default memo(Redes);
