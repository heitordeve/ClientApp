import styled from 'styled-components';

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

  input {
    flex: 1;
    background: transparent;
    border: 0;
    color: #312e38;

    &::placeholder {
      color: #d1ced6;
    }
  }
`;
