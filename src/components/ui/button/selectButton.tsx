import React, { useCallback, useEffect, useState } from 'react';

import { Grid } from '../layout';
import Button from '../button';

import { ColorScheme } from '../../../styles/consts';

interface SelectButtonProps {
  color?: ColorScheme;
  grow?: number | string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  buttons?: {
    value: string;
    text: string;
  }[];
}

const SelectButton: React.FC<SelectButtonProps> = ({
  onChange,
  grow,
  color = 'primary',
  buttons,
  defaultValue,
}) => {
  const [checked, setChecked] = useState(defaultValue);

  const handleClick = useCallback(
    (value: string) => {
      setChecked(value);
      onChange?.(value);
    },
    [onChange, setChecked],
  );
  useEffect(() => setChecked(defaultValue), [setChecked, defaultValue]);
  return (
    <Grid gap="12px" templateColumns="auto auto auto">
      {buttons.map(({ value, text }, i) => (
        <Button
          key={i}
          type="button"
          grow={grow}
          onClick={() => handleClick(value)}
          theme={checked === value ? 'default' : 'outlined'}
          border={true}
          color={color}
        >
          {text}
        </Button>
      ))}
    </Grid>
  );
};

export default SelectButton;
