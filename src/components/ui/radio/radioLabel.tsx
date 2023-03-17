import React from 'react';
import styled, { css } from 'styled-components';

import { Row, Column } from '../layout';
import { Radio, FormControlLabel } from '@material-ui/core';
import { IconType } from 'react-icons';

interface RadioLabelProps {
  readonly spaced?: string;
}

export const Container = styled(FormControlLabel)<RadioLabelProps>`
  ${({ spaced }) =>
    spaced &&
    css`
      margin: 0;
      &.MuiFormControlLabel-root {
        margin: 0;
      }

      .MuiTypography-root {
        flex: 1;
      }
      .MuiButtonBase-root {
        padding: 0;
      }
    `}
`;

interface InputImageProps {
  label: React.ReactNode;
  icon?: IconType;
  value: any | string | number;
}

const RadioLabel: React.FC<InputImageProps> = ({ label, icon: Icon, value }) => {
  return (
    <Container
      value={value}
      spaced="true"
      control={<Radio />}
      labelPlacement="start"
      label={
        <Row align="center" gap="8px">
          {Icon && <Icon color="primary" />}
          <Column>{label}</Column>
        </Row>
      }
    />
  );
};

export default RadioLabel;
