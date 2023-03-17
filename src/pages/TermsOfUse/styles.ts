import styled from 'styled-components';

export const Container = styled.div`
  width: 600px;
  margin: 30px auto;
  padding: 20px;
  border-radius: 10px;
  background-color: #fff;

  max-height: 500px;

  overflow: auto;

  #termsU{
    table {
      color: black;
      text-align: left;
    }
    table, td, th {
      border: 1px solid black;
  }
  td {
    width: 30vw;
  } 
  }

  @media screen and (max-width: 900px) {
    display: flex;
    self-align: center;
    width: 100%;
    
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


  @media screen and (max-width: 900px) {
    #termsU{
      display: flex;
      flex-wrap: wrap;
      max-width: 100%;
      word-break: break-all;
    }
  }
`;
