import React from 'react';
import Button from '../ui/button';
import imgFinalizedOrders from '../../assets/imgFinalizedOrders.png';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Hr } from '../ui/layout';

export const ContentCardNull = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 50px;
  padding: 10px 0;
  width: 100%;
  p {
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    margin-bottom: 0;
    color: #707070;
  }
  .infoOrders {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
    margin: 10px 0;
    max-width: 60%;

    p {
      line-height: 18px;
    }
  }
`;

const NoOrders: React.FC = () => {
  return (
    <ContentCardNull>
      <p>Nenhum pedido por aqui!</p>
      <Hr className="margim" />
      <img className="imagem" src={imgFinalizedOrders} alt={imgFinalizedOrders} />
      <div className="infoOrders">
        <p>
          Você ainda não fez nenhum pedido no KIM. Para fazer um pedido é muito simples, basta
          clicar no botão abaixo e escolher o serviço desejado.
        </p>
      </div>
      <div style={{ width: '70%' }}>
        <Link to="dashboard">
          <Button>Quero fazer um pedido</Button>
        </Link>
      </div>
    </ContentCardNull>
  );
};

export default NoOrders;
