import styled from 'styled-components';
import { FiHeart } from 'react-icons/fi';


export const SmallPromoCard = styled.div`
  margin: 5px;
  padding: 5px;
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0,0,0,.125);
  border-radius: .25rem;
  flex-grow: 1;
  max-width: 250px;
  background-color: ${props => props.theme?.backgroundColor}
`;

export const SmallPromoCardHeader = styled.h3`
  font-weight: bold;
  font-size: 1.25rem;
`;

export const SmallPromoCardOptions = styled.div`
  position: absolute;
  right: 0;

  display: flex;
  align-items: center;
  justify-content: right;

  & > * {
    margin-right: 10px;
  }
`;

export const SmallPromoCardHr = styled.hr`
  background-color: rgba(0,0,0,.125);
  width: 90%;
  margin: auto;
`;

export const SmallPromoContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

export const SmallPromoStoreHeader = styled.h3`
  writing-mode: vertical-rl;
  text-orientation: sideways;
  margin: auto 0;
  font-weight: bold;
  font-size: 1.25rem;
  color: ${props => props.theme.color}
`;

export const SmallPromoAbout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 2rem;
`;

export const PromoThumbnail = styled.img`
  width: 75px;
  height: 75px;
  object-fit: contain;
  border-radius: .25rem;
  background-color: rgba(0, 0, 0, 0.25);
  margin: 5px;
`;

export const SmallPromoCardFooter = styled.div`
  position: relative;
  text-align: center;
  padding-top: 5px;

  & > * {
    margin: 0 !important;
  }
`;

export const HeartIcon = styled(FiHeart)`
  font-size: 1.25rem;

  &:hover {
    cursor: pointer;
  }
`;
