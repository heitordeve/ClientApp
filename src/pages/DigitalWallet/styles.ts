import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: start;

  .flexColumn{
    display: flex;
    flex-direction: column;
  }

  & > *:nth-child(1) {
    max-width: 33%;
    margin: 10px 5px;
  }

  & > *:nth-child(2) {
    max-width: 33%;
    margin: 10px 5px;

    & > *:nth-child(1) {
      margin-bottom: 5px;
    }
    & > *:nth-child(2) {
      margin-bottom: 5px;
    }
  }

  & > *:nth-child(3) {
    max-width: 33%;
    margin: 10px 5px;

    & > *:nth-child(1) {
      margin-bottom: 5px;
    }
    & > *:nth-child(2) {
      margin-bottom: 5px;

      .card-body {
        & > *:nth-child(2) {
          height: 210px;
        }
      }
    }
  }

  @media screen and (max-width: 1000px) {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    flex-direction: column;
    width: 100%;

    & > *:nth-child(1) {
      max-width: 90%;
      margin: 10px 5px;
    }

    & > *:nth-child(2) {
      max-width: 90%;
      margin: 10px 5px;

      & > *:nth-child(1) {
        margin-bottom: 5px;
      }
      & > *:nth-child(2) {
        margin-bottom: 5px;
      }
    }

    & > *:nth-child(3) {
      max-width: 90%;
      margin: 10px 5px;

      & > *:nth-child(1) {
        margin-bottom: 5px;
      }
      & > *:nth-child(2) {
        margin-bottom: 5px;

        .card-body {
          & > *:nth-child(2) {
            height: 210px;
          }
        }
      }
    }
  }
`;
