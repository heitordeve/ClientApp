import React, { memo } from 'react';
import { Link } from 'react-router-dom';

interface LiProps {
  children?: React.ReactNode;
  to?: string;
  onClick?: () => void;
}
const Li: React.FC<LiProps> = ({ children, to = '#', ...rest }) => (
  <li>
    <Link className="footer-link" to={to} {...rest}>
      {children}
    </Link>
  </li>
);
export default memo(Li);
