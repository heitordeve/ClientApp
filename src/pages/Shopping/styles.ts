import styled from 'styled-components';
import { FiSearch } from 'react-icons/fi';
import { Form } from '@unform/web';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;

  width: 100%;
  padding: 25px;

  @media screen and (max-width: 600px) {
    padding: 15px;
  }
`;

export const CarouselContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  & > * {
    flex-grow: 1;
  }
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  margin-bottom: 20px;
`;

export const HeaderLinkHolder = styled.div`
  margin-bottom: 5px;
`;

export const SearchForm = styled(Form)`
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;

  & > * {
    margin: 5px;
  }

  & *:focus {
    box-shadow: none !important;
  }

  & * {
    border: none !important;
  }

  & > *:last-child {
    flex: 2 2 0;
    min-width: 300px;
  }

  & > *:not(:last-child) {
    flex: 1 1 0;
    min-width: 150px;
  }

  & > select{
    min-width: 180px !important;
  }
`;

export const SearchButton= styled.button`
      background-color: #FFFFFF;
      display: flex;
      align-items: center;
`;

export const SearchIcon = styled(FiSearch)`
  color: #6B6576;
  font-size: 1.25rem;
`;

export const BodyHolder = styled.div`
  margin: 0 auto;
  width: 100%;
  max-height: 100vh;

  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  overflow-y: auto;

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
`;

export const RowHolder = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  margin: 20px 0;

  font-family: Source Sans Pro;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;

  text-align: center;

  color: #727387;
`;
