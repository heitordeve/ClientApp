import styled from 'styled-components';
import { FiX } from 'react-icons/fi';

export const CloseModalButton = styled(FiX)`
  position: absolute;
  color: #FFFFFF;
  right: -30px;
  top: 0;
  font-size: 20px;
  cursor: pointer;
`;

export const LabelPerfil = styled.a`
  font-size: 18px;
  color: #FFFFFF;

  :hover {
    color: #FFFFFF;
    text-decoration: underline;
    cursor: pointer;
}
`;

export const ListUser = styled.div`
  overflow-y: auto;
  max-height: 75vh;

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

export const FormList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border: inherit;
  overflow-y: auto;
  height: 50vh;
  width: 100%;

  padding-right: 5px;

  & > * {
    max-width: 100%;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }
`;

export const TextButton = styled.p`
  cursor: pointer;
  font-size: 18px;
  color: ${props => props.color};

  &:hover {
    font-weight: bold;
  }
`;

