import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: start;
  justify-content: center;
  height: 100vh;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 700px;
  margin-top: 30px;

  .img {
    max-width: 300px;
    padding: 10px 0 20px 40px;
  }

  p {
    color: #f76c39;
    font-weight: bold;
    font-size: 20px;
    text-align: center;
  }

  button {
    text-decoration: none;
  }
`;

export const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  form {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .input-form{
      width: 300px;
      p{
        font-weight: bold;
        font-size: 12px;
        color: #919191;
      }
    }

    button{
      text-align:center;
      height: 45px;
      width: 300px;
    }
`;
