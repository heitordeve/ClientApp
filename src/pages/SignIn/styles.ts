import styled from 'styled-components';
import { shade } from 'polished';
import { backgroundPrimary } from 'styles/consts';

export const Container = styled.div`
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: row;
`;

export const Background = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 100%;

  text {
    color: ${backgroundPrimary};
  }
  p {
    color: #9e9e9e;
    font-weight: 400;
    font-size: 13px;
  }

  span {
    cursor: pointer;
    text-decoration: underline;
    color: ${backgroundPrimary};
  }

  .logo {
    max-width: 150px;
    display: flex;
    margin: 10px auto;
  }
  .imagem {
    padding: 20px 0 30px;
  }

  hr {
    width: 120%;
    border: 0.49px solid #6b6576;
  }
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 320px;

  p {
    color: #727387;
    font-weight: 600;
    margin: 0;
  }

  form {
    margin: 0px 0 10px;
    width: 100%;
    text-align: center;

    label {
      color: #a5a1ad;
      margin-left: 15px;
    }

    a {
      color: #727387;
      display: block;
      font-weight: 600;
      margin-top: 24px;
      text-decoration: none;
      transition: background-color 0.2s;

      &:hover {
        color: ${shade(0.2, '#727387')};
      }
    }

    > p {
      color: #898989;
      line-height: 28px;
      border-bottom: 1px solid #9c9c9c;
      margin-top: 24px;
      margin-bottom: 16px;
      padding-bottom: 16px;
      text-decoration: none;
      transition: background-color 0.2s;
    }
  }
`;

export const ButtonLinkDiv = styled.div`
  width: 100%;

  > a:first-child {
    text-decoration: none;

    display: flex;
    justify-content: center;
    flex-direction: column;

    /*#region Button style*/
    appearance: button;
    text-align: center;
    width: 100%;

    background: #672ed7;
    height: 56px;
    border-radius: 10px;
    border: 0;

    padding: 0 16px;
    color: #f4ede8;
    width: 100%;
    font-weight: 500;
    margin-top: 16px;
    transition: background-color 0.2s;

    &:hover {
      background: ${shade(0.2, '#672ED7')};
    }
    /*#endregion*/
  }
`;
