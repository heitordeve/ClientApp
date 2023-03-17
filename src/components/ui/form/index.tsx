import { Form as UnForm } from '@unform/web';
import styled from 'styled-components';
import { Row, Column } from '../layout';

export const Form = styled(UnForm)`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  > ${Row},>${Column} {
    width: 100%;
  }
`;
