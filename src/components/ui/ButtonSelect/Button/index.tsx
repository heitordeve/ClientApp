import React, { ButtonHTMLAttributes, useCallback } from 'react';

import { Container } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLInputElement> & {
  loading?: boolean;
  check: boolean;
};

const ButtonCheck: React.FC<ButtonProps> = ({ children, loading, check, ...rest }) => {

  const handleButton = useCallback(() => {
    let result;

    if (check === true) {
      result = (<Container className="secondary-colors" type="button" {...rest}>
        {loading ? 'Carregando...' : children}
      </Container>);
    } else {
      result = (<Container type="button" {...rest}>
        {loading ? 'Carregando...' : children}
      </Container>)
    }

    return result;
  }, [children, loading, check, rest]);

  return <>{handleButton()}</>
}

export default ButtonCheck;
