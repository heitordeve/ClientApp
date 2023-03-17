import styled from 'styled-components';

export const CarouselIndicatorsHolder = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 20px 0;

  & > * {
    color: #D1CED6;
  }

  & > *[class=carousel-dot-${props => props.theme.selected}] {
    color: #727387 !important;
  }

  & > *:hover {
    cursor: pointer;
  }
`;

export const CarouselControlHolder = styled.div`
  text-align: center;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 5vw;

  & > * {
    color: #D1CED6;
  }
`;

export const CarouselPageHolder = styled.div`
  height: max-content;
  width: max-content;
  overflow: hidden;

  & > div {
    width: fit-content;
    display: flex;
  }
`;

export const CarouselHolder = styled.div`
  display: grid;
  grid-auto-flow: column;
  width: fit-content;
`;
