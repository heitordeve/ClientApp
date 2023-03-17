import styled from 'styled-components';
import bgCreditCard from '../../assets/bgCreditCard.png';
import Button from '../ui/button';

export const CardItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  position: relative;
  margin: 5px 5px;

  height: 270px;
  width: 410px;

  background-image: url(${bgCreditCard});
  background-position-x: -10px;
  background-repeat: no-repeat;
  background-size: 110% 110%;
  box-shadow: 2.04726px 1.63781px 1.63781px rgba(0, 0, 0, 0.25);
  border-radius: 20px;

  .btn-secondary {
    color: #6c757d;
    background-color: #fff;
    border-color: #fff;
  }

  @media screen and (max-width: 600px) {
    max-width: 90%;
    margin: 5px 0;
    }
`;

export const DeleteButton = styled(Button)`
  width: 50%;
  margin: 10px;
`;
