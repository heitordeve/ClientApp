import styled from 'styled-components';
import { Column } from '../layout';
import { breakpoint, media } from 'styles';

export const NotificationCounterHolder = styled.span`
  font-size: 15px;
  font-weight: bold;
  text-align: center;

  color: #FFFFFF;
  background: #FF5F00;

  display: inline-block;
  border-radius: 50%;
  width: 22px;
  height: 22px;

  margin: 5px;
`;

export const TextUndefined = styled.p`
text-decoration: none;

cursor: none;

font-family: Source Sans Pro;
font-style: normal;
font-weight: bold;
font-size: 18px;

text-align: center;

color: #727387;
`;


export const NotificationCardHolder = styled.div`
  color: #6B6576;
  font-style: normal;
  display: flex;
  justify-content: center;
  align-items: center;


  border-bottom: 1px solid #6B6576;

  .notificationBody {
    display: flex;
    justify-content: start;
    align-items: start;
    flex-direction: column;
    width: 100%;

    padding: 10px;

    svg {
      font-size: 1.5em;
    }

    p {
      text-align: left;
      margin-bottom: 0;

      font-weight: bold;
    }

    span {
      margin-bottom: 10px;

      font-weight: bold;
    }
  }
`;

export const NotificationCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: .5rem;
  width: 100%;

  h2 {
    font-weight: bold;
    font-size: 1rem;
    margin: 0 0 0 5px;
    width: calc(100% - 1em);
    height: 1rem;
    overflow: hidden;
  }

  & > div:first-child {
    max-width: calc(100% - 2em);
  }

  button {
    background: none;
    border: none;
    color: #6B6576;

    &:focus {
      outline: none;
    }

    & > svg {
      color: #6B6576;
    }
  }
`;

interface ContentsProps {
  right: number;
}
export const Contents = styled.div <ContentsProps>`
  max-height: 100%;
  width: 350px;
  position: relative;
  top: 0;
  float: left;
  display:flex;

  &.hide{
    opacity:0;
  }
  & > * {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  .card{
    flex: 1;
  }

  .card-body {
    overflow-y: auto;
    ::-webkit-scrollbar {
      width: 3px;
    }
  }
  ${media.max(breakpoint.sm)} {
    width:100%;
    height:100%;
    .card{
      border:none;
      border-radius:0px;
    }
  }
  ${media.min(breakpoint.md)} {
    right: ${({ right }) => right}px;
    padding: .5rem;
    border-radius: .25rem;
    .card-body {
      max-height: 50vh;
    }
  }
`;
export const Container = styled(Column)`
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  overflow: hidden;
`;
