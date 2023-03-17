import styled from 'styled-components';

export const ScrollBox = styled.div`
  max-height: 20vh;
  overflow-y: auto;
  padding: 0 5px;

  ::-webkit-scrollbar {
    width: 6px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &.alert {
    /* Handle */
    ::-webkit-scrollbar-thumb {
      background: #15CDF9;
      border-radius: 10px;
    }
  }

  &:not(.alert) {
    /* Handle */
    ::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 10px;
    }
  }
`;

export const BancoDataHolder = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;

  * {
    width: 100%;
    text-align: center;
    margin: 0;
  }

  *:nth-child(1):not(:last-child) {
    width: fit-content;
    text-align: left;
  }

  *:nth-child(2):not(:last-child) {
    width: fit-content;
    text-align: right;
  }
`;

export const LabelTitle = styled.div`
  font-family: Source Sans Pro;
  font-style: normal;
  font-weight: bold;
  font-size: 1.1rem;
  color: #707070;
  text-align: left;
`;

export const LabelText = styled.div`
  font-family: Source Sans Pro;
  font-style: normal;
  font-weight: bold;
  font-size: 1rem;
  color: #919191;
  text-align: left;
`;

export const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  width: 100%;

  & > * {
    width: 49%;
    margin: 0px;
  }

  & > *:nth-child(2) {
    margin-top: 0px !important;
  }

  @media only screen and (max-width: 1000px) {
    & > * {
      width: 100%;
    }

    & > *:nth-child(2) {
      margin-top: inherit !important;
    }
  }
`;

