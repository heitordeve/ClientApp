import styled from 'styled-components';
import { breakpoint, media } from 'styles';

export const Container = styled.div``;

export const Footer = styled.footer`
  padding: 30px 10px 0 10px;
  background: #672ed7;

  .footer-link {
    color: #ffffff;
    font-size: 12px;
    cursor: pointer;
  }

  .footer-link:hover {
    color: #ff5f00;
    text-decoration: underline;
  }

  ${media.max(breakpoint.md)}  {
    ul {
      padding: 0 30px 0 30px;
    }

    .container-fluid .justify-content-center {
      display: block;
    }
  }
`;

export const Linha = styled.div`
  height: 150px;
  border-left: 2px solid;
  color: #c4c4c4;
  float: right;

  ${media.max(breakpoint.md)} {
    display: none;
  }
`;

export const Profile = styled.div``;
