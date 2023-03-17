import { DropdownMenu } from 'reactstrap';
import styled from 'styled-components';

export const CardItem = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  justify-content: center;
  margin: 5px 5px;

  flex: 1;

  height: 270px;
  max-width: 410px;

  background: #fff;
  border-radius: 20px;

  .treePoints {
    position: absolute;
    margin: 1px;
    padding: 15px 5px 5px 5px;
    right: 0;
    top: 0;
  }

  .btn-secondary {
    color: #6c757d;
    background-color: #fff;
    border-color: #fff;
  }

  .linkStyle{
    border: 0;
  text-decoration: none;
  outline: none;
  background: none;
  color: #212529;

  &:focus {
    border: none;
    outline: none;
  }
  }

  @media screen and (max-width: 900px) {
    max-width: 355px;
    margin: 5px 0;

    .treePoints {
      padding: 5px 6px 0 0;
      button{
        padding: 0;
      }
    }
  }
`;

export const ButtonDropDown = styled.span`
  border: 0;
  text-decoration: none;
  outline: none;
  background: none;

  &:focus {
    border: none;
    outline: none;
  }
`;

export const TransportRechargeDropdown = styled(DropdownMenu)`
background-color: #D9D0F8;


.dropdown-item{
  color: #672ed7 !important;
}

@media screen and (max-width: 900px) {
  .dropdown-item{
  margin-bottom: 15px;
  font-size: 1.5rem;
  }
}
`;