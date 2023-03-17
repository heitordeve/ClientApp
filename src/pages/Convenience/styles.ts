import styled from 'styled-components';

export const Container = styled.div`
padding: 50px;
display: flex;
flex-direction: column;

.contentConvenience {
  width: 80%;
  margin: 30px auto;
  border-radius: 10px;
  background-color: #fff;
  height: 100%;
}

.linkwrap { position:relative; display:inline-block; }
.blocker { position:absolute; height:100%; width:100%; z-index:1;  }
.linkwrap iframe { z-index: 2; width: 100%; height: 100%;}

> div > h3 {
  color: #672ed7;
  font-weight: bold;

}

.assunto{
font-family: Source Sans Pro;
font-style: normal;
font-weight: bold;
font-size: 18px;

color: #28252E;
}

.pergunta{
  font-family: Source Sans Pro;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;

  color: #707070;
  }

  .resposta{
    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;

    color: #707070;
    }

    @media screen and (max-width: 600px) {
      padding: 0 0 30px;

      .contentConvenience {
        width: 100%;
      }
    }
`;


