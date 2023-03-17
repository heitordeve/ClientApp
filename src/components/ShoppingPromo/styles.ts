import styled from 'styled-components';
import { shade } from 'polished';

export const LinkButton = styled.a`
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  text-decoration: none !important;
  padding: .375rem .75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: .25rem;
  color: ${props => props.theme.color};
  background-color: ${props => props.theme.backgroundColor};

  &:hover {
    color: ${props => props.theme.color};
    background-color: ${props => props.theme.backgroundColor? shade(0.2, props.theme.backgroundColor) : undefined }
  }
`;
