import styled from "styled-components";

export const CardSubtitle = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 1rem;
  color: #6b6576;
  text-align: center;
`;

export const Container = styled.div`
    height: 400px;
    overflow: auto;
    margin: 10px -20px -20px -20px;
    padding: 0 5px;

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

    .semExtrato {
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