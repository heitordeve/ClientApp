import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const FakeHeaderLink = styled.label`
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 94.5%;

  text-decoration: none;
  margin: 0;

  &:hover {
    cursor: pointer !important;
    text-decoration: underline;
  }

  &:not(.highlight) {
    color: #707070;
  }

  &.highlight {
    color: #F76C39;
  }
`;

 const HeaderLink = styled(Link)`
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 94.5%;

  text-decoration: none;

  &:not(.highlight) {
    color: #707070;
  }

  &.highlight {
    color: #F76C39;
  }
`;

export default HeaderLink;
