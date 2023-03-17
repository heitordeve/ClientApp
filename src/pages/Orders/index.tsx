import React from 'react';
import { Container } from './styles';
import TypeOrders from '../../components/TypeOrders';

import 'bootstrap/dist/css/bootstrap.min.css';

const Orders: React.FC = () => {
    return (
        <Container>
            <TypeOrders></TypeOrders>
        </Container>
    );
};

export default Orders;
