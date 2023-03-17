import styled from 'styled-components';

import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle
} from 'reactstrap';

export const Container = styled.div`
  position: relative;
  background: #fff;
  border-radius: 9px;
  padding: 16px;
  width: 100%;
  height: 55px;

  border: 2px solid #d1ced6;
  color: #312e38;

  display: flex;
  align-items: center;

  & + div {
    margin-top: 8px;
  }

  select {
    flex: 1;
    background: transparent;
    border: 0;
    color: #312e38;
    width: 100%;

    &::placeholder {
      color: #d1ced6;
    }
  }
`;


export const SmallContainer = styled.div`
  position: relative;
  background: #fff;

  border: 2px solid rgba(0,0,0,.125);
  border-radius: .25rem;

  display: flex;
  align-items: center;

  select {
    flex: 1;
    background: transparent;
    border: 0;
    color: #312e38;

    &::placeholder {
      color: #312e38;
    }
  }
`;

export const CreditCardContainer = styled(Dropdown)`
  position: relative;
  background: transparent;
  border-radius: 9px;
  padding: 16px;
  width: 100%;
  height: 55px;

  border: 2px solid #d1ced6;
  color: #312e38;

  display: flex;
  align-items: center;

  & + div {
    margin-top: 8px;
  }

  select {
    flex: 1;
    background: transparent;
    border: 0;
    color: #312e38;
    width: 100%;

    &::placeholder {
      color: #d1ced6;
    }
  }

  & > * {
    width: 100%;
  }

  img {
    max-width: 50px;
    max-height: 50px;
  }
`;

export const CreditCardSelector = styled(DropdownMenu)`
  margin-left: -16px;
  border-bottom-left-radius: 9px;
  border-bottom-right-radius: 9px;
  border-left: 2px solid #d1ced6;
  border-right: 2px solid #d1ced6;
  border-bottom: 2px solid #d1ced6;
  border-top: none;

  & > * {
    cursor: pointer;

    :hover {
      background-color: #d1ced6;
    }
  }
`;

export const CreditCardOption = styled(DropdownItem)`
  display: flex;
  justify-content: space-between;
`;

export const CreditCardToggle = styled(DropdownToggle)`
  display: flex;
`;
