import React, { useState, useCallback } from 'react';
import { Container } from './styles';
import PessoaFisica from '../../pages/SignUp/PessoaFisica';
import PessoaJuridica from '../../pages/SignUp/PessoaJuridica';

enum TYPE_SIGNUP {
  PESSOA_FISICA = 'pessoaFisica',
  PESSOA_JURIDICA = 'pessoaJuridica',
}
const SignUp: React.FC = () => {
  const [typeSignUp, setTypeSignUp] = useState<TYPE_SIGNUP>(TYPE_SIGNUP.PESSOA_FISICA);

  const updateTypeSignUp = () => {
    if (typeSignUp === TYPE_SIGNUP.PESSOA_FISICA) {
      setTypeSignUp(TYPE_SIGNUP.PESSOA_JURIDICA);
    } else {
      setTypeSignUp(TYPE_SIGNUP.PESSOA_FISICA);
    }
  };

  return (
    <Container>
      {typeSignUp === TYPE_SIGNUP.PESSOA_FISICA ? (
        <PessoaFisica updateTypeSignUp={updateTypeSignUp} />
      ) : (
        <PessoaJuridica updateTypeSignUp={updateTypeSignUp} />
      )}
    </Container>
  );
};

export default SignUp;
