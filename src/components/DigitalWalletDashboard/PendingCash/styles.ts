import styled from "styled-components";

export const CardSubtitle = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 1rem;
  color: #6b6576;
  text-align: center;
`;

export const Container = styled.div`
    height: 220px;
    overflow: auto;
    margin: 10px -20px -20px -20px;
    padding: 0 5px;

    .cash{
      font-family: Source Sans Pro;
      font-style: normal;
      font-weight: bold;
      font-size: 20px;
      
      color: #28252E;
    }

    .detailNum {
      font-family: Source Sans Pro;
      font-style: normal;
      font-weight: 600;
      font-size: 16px;

      color: #6B6576;

      > p {
        margin-bottom: 0;
      }

    }

    .dataPayment {
      font-family: Source Sans Pro;
      font-style: normal;
      font-weight: 600;
      font-size: 16px;

      color: #6B6576;

      > p {
        margin-bottom: 0;
      }

    }

    .textDate{
      font-family: Source Sans Pro;
      font-style: normal;
      font-weight: 600;
      font-size: 14px;

      color: #6B6576;
    }

    button {
      height: 45px;
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

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
      background: #555;
    }

    .semDinheiro {
        display: flex;
        justify-content: center;
        align-items: center;

        width: 100%;
        height: 100%;

      > h1{
        font-family: Source Sans Pro;
        font-style: normal;
        font-weight: bold;
        font-size: 24px;
        
        text-align: center;
        
        color: #707070;
      }
      
    }
`;

export const ContentModal = styled.div`
  display: flex !important;
  flex-direction: column !important;
  flex-wrap: wrap !important;
  justify-content: center !important;
  align-items: center !important;
  padding: 1.5rem 0.5rem !important;

  @media screen and (max-width: 900px) {
    #currencyInput {
      max-width: 65%;
    }
  }
`;