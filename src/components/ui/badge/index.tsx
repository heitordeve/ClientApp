import React from 'react';
import styled from 'styled-components';
import { secondary } from 'styles/consts';

interface HeaderIconeProps {
  children?: React.ReactNode;
  count?: number;
}
const Dot = styled.span`
  background: ${() => secondary};
  color: #fff;
  position: absolute;
  right: -15px;
  top: -15px;
  font-size: 15px;
  font-weight: bold;
  text-align: center;

  display: inline-block;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  margin: 5px;
`;
const Container = styled.div`
  position: relative;
`;

const Badge: React.FC<HeaderIconeProps> = ({ count = 0, children }) => {
  return (
    <Container>
      {count > 0 && <Dot>{count > 9 ? '9+' : count}</Dot>}
      {children}
    </Container>
  );
};

export default Badge;
