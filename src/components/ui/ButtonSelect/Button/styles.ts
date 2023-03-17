import styled from 'styled-components';
import { shade } from 'polished';

const primary_color: string[] = ['#672ED7', '#FFFFFF', '#D9D0F8', '#E74040', '#15cdf9'];
const secondary_color: string[] = ['#F4EDE8', '#672ED7', '#672ED7', '#FFFFFF'];

export const Container = styled.button`
  background: #672ed7;
  height: 55px;
  border-radius: 10px;
  border: 0;
  padding: 0 16px;
  font-weight: 500;
  margin: 5px 5px;

  border: none;
  outline: none;

  &:focus {
    border: none;
    outline: none;
  }

  background-color: ${primary_color[0]};
  color: ${secondary_color[0]};
  transition: background-color 0.5s linear;
  transition: color 0.5s linear;

  &:hover {
    background: ${shade(0.2, primary_color[0])};
  }

  &.reverse-colors {
    background-color: ${primary_color[1]} !important;
    color: ${secondary_color[1]} !important;
    &:hover {
      background: ${shade(0.2, primary_color[1])} !important;
    }
  }

  &.secondary-colors {
    background-color: ${primary_color[4]} !important;
    color: ${secondary_color[3]} !important;
    &:hover {
      background: ${shade(0.2, primary_color[4])} !important;
    }
  }

  &.warning-colors {
    background-color: ${primary_color[3]} !important;
    color: ${secondary_color[3]} !important;
    &:hover {
      background: ${shade(0.2, primary_color[3])} !important;
    }
  }

  &.small {
    height: auto !important;
    min-height: 30px;
  }

  .noStyle {
    pointer-events: none;
    text-align: center;
    margin-bottom: 20px;
    border-color: #d1ced6;
    border-radius: 9px;
  }
`;
