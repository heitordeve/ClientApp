import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { FaFacebook } from 'react-icons/fa';
import Redes from './redes';

let container: HTMLDivElement = null;

describe('ui', () => {
  describe('footer', () => {
    describe('redes', () => {
      beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
      });
      afterEach(() => {
        unmountComponentAtNode(container);
        container.remove();
        container = null;
      });

      it('Deve renderizar com ícone e href', () => {
        act(() => {
          render(<Redes icon={FaFacebook} href="www.com" />, container);
        });
        expect(container.textContent).toBe('');
        expect(container.getElementsByTagName('svg').length).toBe(1);
        expect(container.getElementsByTagName('a')[0].getAttribute('href')).toBe('www.com');
      });
    });
  });
});

export {};
