import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Column } from '../ui/layout';

export const TitleHeaderLink = styled.div`
    margin: 15px 0 0 100px;

    @media screen and (max-width: 600px) {
      margin: 0;
    }
`;

export const HeaderLink = styled(Link)`
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
  &.highlight {
    color: #F76C39;
  }
`;

export const FakeHeaderLink = styled.label`
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 94.5%;

  text-decoration: none;

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

export const Section = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-self: center;
    align-items:center;
`;

export const Content = styled(Column)`
  width: 450px;
  min-height: 100px;
  @media screen and (max-width: 600px) {
    width: 100%;
  }
`;
export const QRcode = styled.img`
  max-width: 350px;
`;
export const LogoOperadoraDiv = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display:flex;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
`;
export const LogoOperadora = styled.img`
  max-width: 50px;
  max-height: 50px;
  border-radius: 8px;

`;
