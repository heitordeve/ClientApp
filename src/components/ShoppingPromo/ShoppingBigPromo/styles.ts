import styled from 'styled-components';
import { FiHeart, FiShare2 } from 'react-icons/fi';

export const BigPromoCard = styled.div`
  margin: 20px;
  max-width: 50%;
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0,0,0,.125);
  border-radius: .25rem;
  max-width: 450px;
  color: #FFFFFF;

  background-color: ${props => props.theme?.backgroundColor}
  
`;

export const BigPromoCardHead = styled.div`
  position: relative;
  text-align: center;
  padding: 10px;

  & > * {
    margin: 0 !important;
  }
`;

export const BigPromoCardHeader = styled.h1`
  font-weight: bold;
  font-size: 1.5rem;

  @media screen and (max-width: 600px) {
    font-weight: bold;
    font-size: 1.0rem;
  }
`;

export const BigPromoCardSecondaryHeader = styled.h2`
  font-weight: bold;
  font-size: 1.25rem;
  margin: 0.25rem 0;
`;

export const BigPromoCardOptions = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: right;

  & > * {
    margin-right: 10px;
  }
`;

export const BigPromoCardHr = styled.hr`
  background-color: #FFFFFF;
  width: 90%;
  margin: auto;
`;

export const BigPromoContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  width: 90%;
  margin: auto;
`;

export const PromoThumbnail = styled.img`
  background-color: #FFFFFF;
  height: 180px;
  width: 180px;
  margin: 0.5rem;
  border-radius: .25rem;
  object-fit: contain;

  @media screen and (max-width: 600px) {
    height: 100px;
    width: 100px;
  }
`;

export const BigPromoAbout = styled.div`
  width: 100%;
  text-align: center;
`;

export const BigPromoCardFooter = styled.div`
  position: relative;
  text-align: center;
  padding: 10px;

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

export const ShareIcon = styled(FiShare2)`
  font-size: 1.25rem;

  &:hover {
    cursor: pointer;
  }
`;
