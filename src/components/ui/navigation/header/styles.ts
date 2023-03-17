import styled from 'styled-components';
import { media, breakpoint } from 'styles';
import { mediaBreakpoint, primary, zIndex } from 'styles/consts';
import { Row } from '../../layout';

export const Header = styled.header`
  position:sticky;
  top:0px;
  padding: 0 6px;
  background: #fff;
  color: ${() => primary};
  z-index:${zIndex.header};
  user-select: none;

  * {
    align-items: center;
  }

  svg {
    cursor: pointer;
  }
.prod{
  position: fixed;
  top:0
}
  .logo {
    margin: 0 12px;
    max-height: 100px;
    ${media.max(breakpoint.sm)} {
      max-width: 100px;
    }
  }

  .user-name {
    font-style: normal;
    font-size: 20px;
    font-weight: bold;
    color: rgba(107, 101, 118, 1);
  }

  .user-image {
    width: 150px;
  }

  input {
    border-right: 0;
  }
  ${media.max(breakpoint.md)}  {
    .input-group-append {
      display: none;
    }
    flex-wrap: wrap;
    input {
      border-right: 1px solid #ced4da;
      border-top-right-radius: 0.25rem !important;
      border-bottom-right-radius: 0.25rem !important;
    }
  }
`;

export const HeaderContent = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  align-items: center;

  > img {
    height: 80px;
  }

  a {
    text-decoration: none;
    color: #d9d0f8;
  }

  button {
    color: #d9d0f8;
    margin-left: auto;
    background: transparent;
    border: 0;
  }
`;

export const FormList = styled.div`
  .form {
    padding-top: 10px;
    display: flex;
    justify-content: center;
    flex-direction: column;

    .btn-atualizar-dados {
      margin: 10px auto;
      background-color: #672ed7;
      width: 240px;
    }
  }

  .form-group {
    padding: 0 70px;

    label {
      margin-bottom: -10px;
      font-size: 0.8em;
      margin-left: 20px;
      padding: 0 5px;
      background-color: #fff;
      display: flex;
      position: relative;
      width: fit-content;
    }
  }
`;

export const ListUser = styled.div`
  .dropdown-item {
    height: 57px;
    display: flex;
    align-items: center;
    padding-left: 40px;
    .icon-menu {
      margin-right: 20px;
      color: rgba(196, 196, 196, 1);
    }
    a {
      text-decoration: none;
      color: #212529;
    }
  }
  .last {
    border-radius: 0 0 10px 10px;
  }
  .dropdown-item:hover {
    color: rgba(247, 108, 57, 1);
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
    .icon-menu {
      color: rgba(247, 108, 57, 1);
    }
    a {
      color: rgba(247, 108, 57, 1);
    }
  }
  .last:hover {
    border-radius: 0 0 10px 10px;
  }
`;

export const Menu = styled.div`
  @media screen and (max-width: ${mediaBreakpoint.mdMax}) {
    display:none;
  }
  padding: 20px;
  background: #672ed7;
  align-items: center;

  .link-card {
    border: 1.71824px solid #d1ced6;
    border-radius: 10px;
  }

  .link-card:hover {
    color: #ffffff;
    background-color: #15cdf9;
    border-radius: 10px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border: 1.71824px solid #d1ced600;
  }

  .current-card {
    color: #ffffff;
    background-color: #15cdf9;
    border-radius: 10px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border: 1.71824px solid #d1ced600;
  }

  a:hover {
    color: #ffffff;
    text-decoration: none;

    menu:hover {
      border: none;
    }
  }
`;
export const Profile = styled.div``;

export const CardMenu = styled.div`
  width: 130px;
  height: 130px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: start;
  flex-direction: column;
  text-align: center;
  padding-top: 25px;

  strong {
    color: #fff;
  }
`;

export const Nav = styled(Row).attrs({ as: 'nav' })``;

export const NavItem = styled.li`
  text-decoration: none;
  list-style: none;
`;

export const TextButton = styled.p`
  cursor: pointer;
  font-size: 18px;
  color: ${props => props.color};

  &:hover {
    font-weight: bold;
  }
`;
