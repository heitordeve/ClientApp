import React, { useCallback, useEffect, useState } from 'react';
import ButtonCheck from './Button';

interface ButtonProps {
  name: string;
  buttonOptions: {
    value: any;
    text: string;
  }[],
  onChange?: (value: any) => void;
}

const ButtonSelect: React.FC<ButtonProps> = ({ name, buttonOptions, onChange }) => {
  const [check, setCheck] = useState(0);

  const handleClick = useCallback((event: React.MouseEvent<HTMLInputElement, globalThis.MouseEvent>) => {
    setCheck(Number(event.currentTarget.value));
  }, []);

  useEffect(() => {
    onChange?.call({}, buttonOptions[check].value);
  }, [buttonOptions, check, onChange])

  return (
    <div>
      { buttonOptions.map((buttonOption, index) =>
        <ButtonCheck key={buttonOption.value + '_' + index} name={name} check={check === index} value={index} onClick={handleClick}>
          {buttonOption.text}
        </ButtonCheck>
      )}
    </div>




  );
}

export default ButtonSelect;
