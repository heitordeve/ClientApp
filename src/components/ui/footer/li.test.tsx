import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import Li from './li';

let container: HTMLDivElement = null;

describe('ui', () => {
  describe('footer', () => {
    describe('li', () => {
      beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
      });
      afterEach(() => {
        unmountComponentAtNode(container);
        container.remove();
        container = null;
      });

      it('Deve renderizar child e to', () => {
        act(() => {
          render(
            <BrowserRouter>
              <Li to="/conteudo">Conteúdo</Li>
            </BrowserRouter>,
            container,
          );
        });
        expect(container.textContent).toBe('Conteúdo');
        expect(container.getElementsByTagName('a')[0].getAttribute('href')).toBe('/conteudo');
      });
      it('Deve renderizar child, click e to="/"', () => {
        let clicked = false;
        const click = () => {
          clicked = true;
        };
        act(() => {
          render(
            <BrowserRouter>
              <Li onClick={click}>Conteúdo</Li>
            </BrowserRouter>,
            container,
          );
        });
        expect(container.textContent).toBe('Conteúdo');
        expect(container.getElementsByTagName('a')[0].getAttribute('href')).toBe('/');
        act(() => {
          container
            .getElementsByTagName('a')[0]
            .dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });
        expect(clicked).toBeTruthy();
      });
    });
  });
});

export {};
