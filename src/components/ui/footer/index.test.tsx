import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import FooterMain from '.';
import { AuthContext, AuthContextData } from 'hooks/auth';
import { Usuario } from 'dtos/usuarios';

describe('ui', () => {
  describe('footer', () => {
    describe('index', () => {
      it('Deve renderizar', () => {
        let container = render(
          <AuthContext.Provider value={{ user: {} as Usuario } as AuthContextData}>
            <BrowserRouter>
              <FooterMain />
            </BrowserRouter>
          </AuthContext.Provider>,
        );
        expect(container.container.textContent).toContain('Tela Inicial');
      });

      it('Deve renderizar vazio', () => {
        const container = render(
          <AuthContext.Provider value={{} as AuthContextData}>
            <BrowserRouter>
              <FooterMain />
            </BrowserRouter>
          </AuthContext.Provider>,
        );
        expect(container.container.textContent).toBe('');
      });
    });
  });
});

export {};
