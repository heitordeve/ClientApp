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
  flex-direction: column;
  flex-wrap: wrap;

  * {
    margin: 0;
  }
`;

export const InnerIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;

  padding: 5px;

  & > svg, img {
    width: 30px;
    height: 30px;
    color: #6B6576;
    border-radius: 20%;
  }
`;

export const AlertCard = styled.div`
  background: #FDDEDE;
  color: #C53030;
  border-radius: 10px;
  padding: 5px;
`;
