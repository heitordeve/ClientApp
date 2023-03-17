import styled from 'styled-components';

export const Card = styled.div`
  display: block;
  align-items: center;

  .btnRecharge {
    height: 40px;
    width: 250px;
    margin: 0 35px 0 35px;
  }

  img {
    display: block;
    width: 75px;
    position: absolute;
    margin: 1px;
    left: 0;
    top: 0;
  } 

  @media screen and (max-width: 900px) {
    img{
      padding-left: 10px;
      max-width: 50px;
    }
  }
`;

export const TextValues = styled.p`
    font-family: Roboto, Helvetica, Arial, sans-serif; 
    font-weight: 400;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.54);
`;

export const Section = styled.div`
    background: #fff;
    border-radius: 9px;
    width: 100%;
    min-height: 55px;
    display: flex;
    justify-content: center;
    border: 2px solid #d1ced6;
    color: #312e38;
    padding-top: 5px;
    margin: 30px 0;
    > div{
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;

      > div {
      justify-content: center;
      align-items: center;
      margin-right: 6px;
      }
      label {
        margin:0;
      }
    }
    
`;

export const ButtonRecharge = styled.button`
  height: 40px;
  width: 250px;
  margin: 0 35px 0 35px;
`;
