import { createGlobalStyle } from 'styled-components';
import { media, breakpoint } from 'styles';
import { shadow, zIndex } from './consts'
export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: 0;
  }
  .fill-available{
    height: -webkit-fill-available;
  }
  html{
    scroll-behavior: smooth;
    height: -webkit-fill-available;
  }

  body {
    display: contents;
    background:#F2F2F2;
    color: rgb(0,0,0);
    -webkit-font-smoothing: antialiased;
    margin: 0;
    min-height: 100%;
    box-sizing: border-box;
  }

  body, input, button {
    font-family: 'Source Sans Pro', sans-serif;
    font-size: 16px;
  }
  #root{
    display: contents;
  }
  h1,h2,h3,h4,h5,h6, strong {
    font-weight: 500;
  }

  button {
    cursor: pointer;
  }

  footer {
  bottom: 0;
  width: 100%;
  }


  .reverseItems{
    ${media.max(breakpoint.md)} {
      flex-wrap: nowrap !important;
      flex-direction: column-reverse;
      overflow: auto;
    }
  }

  @media screen and (max-width: 992px) {
    footer{
     position: relative;
    }
  }
  .ReactModal__Overlay {
    z-index:${zIndex.modal};
  }
  .kim-modal{
    position: fixed;
    inset: 0px;
    background-color: rgba(0, 0, 0, 0.5);
    z-index:${zIndex.modal};
    & .kim-modal__Content{
      justify-content: center;
      margin: auto;
      background: none;
      border-radius: 0;
      padding: 0px;
      max-width: 100vw;
      max-height: 100vh;
      overflow-y: auto;
      overflow-x: visible;
      top: 0px;
      left: 0px;
      border: none;
      inset: 0;
      display: flex;
    }
  }
  ${media.min(breakpoint.md)}{
    .kim-modal{
      & .kim-modal__Content{
        border-radius: 10px;
        width: auto;
        bottom: auto;
        overflow: visible;
        justify-content: center;
        &:not(.popup){
          width: 100vw;
        }
      }
    }
  }
  ${media.max(breakpoint.md)}{
    .kim-modal{
      & .kim-modal__Content.popup{
        border-radius: 10px;
        >div{
          flex:1
        }
      }

    }
  }
  ${media.max(breakpoint.sm)}{
    .kim-modal{
      & .kim-modal__Content:not(.popup){
        height:100vh;
        width:100vw;
      }
    }
  }
  .ReactModal__Body--open{
    overflow-y: hidden;
  }

  /*shadow*/
  .shadow{
    &-1{
      box-shadow: ${shadow[1]};
    }
    &-2{
    box-shadow: ${shadow[2]};
    }
    &-3{
      box-shadow: ${shadow[3]};
    }
    &-4{
      box-shadow: ${shadow[4]};
    }
    &-5{
      box-shadow: ${shadow[5]};
    }
  }
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
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
  ${media.max(breakpoint.sm)} {
      .no-sm{
      display: none;
    }
  }
  ${media.minMax(breakpoint.md, breakpoint.md)} {
      .no-md{
      display: none;
    }
  }
  ${media.min(breakpoint.lg)} {
      .no-lg{
      display: none;
    }
  }
  .pointer{
    cursor: pointer;
  }
  .flex{
    display:flex;
  }
  .flex-1{
    flex:1;
    max-height:100%;
    max-width:100%;
  }
`;

