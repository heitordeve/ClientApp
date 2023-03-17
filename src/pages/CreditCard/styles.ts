import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    flex-wrap: wrap;
    padding: 30px;

  button {
    max-width: 500px;
  }

  p {
    margin: 0px;
  }

  > div > h3 {
    color: #672ed7;
    font-weight: bold;
  }

  .subCard {
    font-weight: 600;
    font-size: 12px;
    color: #432184;
  }

  .pCard {
    font-weight: 600;
    font-size: 14px;
    color: #432184;
  }

  .cursor-pointer {
    cursor: pointer;
  }

  @media screen and (max-width: 600px) {
    padding: 0;
    }
`;

export const Card = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  justify-content: center;
  margin: 5px 5px;

  height: 270px;
  width: 410px;

  background: #fff;
  box-shadow: 2.04726px 1.63781px 1.63781px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
`;

export const FavButton = styled.button`
  background: none;
  border: none;

  &.fav-on > svg.fav-svg-off,
  &.fav-off > svg.fav-svg-on {
    display: none;
  }

  &.fav-on > svg.fav-svg-no,
  &.fav-off > svg.fav-svg-off {
    display: inline;
  }

  &.fav-on:hover > svg.fav-svg-on,
  &.fav-off:hover > svg.fav-svg-off {
    display: none;
  }

  &.fav-on:hover > svg.fav-svg-off,
  &.fav-off:hover > svg.fav-svg-on {
    display: inline;
  }
`;
