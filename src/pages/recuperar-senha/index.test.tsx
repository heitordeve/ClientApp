import React from 'react';
import { fireEvent, render, screen, getByText } from '@testing-library/react';
import RecuracaoDeSenha from '.';
import UsuarioApi from 'services/apis/usuarioApi';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { useAuth } from 'hooks/auth';
import { PATHS } from 'routes/rotas-path';

jest.mock('services/apis/usuarioApi');

let mockIsLoggedIn = true;
const mockSignOutFn = jest.fn();
jest.mock('hooks/auth', () => {
  return {
    useAuth: jest.fn(() => ({
      user: mockIsLoggedIn ? {} : null,
      signOut: mockSignOutFn,
    })),
  };
});

const mockedUsuarioApi = UsuarioApi as jest.Mocked<typeof UsuarioApi>;
const mockeduseAuth = useAuth as jest.Mocked<typeof useAuth>;

describe('recuperar-senha', () => {
  describe('logado', () => {
    beforeEach(() => {
      mockIsLoggedIn = true;
      const history = createMemoryHistory();
      const route = PATHS.recuperarSenha + '/23d3ee3f-6416-4fc7-b30b-c407668df8f9';
      history.push(route);
      render(
        <Router history={history}>
          <RecuracaoDeSenha />
        </Router>,
      );
    });
    it('habilitando o botão de submit', () => {
      const inputSenha = screen.getByTestId('senha');
      const inputConfirmacao = screen.getByTestId('confima-senha');
      const btnSubmit = screen.getByTestId('senha-btn');

      expect(btnSubmit).toBeDisabled();
      fireEvent.change(inputSenha, { target: { value: '123456A' } });
      expect(btnSubmit).toBeDisabled();
      fireEvent.change(inputConfirmacao, { target: { value: '123456A' } });
      expect(btnSubmit).not.toBeDisabled();
    });

    it('feedback validações', () => {
      const inputSenha = screen.getByTestId('senha');
      const inputConfirmacao = screen.getByTestId('confima-senha');
      const feedBack = screen.getByTestId('senha-feedback');
      const letras = getByText(feedBack, /letra/i);
      const numeros = getByText(feedBack, /número/i);
      const caracteres = getByText(feedBack, /caracteres/i);
      const confirmacao = getByText(feedBack, /confere/i);

      expect(letras).not.toHaveClass('ok');
      expect(numeros).not.toHaveClass('ok');
      expect(caracteres).not.toHaveClass('ok');
      expect(confirmacao).not.toHaveClass('ok');

      fireEvent.keyUp(inputSenha, { target: { value: 'A' } });
      fireEvent.keyUp(inputConfirmacao, { target: { value: 'A' } });
      expect(letras).toHaveClass('ok');
      expect(numeros).not.toHaveClass('ok');
      expect(caracteres).not.toHaveClass('ok');
      expect(confirmacao).toHaveClass('ok');

      fireEvent.change(inputSenha, { target: { value: '1' } });
      expect(letras).not.toHaveClass('ok');
      expect(numeros).toHaveClass('ok');
      expect(caracteres).not.toHaveClass('ok');
      expect(confirmacao).not.toHaveClass('ok');

      fireEvent.change(inputSenha, { target: { value: '12345A' } });
      expect(letras).toHaveClass('ok');
      expect(numeros).toHaveClass('ok');
      expect(caracteres).toHaveClass('ok');
      expect(confirmacao).not.toHaveClass('ok');

      fireEvent.change(inputConfirmacao, { target: { value: '12345A' } });
      expect(confirmacao).toHaveClass('ok');
    });

    it('submit', async () => {
      mockedUsuarioApi.RecuperarSenha.mockResolvedValue(true);

      const inputSenha = screen.getByTestId('senha');
      const inputConfirmacao = screen.getByTestId('confima-senha');
      const btnSubmit = screen.getByTestId('senha-btn');

      fireEvent.change(inputSenha, { target: { value: '123456A' } });
      fireEvent.change(inputConfirmacao, { target: { value: '123456A' } });
      fireEvent.click(btnSubmit);

      expect(mockedUsuarioApi.RecuperarSenha).toHaveBeenCalled();

      expect(window.location.pathname).toBe('/');
    });
  });

  it('signout', async () => {
    mockIsLoggedIn = false;
    const history = createMemoryHistory();
    const route = PATHS.recuperarSenha + '/23d3ee3f-6416-4fc7-b30b-c407668df8f9';
    history.push(route);
    render(
      <Router history={history}>
        <RecuracaoDeSenha />
      </Router>,
    );
    expect(mockSignOutFn).toBeCalled();
  });
});

export {};
