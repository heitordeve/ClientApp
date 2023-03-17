import styled from 'styled-components';

export const Card = styled.div`
  padding: 5px;
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;

  background: #FFFFFF;
  box-shadow: 2.04726px 1.63781px 1.63781px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
`;

export const CardLabel = styled.label`
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  flex-basis: 1 1 0;
`;

export const CardOptions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: stretch;
  align-content: center;
  & > * {
    margin: 0 5px;
  }
`;
