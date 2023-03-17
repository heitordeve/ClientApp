import { shade } from 'polished';
import styled from 'styled-components';
import { Column } from '../../../components/ui/layout';

export const Container = styled.div`
  display: flex;
  align-items: start;
  justify-content: center;
  margin: 60px 0;
`;

export const Content = styled(Column)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 700px;

  .img {
    max-width: 500px;
    padding: 10px 0 20px 40px;
  }

  p {
    color: #707070;
    font-weight: bold;
    font-size: 18px;
    text-align: center;
  }

  button {
    text-decoration: none;
  }

  .ReactModalPortal > div > div > .headerModal{
    display: flex;
    justify-content: start;
    width: 100%;
    background: #672ED7;
    color: #FFF;
    height: 20%;
  }

  @media screen and (max-width: 1000px) {
    .img {
      max-width: 80vw;
      padding: 0;
      margin: 0 auto
    }
  }
`;

export const GroupButtons = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

     width: 90%;

     margin: 10px 0;

     .buttonAlternative {
      border:  1px solid #D1CED6;
      color: #672ED7;
      background: #F2F2F2;
      font-weight: bold;
     }


     .buttonAlternative:hover {
      background:  ${shade(0.2, '#F2F2F2')};

     }


     .buttonPrincipal {
        border:  1px solid #D1CED6;
        color: #FFF;
        background: #F76C39;
        font-weight: bold;
       }
       .buttonPrincipal:hover{
        background: ${shade(0.2, '#F76C39')};
       }

`;

export const SectionService = styled.div`
  display: flex;

  align-items: center;

  color: #D1CED6;

  margin: 10px 30px;

  padding: 20px 30px;

  border: 1px solid #D1CED6;
  box-sizing: border-box;
  border-radius: 10px;
`;

export const ContentCreateModal = styled.div`
display: flex;
justify-content: center;
align-items: center;
flex-grow: 1;

margin-top: 50px;

.form-group{
  div {
    width: 100%;
  }
}


`;

export const HeaderModal = styled.div`
display: flex;
align-items: center;
justify-content: center;


font-weight: bold;
font-size: 21px;


position: absolute;
width: 100%;
height: 79px;

color: #FFF;

top: 0;
left: 0;

background: #672ED7;
box-shadow: 0px 2.54168px 2.54168px rgba(0, 0, 0, 0.25);
border-radius: 10px 10px 0px 0px;
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
  }
`;
